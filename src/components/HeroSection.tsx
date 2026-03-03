import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const { data: content } = useSiteContent();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="DripStix hero" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-6xl font-black tracking-tight sm:text-8xl md:text-9xl"
        >
          <span className="text-primary neon-glow-blue">{content?.hero_title_1 || "Drip"}</span>
          <span className="text-secondary neon-glow-pink">{content?.hero_title_2 || "Stix"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground sm:text-xl"
        >
          {content?.hero_tagline || "Premium Phone Stickers That Hit Different"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <Link
            to="/shop"
            className="gradient-neon inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            {content?.hero_cta || "Shop Now"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
