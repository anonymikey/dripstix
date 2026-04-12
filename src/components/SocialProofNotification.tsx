import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import customerAmina from "@/assets/customer-amina.jpg";
import customerBrian from "@/assets/customer-brian.jpg";
import customerFaith from "@/assets/customer-faith.jpg";
import customerKevin from "@/assets/customer-kevin.jpg";
import customerMercy from "@/assets/customer-mercy.jpg";
import customerDennis from "@/assets/customer-dennis.jpg";

const orders = [
  { name: "Brian Ochieng", image: customerBrian, product: "Holographic Sticker", time: "2 mins ago", method: "M-Pesa" },
  { name: "Amina Wanjiku", image: customerAmina, product: "Matte Phone Skin", time: "5 mins ago", method: "M-Pesa" },
  { name: "Faith Njeri", image: customerFaith, product: "Glossy Sticker Pack", time: "8 mins ago", method: "M-Pesa" },
  { name: "Kevin Mwangi", image: customerKevin, product: "Transparent Sticker", time: "12 mins ago", method: "M-Pesa" },
  { name: "Mercy Akinyi", image: customerMercy, product: "Laptop Skin - Matte", time: "15 mins ago", method: "M-Pesa" },
  { name: "Dennis Kiprop", image: customerDennis, product: "Holographic Pack", time: "18 mins ago", method: "M-Pesa" },
  { name: "Grace Wambui", image: customerAmina, product: "Anime Sticker Set", time: "1 min ago", method: "M-Pesa" },
  { name: "James Otieno", image: customerBrian, product: "Nairobi Skyline Decal", time: "3 mins ago", method: "M-Pesa" },
  { name: "Linda Cherono", image: customerFaith, product: "Butterfly Holographic", time: "6 mins ago", method: "M-Pesa" },
  { name: "Peter Njoroge", image: customerKevin, product: "Custom Name Sticker", time: "9 mins ago", method: "M-Pesa" },
  { name: "Sarah Mokeira", image: customerMercy, product: "Floral Phone Skin", time: "14 mins ago", method: "M-Pesa" },
  { name: "Tom Kiplagat", image: customerDennis, product: "Street Art Pack", time: "21 mins ago", method: "M-Pesa" },
  { name: "Wanjiku Muthoni", image: customerAmina, product: "Minimalist Lines", time: "4 mins ago", method: "M-Pesa" },
  { name: "Eric Kimani", image: customerBrian, product: "Gaming Logo Sticker", time: "7 mins ago", method: "M-Pesa" },
  { name: "Joyce Atieno", image: customerFaith, product: "Sunset Gradient Skin", time: "11 mins ago", method: "M-Pesa" },
];

const SocialProofNotification = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % orders.length);
    setVisible(true);
    // Hide after 5 seconds
    setTimeout(() => setVisible(false), 5000);
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    // First notification after 15 seconds
    const initialTimer = setTimeout(showNext, 15000);

    // Then every 2 minutes
    const interval = setInterval(showNext, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isAdmin, showNext]);

  if (isAdmin) return null;

  const order = orders[currentIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -80, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -80, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={() => setVisible(false)}
          className="fixed bottom-24 left-4 z-40 flex max-w-[300px] cursor-pointer items-center gap-3 rounded-xl border border-border/50 bg-card/95 p-3 shadow-xl backdrop-blur-md sm:bottom-28 sm:left-6 sm:max-w-xs sm:p-4"
        >
          {/* Green verified dot - using design tokens */}
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>

          <img
            src={order.image}
            alt={order.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/40 sm:h-12 sm:w-12"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
              {order.name}
            </p>
            <p className="truncate text-[10px] sm:text-xs text-muted-foreground">
              {order.name.split(" ")[0]} via {order.method}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/70">
              {order.time}
            </p>
            <p className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-emerald-500">
              <span className="text-xs">🔥</span> Fast · 10K+ in Orders
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofNotification;
