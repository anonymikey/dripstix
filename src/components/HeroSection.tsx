import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const { data: content } = useSiteContent();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="DripStix hero" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <MapPin className="h-4 w-4" />
          <span className="text-sm tracking-widest uppercase">Premium Sticker Brand — KE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 font-display text-7xl font-black tracking-tight sm:text-9xl md:text-[10rem]"
        >
          <span className="text-foreground">{content?.hero_title_1 || "Drip"}</span>
          <span className="text-gradient">{content?.hero_title_2 || "Stix"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-md text-base text-muted-foreground"
        >
          {content?.hero_tagline || "Premium phone & laptop stickers that hit different. Express your style."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10"
        >
          <Link
            to="/shop"
            className="gradient-brand inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground tracking-wide uppercase transition-transform hover:scale-105"
          >
            {content?.hero_cta || "Shop Now"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
