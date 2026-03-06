import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";

const CategoriesSection = () => {
  const [tab, setTab] = useState<"phone" | "laptop">("phone");
  const { data: categories = [] } = useCategories(tab);

  return (
    <section className="py-20">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Browse by <span className="text-gradient">Category</span>
        </motion.h2>

        <div className="mt-6 flex gap-2">
          {(["phone", "laptop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "gradient-brand text-white shadow-md shadow-primary/20"
                  : "border border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "phone" ? "📱 Phone" : "💻 Laptop"} Stickers
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?type=${tab}&category=${cat.name}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 text-center card-hover"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
