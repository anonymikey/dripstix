import { motion } from "framer-motion";

const PageBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Top center blue orb */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="geo-orb -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] bg-primary/10"
    />
    {/* Bottom left teal orb */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 2.5, delay: 0.5 }}
      className="geo-orb bottom-0 -left-32 h-[400px] w-[400px] bg-primary/5"
    />
    {/* Right accent */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 3, delay: 1 }}
      className="geo-orb top-1/3 -right-20 h-[300px] w-[300px] bg-[hsl(280_65%_60%/0.06)]"
    />
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(hsl(215_28%_17%/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(215_28%_17%/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
);

export default PageBackground;
