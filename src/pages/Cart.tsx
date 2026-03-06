import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen page-bg">
        <PageBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="container flex flex-col items-center justify-center pt-32 pb-20 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">Time to add some drip!</p>
            <Link to="/shop" className="gradient-brand mt-8 inline-flex rounded-full px-8 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-primary/25">
              Browse Shop
            </Link>
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
        <div className="container pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
            Your <span className="text-gradient">Cart</span>
          </h1>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.style}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4"
              >
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.style}</p>
                  <p className="mt-1 font-display font-bold text-foreground">KES {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, item.style, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:border-muted-foreground">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-foreground">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.style, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:border-muted-foreground">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.productId, item.style)} className="text-muted-foreground transition-colors hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <span className="font-display text-xl font-bold text-foreground">Subtotal</span>
            <span className="font-display text-2xl font-black text-foreground">KES {subtotal}</span>
          </div>

          <div className="mt-6 flex justify-end">
            <Link to="/checkout" className="gradient-brand rounded-full px-10 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105">
              Proceed to Checkout
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
