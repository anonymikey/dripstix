import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Share2, Wallet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AffiliateBubble = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const shown = sessionStorage.getItem("affiliate-popup-shown");
    if (shown) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("affiliate-popup-shown", "true");
    }, 3500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const dismiss = () => {
    setVisible(false);
  };

  const go = () => {
    setVisible(false);
    navigate("/affiliate");
  };

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 shadow-2xl shadow-primary/20"
          >
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-full bg-background/40 p-1.5 text-foreground/80 backdrop-blur transition hover:bg-background/70 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 text-center">
              {/* Icon badge */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/40"
              >
                <Gift className="h-8 w-8 text-primary-foreground" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary"
              >
                <Sparkles className="h-3 w-3" /> Limited Offer
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 font-display text-2xl font-black tracking-tight text-foreground"
              >
                Earn 20% on Every Sale
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                Join the DripStix affiliate squad — share your link, get friends 20% off, and pocket 20% commission on every order.
              </motion.p>

              {/* Perks */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-5 grid grid-cols-2 gap-2 text-left"
              >
                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/40 p-2.5">
                  <Share2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">Share & track</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/40 p-2.5">
                  <Wallet className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">M-Pesa payouts</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-5 flex flex-col gap-2"
              >
                <button
                  onClick={go}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]"
                >
                  Join the Program
                </button>
                <button
                  onClick={dismiss}
                  className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Maybe later
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AffiliateBubble;
