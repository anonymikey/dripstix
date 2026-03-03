import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 600);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-body text-lg tracking-widest text-muted-foreground uppercase"
            >
              Welcome To
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 120 }}
              className="mt-4 font-display text-7xl font-black tracking-tight sm:text-9xl"
            >
              <span className="text-primary neon-glow-blue">Drip</span>
              <span className="text-secondary neon-glow-pink">Stix</span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mx-auto mt-6 h-0.5 w-32 origin-left gradient-neon"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
