import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DbProduct } from "@/hooks/useProducts";

const ProductCard = ({ product }: { product: DbProduct }) => {
  const isOutOfStock = !product.is_in_stock;
  const hasOffer = product.is_on_offer && product.sale_price;
  const displayPrice = hasOffer ? product.sale_price! : product.base_price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:neon-border-blue ${isOutOfStock ? "opacity-75" : ""}`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasOffer && (
          <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-bold text-destructive-foreground shadow-lg">
            {Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-lg">
            Out of Stock
          </span>
        )}
      </div>

      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale" : ""}`}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">{product.category?.name}</span>
          <span className="text-xs text-muted-foreground capitalize">· {product.product_type}</span>
        </div>
        <h3 className="mt-1 font-display text-lg font-bold">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-secondary">Ksh {displayPrice}</span>
            {hasOffer && (
              <span className="text-sm text-muted-foreground line-through">Ksh {product.base_price}</span>
            )}
          </div>
          <Link
            to={`/product/${product.id}`}
            className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {isOutOfStock ? "View" : "View Details"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
