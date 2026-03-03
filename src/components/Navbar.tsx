import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl font-black tracking-tight">
          <span className="text-primary neon-glow-blue">Drip</span>
          <span className="text-secondary neon-glow-pink">Stix</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Shop
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
