import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AffiliateBubble = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const dismissed = sessionStorage.getItem("affiliate-bubble-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    sessionStorage.setItem("affiliate-bubble-dismissed", "true");
  };

  const go = () => {
    setVisible(false);
    sessionStorage.setItem("affiliate-bubble-dismissed", "true");
    navigate("/affiliate");
  };

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={go}
          className="fixed bottom-6 right-6 z-50 flex max-w-[280px] cursor-pointer items-start gap-3 rounded-2xl border border-primary/20 bg-card p-4 shadow-xl shadow-primary/10 backdrop-blur-md sm:max-w-xs"
        >
          {/* Pulse ring */}
          <span className="absolute -left-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
          </span>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Gift className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Get 20% Off! 🎉
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Join our affiliate program, share & earn discounts on your next order!
            </p>
          </div>

          <button
            onClick={dismiss}
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AffiliateBubble;
