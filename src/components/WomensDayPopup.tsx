import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import iwdPoster from "@/assets/iwd-poster.jpg";

const WomensDayPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const today = new Date();
    // Only show on March 8th
    if (today.getMonth() !== 2 || today.getDate() !== 8) return;

    // Only show once per session
    const dismissed = sessionStorage.getItem("iwd-dismissed");
    if (dismissed) return;

    // Small delay so splash screen finishes first
    const timer = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("iwd-dismissed", "true");
  };

  // Schedule auto-close at midnight
  useEffect(() => {
    if (!show) return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms = midnight.getTime() - now.getTime();
    const timer = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-950/90 via-purple-950/90 to-fuchsia-950/90 shadow-2xl shadow-pink-500/20"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:bg-black/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Floating decorations */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute left-4 top-4"
            >
              <Sparkles className="h-5 w-5 text-yellow-400/60" />
            </motion.div>
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute right-12 top-6"
            >
              <Heart className="h-4 w-4 text-pink-400/60" />
            </motion.div>

            {/* Poster image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={iwdPoster}
                alt="Happy International Women's Day"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-xl font-black tracking-tight text-white"
              >
                Happy Women's Day! 💜
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm text-pink-200/80"
              >
                From all of us at DripStix — celebrating the strength, beauty, and brilliance of every woman. You inspire us! ✨
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleClose}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-transform hover:scale-105"
              >
                <Heart className="h-3.5 w-3.5" /> Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WomensDayPopup;
