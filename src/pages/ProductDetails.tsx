import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, styleOptions } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const totalPrice = product.basePrice + selectedStyle.priceModifier;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      style: selectedStyle.name,
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl border border-border"
          >
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <span className="text-sm font-medium text-primary">{product.category}</span>
            <h1 className="mt-2 font-display text-4xl font-black">{product.name}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8">
              <label className="text-sm font-medium text-muted-foreground">Style</label>
              <select
                value={selectedStyle.name}
                onChange={(e) => setSelectedStyle(styleOptions.find((s) => s.name === e.target.value)!)}
                className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {styleOptions.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} {s.priceModifier > 0 ? `(+KES ${s.priceModifier})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-display text-xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-display text-3xl font-black text-secondary">KES {totalPrice * quantity}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-full border border-primary px-8 py-3 font-display font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate("/checkout"); }}
                className="gradient-neon rounded-full px-8 py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                Pay with M-PESA
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
