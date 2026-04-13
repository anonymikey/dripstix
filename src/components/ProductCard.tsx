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
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm card-hover ${isOutOfStock ? "opacity-60" : ""}`}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasOffer && (
          <span className="gradient-brand rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md">
            {Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            Out of Stock
          </span>
        )}
      </div>

      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "grayscale" : ""}`}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">{product.category?.name}</span>
          <span className="text-xs text-muted-foreground capitalize">· {product.product_type}</span>
        </div>
        <h3 className="mt-1.5 font-display text-base font-semibold text-foreground">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">Ksh {displayPrice}</span>
            {hasOffer && (
              <span className="text-sm text-muted-foreground line-through">Ksh {product.base_price}</span>
            )}
          </div>
          <Link
            to={`/product/${product.id}`}
            className="gradient-brand rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:scale-105 hover:shadow-md hover:shadow-primary/20"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
