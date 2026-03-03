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
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Browse by <span className="text-primary">Category</span>
        </h2>

        <div className="mt-6 flex gap-2">
          {(["phone", "laptop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${
                tab === t ? "gradient-neon text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
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
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary hover:neon-border-blue"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <h3 className="font-display text-lg font-bold">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
