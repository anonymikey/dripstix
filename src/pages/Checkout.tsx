import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (items.length === 0 && paymentState === "form") {
    navigate("/cart");
    return null;
  }

  const validateForm = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (form.name.trim().length > 100) {
      toast.error("Name must be less than 100 characters");
      return false;
    }
    if (!/^[0-9+\s]{9,15}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid phone number (9-15 digits)");
      return false;
    }
    if (form.location.trim().length > 255) {
      toast.error("Location must be less than 255 characters");
      return false;
    }
    return true;
  };

  const pollPaymentStatus = (checkoutRequestId: string, orderId: string) => {
    let attempts = 0;
    const maxAttempts = 24; // 2 minutes (every 5 seconds)

    pollingRef.current = setInterval(async () => {
      attempts++;

      try {
        const { data, error } = await supabase.functions.invoke("mpesa-check-status", {
          body: { checkout_request_id: checkoutRequestId, order_id: orderId },
        });

        if (data?.success && data?.status === "completed") {
          clearInterval(pollingRef.current!);
          setPaymentState("success");
          clearCart();
          toast.success("Payment received! Your order is confirmed.");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        if (data?.status === "failed") {
          clearInterval(pollingRef.current!);
          setPaymentState("failed");
          toast.error("Payment failed. Please try again.");
          return;
        }
      } catch (err) {
        // Continue polling on network errors
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollingRef.current!);
        setPaymentState("failed");
        toast.error("Payment timed out. Check your M-PESA and try again.");
      }
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setPaymentState("processing");

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_name: form.name, phone_number: form.phone, delivery_location: form.location, total: subtotal })
        .select()
        .single();
      if (orderError) throw orderError;

      // Create order items
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

      // Initiate STK Push
      const { data: stkData, error: stkError } = await supabase.functions.invoke("mpesa-stk-push", {
        body: {
          phone: form.phone,
          amount: subtotal,
          reference: `ORD_${order.id.slice(0, 8).toUpperCase()}`,
          order_id: order.id,
        },
      });

      if (stkError || !stkData?.success) {
        throw new Error(stkData?.message || "Failed to initiate M-PESA payment");
      }

      // Start polling for payment status
      setPaymentState("polling");
      pollPaymentStatus(stkData.checkout_request_id, order.id);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
      setPaymentState("form");
    } finally {
      setLoading(false);
    }
  };

  if (paymentState === "polling" || paymentState === "success" || paymentState === "failed") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center justify-center pt-32 pb-20 text-center">
          {paymentState === "polling" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Waiting for M-PESA confirmation...</h1>
              <p className="mt-2 text-muted-foreground">Check your phone and enter your M-PESA PIN to complete payment.</p>
              <p className="mt-4 text-xs text-muted-foreground">This may take up to 2 minutes.</p>
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
              <button
                onClick={() => setPaymentState("form")}
                className="mt-6 gradient-brand rounded-full px-8 py-3 font-display text-sm font-semibold text-primary-foreground"
              >
                Try Again
              </button>
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-24 pb-20">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
          Check<span className="text-primary">out</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone Number (M-PESA)</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Nairobi, Westlands" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.style}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} ({item.style}) × {item.quantity}</span>
                  <span className="font-medium text-foreground">KES {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between">
              <span className="font-display font-bold text-foreground">Total</span>
              <span className="font-display text-xl font-black text-foreground">KES {subtotal}</span>
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gradient-brand w-full rounded-full py-4 font-display text-sm font-semibold text-primary-foreground uppercase tracking-wider disabled:opacity-50">
            {loading ? "Processing..." : "Confirm & Pay with M-PESA"}
          </motion.button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
