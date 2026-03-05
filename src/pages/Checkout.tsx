import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_name: form.name, phone_number: form.phone, delivery_location: form.location, total: subtotal })
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

      toast.success("Order confirmed! You'll receive an M-PESA prompt shortly.");
      clearCart();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-24 pb-20">
        <h1 className="font-display text-4xl font-black">
          Check<span className="text-secondary">out</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone Number (M-PESA)</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Delivery Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Nairobi, Westlands" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.style}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} ({item.style}) × {item.quantity}</span>
                  <span className="font-medium">KES {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between">
              <span className="font-display font-bold">Total</span>
              <span className="font-display text-xl font-black text-secondary">KES {subtotal}</span>
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gradient-neon w-full rounded-full py-4 font-display text-lg font-bold text-primary-foreground disabled:opacity-50">
            {loading ? "Placing Order..." : "Confirm & Pay with M-PESA"}
          </motion.button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
