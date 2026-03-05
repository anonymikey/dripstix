import { Link } from "react-router-dom";
import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-foreground">Drip</span>
          <span className="text-primary">Stix</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Shop
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Shop Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
