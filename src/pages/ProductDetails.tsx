import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useStyleOptions } from "@/hooks/useStyleOptions";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: styleOptions = [] } = useStyleOptions();

  const [selectedStyleName, setSelectedStyleName] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const selectedStyle = styleOptions.find((s) => s.name === selectedStyleName) || styleOptions[0];

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!product) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Product not found.</p></div>;

  const hasOffer = product.is_on_offer && product.sale_price;
  const baseDisplayPrice = hasOffer ? product.sale_price! : product.base_price;
  const totalPrice = baseDisplayPrice + (selectedStyle?.price_modifier || 0);
  const isOutOfStock = !product.is_in_stock;

  const handleAddToCart = () => {
    if (isOutOfStock) { toast.error("This product is out of stock"); return; }
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      style: selectedStyle?.name || "Matte",
      price: totalPrice,
      quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden rounded-2xl border border-border">
            {hasOffer && (
              <div className="absolute top-4 left-4 z-10 rounded-full bg-destructive px-3 py-1.5 text-sm font-bold text-destructive-foreground shadow-lg flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)}% OFF
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-4 right-4 z-10 rounded-full bg-muted px-3 py-1.5 text-sm font-bold text-muted-foreground shadow-lg">
                Out of Stock
              </div>
            )}
            <img src={product.image} alt={product.name} className={`h-full w-full object-cover ${isOutOfStock ? "grayscale" : ""}`} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">{product.category?.name}</span>
              <span className="text-sm text-muted-foreground capitalize">· {product.product_type} sticker</span>
            </div>
            <h1 className="mt-2 font-display text-4xl font-black">{product.name}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8">
              <label className="text-sm font-medium text-muted-foreground">Style</label>
              <select
                value={selectedStyle?.name || ""}
                onChange={(e) => setSelectedStyleName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {styleOptions.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} {s.price_modifier > 0 ? `(+Ksh ${s.price_modifier})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <div className="mt-2 flex items-center gap-4">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary"><Minus className="h-4 w-4" /></button>
                <span className="font-display text-xl font-bold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3">
                <p className="font-display text-3xl font-black text-secondary">Ksh {totalPrice * quantity}</p>
                {hasOffer && (
                  <p className="text-lg text-muted-foreground line-through">Ksh {(product.base_price + (selectedStyle?.price_modifier || 0)) * quantity}</p>
                )}
              </div>
              {isOutOfStock && <p className="mt-2 text-sm font-medium text-destructive">⚠ This product is currently out of stock</p>}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={handleAddToCart} disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 rounded-full border border-primary px-8 py-3 font-display font-bold transition-all ${isOutOfStock ? "opacity-50 cursor-not-allowed text-muted-foreground border-muted" : "text-primary hover:bg-primary hover:text-primary-foreground"}`}>
                <ShoppingCart className="h-5 w-5" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              {!isOutOfStock && (
                <button onClick={() => { handleAddToCart(); navigate("/checkout"); }} className="gradient-neon rounded-full px-8 py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105">
                  Pay with M-PESA
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
