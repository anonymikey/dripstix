import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DbProduct } from "@/hooks/useProducts";

const ProductCard = ({ product }: { product: DbProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:neon-border-blue"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">{product.category?.name}</span>
          <span className="text-xs text-muted-foreground capitalize">· {product.product_type}</span>
        </div>
        <h3 className="mt-1 font-display text-lg font-bold">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-secondary">KES {product.base_price}</span>
          <Link
            to={`/product/${product.id}`}
            className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
