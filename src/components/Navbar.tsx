import { Link } from "react-router-dom";
import { ShoppingCart, ArrowUpRight, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-foreground">Drip</span>
          <span className="text-gradient">Stix</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Shop</Link>
          <Link to="/affiliate" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Affiliate</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 gradient-brand rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Shop Now
          </Link>
          <button className="sm:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container flex flex-col gap-4 py-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Home</Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Shop</Link>
              <Link to="/affiliate" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Affiliate</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Cart {totalItems > 0 && `(${totalItems})`}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
