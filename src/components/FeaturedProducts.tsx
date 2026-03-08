import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useFeaturedProducts, useProducts } from "@/hooks/useProducts";
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
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex gap-5"
        animate={{ x: animateX }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: products.length * 5,
            ease: "linear",
          },
        }}
      >
        {items.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="min-w-[150px] sm:min-w-[170px] md:min-w-[190px] flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const FeaturedProducts = () => {
  const { data: featured = [], isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: allProducts = [], isLoading: loadingAll } = useProducts();

  const isLoading = loadingFeatured || loadingAll;

  // Use featured first, fill with other products if needed
  const pool = featured.length >= 6
    ? featured
    : [...featured, ...allProducts.filter((p) => !featured.some((f) => f.id === p.id))];

  const half = Math.ceil(pool.length / 2);
  const rowOne = pool.slice(0, half);
  const rowTwo = pool.slice(half);

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
      ) : pool.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No products yet.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {rowOne.length > 0 && <MarqueeRow products={rowOne} direction="left" />}
          {rowTwo.length > 0 && <MarqueeRow products={rowTwo} direction="right" />}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
