import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentState = "form" | "processing" | "polling" | "success" | "failed";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("form");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-check affiliate by phone number
  const [affiliateInfo, setAffiliateInfo] = useState<{ code: string; discount_percent: number } | null>(null);
  const [checkingAffiliate, setCheckingAffiliate] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const phone = form.phone.trim();
    if (phone.length < 9) {
      setAffiliateInfo(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setCheckingAffiliate(true);
      try {
        const { data } = await supabase
          .from("affiliate_codes")
          .select("code, discount_percent, is_active")
          .eq("phone_number", phone)
          .eq("is_active", true)
          .maybeSingle();
        setAffiliateInfo(data ? { code: data.code, discount_percent: data.discount_percent } : null);
      } catch {
        setAffiliateInfo(null);
      } finally {
        setCheckingAffiliate(false);
      }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.phone]);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const discountRate = affiliateInfo?.discount_percent || 0;
  const discountAmount = discountRate > 0 ? Number(((subtotal * discountRate) / 100).toFixed(2)) : 0;
  const payableTotal = Math.max(subtotal - discountAmount, 0);

  if (items.length === 0 && paymentState === "form") { navigate("/cart"); return null; }

  const validateForm = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) { toast.error("Please fill in all fields"); return false; }
    if (form.name.trim().length > 100) { toast.error("Name must be less than 100 characters"); return false; }
    if (!/^[0-9+\s]{9,15}$/.test(form.phone.trim())) { toast.error("Please enter a valid phone number (9-15 digits)"); return false; }
    if (form.location.trim().length > 255) { toast.error("Location must be less than 255 characters"); return false; }
    return true;
  };

  const pollPaymentStatus = (checkoutRequestId: string, orderId: string) => {
    let attempts = 0;
    const maxAttempts = 24;
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const { data } = await supabase.functions.invoke("mpesa-check-status", { body: { checkout_request_id: checkoutRequestId, order_id: orderId } });
        if (data?.success && data?.status === "completed") { clearInterval(pollingRef.current!); setPaymentState("success"); clearCart(); toast.success("Payment received! Your order is confirmed."); setTimeout(() => navigate("/"), 3000); return; }
        if (data?.status === "failed") { clearInterval(pollingRef.current!); setPaymentState("failed"); toast.error("Payment failed. Please try again."); return; }
      } catch (_) {}
      if (attempts >= maxAttempts) { clearInterval(pollingRef.current!); setPaymentState("failed"); toast.error("Payment timed out. Check your M-PESA and try again."); }
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setPaymentState("processing");
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          phone_number: form.phone,
          delivery_location: form.location,
          total: subtotal,
          affiliate_code: affiliateInfo?.code || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        style: item.style,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      const { data: stkData, error: stkError } = await supabase.functions.invoke("mpesa-stk-push", { body: { order_id: order.id } });
      if (stkError || !stkData?.success) throw new Error(stkData?.message || "Failed to initiate M-PESA payment");
      setPaymentState("polling");
      pollPaymentStatus(stkData.checkout_request_id, order.id);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
      setPaymentState("form");
    }
    finally { setLoading(false); }
  };

  const inputClass = "mt-2 w-full rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  if (paymentState === "polling" || paymentState === "success" || paymentState === "failed") {
    return (
      <div className="min-h-screen page-bg">
        <PageBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="container flex flex-col items-center justify-center pt-32 pb-20 text-center">
            {paymentState === "polling" && (
              <>
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Waiting for M-PESA confirmation...</h1>
                <p className="mt-2 text-muted-foreground">Check your phone and enter your M-PESA PIN to complete payment.</p>
              </>
            )}
            {paymentState === "success" && (
              <>
                <CheckCircle2 className="h-16 w-16 text-primary" />
                <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Payment Successful!</h1>
                <p className="mt-2 text-muted-foreground">Your order has been confirmed. Redirecting...</p>
              </>
            )}
            {paymentState === "failed" && (
              <>
                <XCircle className="h-16 w-16 text-destructive" />
                <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Payment Failed</h1>
                <p className="mt-2 text-muted-foreground">Please try again or contact support.</p>
                <button onClick={() => setPaymentState("form")} className="mt-6 gradient-brand rounded-full px-8 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-primary/25">Try Again</button>
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="container max-w-2xl pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
            Check<span className="text-gradient">out</span>
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone Number (M-PESA)</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className={inputClass} />
              {checkingAffiliate && <p className="mt-2 text-xs text-muted-foreground">Checking for affiliate discount...</p>}
              {affiliateInfo && (
                <p className="mt-2 text-xs font-medium text-primary">🎉 {affiliateInfo.discount_percent}% affiliate discount will be applied!</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Nairobi, Westlands" className={inputClass} />
            </div>

            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.style}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-foreground">KES {item.price * item.quantity}</span>
                  </div>
                ))}
                {affiliateInfo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Affiliate discount ({affiliateInfo.discount_percent}%)</span>
                    <span className="font-medium text-primary">- KES {discountAmount}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 border-t border-border pt-4 flex justify-between">
                <span className="font-display font-bold text-foreground">Total</span>
                <span className="font-display text-xl font-black text-foreground">KES {affiliateInfo ? payableTotal : subtotal}</span>
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gradient-brand w-full rounded-full py-4 font-display text-sm font-semibold text-white uppercase tracking-wider shadow-lg shadow-primary/25 disabled:opacity-50">
              {loading ? "Processing..." : "Confirm & Pay with M-PESA"}
            </motion.button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Checkout;
