import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import LoadingSpinner from "./LoadingSpinner";

const MarqueeRow = ({
  products,
  direction = "left",
}: {
  products: any[];
  direction?: "left" | "right";
}) => {
  const items = [...products, ...products, ...products, ...products];
  const animateX = direction === "left" ? ["0%", "-25%"] : ["-25%", "0%"];

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-3 sm:gap-4 md:gap-6 will-change-transform"
        animate={{ x: animateX }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {items.map((product, i) => (
          <div key={`${product.id}-${i}`} className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[300px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const FeaturedProducts = () => {
  const { data: featured = [], isLoading } = useFeaturedProducts();

  const half = Math.ceil(featured.length / 2);
  const rowOne = featured.slice(0, half);
  const rowTwo = featured.slice(half);

  return (
    <section className="py-20 overflow-hidden">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Featured <span className="text-gradient">Drops</span>
        </motion.h2>
      </div>
      {isLoading ? (
        <LoadingSpinner text="Loading featured drops..." />
      ) : (
        <div className="mt-10 space-y-6">
          {rowOne.length > 0 && <MarqueeRow products={rowOne} direction="left" />}
          {rowTwo.length > 0 && <MarqueeRow products={rowTwo} direction="right" />}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
