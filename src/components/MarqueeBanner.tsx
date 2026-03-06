import { motion } from "framer-motion";

const items = [
  "PHONE STICKERS",
  "LAPTOP SKINS",
  "CUSTOM DESIGNS",
  "MATTE FINISH",
  "GLOSSY FINISH",
  "HOLOGRAPHIC",
  "TRANSPARENT",
  "PREMIUM QUALITY",
  "FAST DELIVERY",
];

const MarqueeBanner = () => {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex">
        <motion.div
          className="flex shrink-0 gap-0 py-4"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {repeated.map((item, i) => (
            <span
              key={i}
              className="shrink-0 px-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase whitespace-nowrap"
            >
              {item} <span className="text-primary">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeBanner;
