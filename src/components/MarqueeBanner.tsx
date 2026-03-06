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
    <div className="overflow-hidden border-y border-border bg-primary">
      <div className="flex">
        <motion.div
          className="flex shrink-0 gap-0 py-3"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {repeated.map((item, i) => (
            <span
              key={i}
              className="shrink-0 px-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase whitespace-nowrap"
            >
              {item} •
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeBanner;
