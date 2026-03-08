import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "hsl(222 47% 5%)" }}
        >
          {/* Animated background orbs */}
          <motion.div
            className="absolute h-[500px] w-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.4), transparent 70%)" }}
            initial={{ scale: 0, x: -100, y: -100 }}
            animate={{ scale: 1.2, x: 0, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute h-[300px] w-[300px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(280 65% 60% / 0.5), transparent 70%)" }}
            initial={{ scale: 0, x: 150, y: 150 }}
            animate={{ scale: 1, x: 80, y: 80 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
          />

          <div className="relative text-center">
            {/* Logo text */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl font-black tracking-tight sm:text-8xl md:text-9xl"
              >
                <span className="text-foreground">Drip</span>
                <span className="text-gradient">Stix</span>
              </motion.h1>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-4 h-1 w-20 origin-center rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(217 91% 60%), hsl(280 65% 60%))" }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground"
            >
              Stick Your Style
            </motion.p>

            {/* Loading dots */}
            <div className="mt-8 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
