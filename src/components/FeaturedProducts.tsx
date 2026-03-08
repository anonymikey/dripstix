import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import LoadingSpinner from "./LoadingSpinner";

const FeaturedProducts = () => {
  const { data: featured = [], isLoading } = useFeaturedProducts();

  return (
    <section className="py-20">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Featured <span className="text-gradient">Drops</span>
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
