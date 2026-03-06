import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import stickersHero from "@/assets/stickers-hero.png";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const { data: content } = useSiteContent();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm"
            >
              <div className="flex -space-x-2">
                {["A", "W", "B", "F"].map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-bold text-foreground"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">200+ happy customers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-8 font-display text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="text-gradient">{content?.hero_title_1 || "Premium"}</span>
              <br />
              <span className="text-foreground">{content?.hero_title_2 || "Stickers"}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
            >
              {content?.hero_tagline || "Premium phone & laptop stickers that hit different. Express your style with DripStix."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                to="/shop"
                className="gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-display text-sm font-bold text-white tracking-wide uppercase shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                {content?.hero_cta || "Shop Now"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop?type=laptop"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 font-display text-sm font-semibold text-foreground tracking-wide uppercase transition-all hover:border-muted-foreground hover:bg-card/50"
              >
                Browse Laptop Skins
              </Link>
            </motion.div>
          </div>

          {/* Right: Hero image with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[80%] w-[80%] rounded-full bg-primary/15 blur-[80px]" />
            </div>
            <motion.img
              src={stickersHero}
              alt="Premium phone stickers collection"
              className="relative z-10 w-full max-w-lg drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
