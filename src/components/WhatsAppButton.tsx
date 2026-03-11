import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <motion.a
      href="https://wa.me/254710988061"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-green-500/30 sm:h-16 sm:w-16"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white sm:h-8 sm:w-8">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.178 2.282-.852.18-1.964.324-5.71-1.228-4.8-1.986-7.882-6.856-8.122-7.174-.23-.318-1.932-2.574-1.932-4.908s1.222-3.482 1.656-3.96c.434-.478.948-.598 1.264-.598.316 0 .63.002.906.016.29.014.68-.11 1.064.812.39.94 1.326 3.234 1.444 3.468.118.234.196.508.04.812-.158.318-.236.514-.47.794-.234.278-.494.622-.704.834-.234.236-.478.492-.206.964.274.47 1.216 2.006 2.612 3.25 1.794 1.598 3.306 2.094 3.776 2.328.47.234.746.196 1.02-.118.274-.316 1.178-1.372 1.492-1.844.316-.47.63-.39 1.064-.234.434.158 2.75 1.298 3.222 1.534.47.234.786.354.904.548.116.196.116 1.126-.274 2.226z" />
      </svg>
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ backgroundColor: "#25D366" }} />
    </motion.a>
  );
};

export default WhatsAppButton;
