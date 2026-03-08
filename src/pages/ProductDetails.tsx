import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const REFERRAL_STORAGE_KEY = "dripstix_referral_code";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { data: product, isLoading } = useProduct(id || "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (referralCode) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, referralCode.trim().toUpperCase());
    }
  }, [searchParams]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center page-bg"><LoadingSpinner text="Loading product..." /></div>;
  if (!product) return <div className="flex min-h-screen items-center justify-center page-bg"><p className="text-muted-foreground">Product not found.</p></div>;

  const hasOffer = product.is_on_offer && product.sale_price;
  const displayPrice = hasOffer ? product.sale_price! : product.base_price;
  const isOutOfStock = !product.is_in_stock;

  const handleAddToCart = () => {
    if (isOutOfStock) { toast.error("This product is out of stock"); return; }
    addToCart({ productId: product.id, name: product.name, image: product.image, style: "Standard", price: displayPrice, quantity });
    toast.success(`${product.name} added to cart!`);
  };

  const checkoutWithReferral = () => {
    const referralCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (referralCode) {
      navigate(`/checkout?ref=${encodeURIComponent(referralCode)}`);
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="container pt-24 pb-20">
          <div className="grid gap-10 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden rounded-2xl border border-border bg-card/30">
              {hasOffer && (
                <div className="absolute top-4 left-4 z-10 gradient-brand rounded-full px-3 py-1.5 text-sm font-bold text-white flex items-center gap-1.5 shadow-md">
                  <Tag className="h-4 w-4" />
                  {Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)}% OFF
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 right-4 z-10 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground">Out of Stock</div>
              )}
              <img src={product.image} alt={product.name} className={`h-full w-full object-cover ${isOutOfStock ? "grayscale" : ""}`} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">{product.category?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">· {product.product_type} sticker</span>
              </div>
              <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-foreground">{product.name}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="mt-8">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quantity</label>
                <div className="mt-2 flex items-center gap-4">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-muted-foreground"><Minus className="h-4 w-4" /></button>
                  <span className="font-display text-xl font-bold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-muted-foreground"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3">
                  <p className="font-display text-3xl font-black text-foreground">Ksh {displayPrice * quantity}</p>
                  {hasOffer && <p className="text-lg text-muted-foreground line-through">Ksh {product.base_price * quantity}</p>}
                </div>
                {isOutOfStock && <p className="mt-2 text-sm font-medium text-destructive">⚠ This product is currently out of stock</p>}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={handleAddToCart} disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3 font-display text-sm font-semibold transition-all ${isOutOfStock ? "opacity-50 cursor-not-allowed text-muted-foreground" : "text-foreground hover:border-muted-foreground hover:bg-card/50"}`}>
                  <ShoppingCart className="h-4 w-4" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                {!isOutOfStock && (
                  <button onClick={() => { handleAddToCart(); checkoutWithReferral(); }} className="gradient-brand rounded-full px-8 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                    Pay with M-PESA
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
