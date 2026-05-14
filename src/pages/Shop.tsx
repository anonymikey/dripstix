import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import PageBackground from "@/components/PageBackground";
import AISearchBar from "@/components/AISearchBar";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";

const REFERRAL_STORAGE_KEY = "dripstix_referral_code";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const activeType = (searchParams.get("type") || "phone") as "phone" | "laptop";
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, referralCode.trim().toUpperCase());
    }
  }, [referralCode]);

  const { data: products = [], isLoading } = useProducts(activeType, activeCategory);
  const { data: categories = [] } = useCategories(activeType);
  const [aiIds, setAiIds] = useState<string[] | null>(null);

  const setFilter = (cat: string, type?: "phone" | "laptop") => {
    const t = type || activeType;
    const params: Record<string, string> = { type: t };
    if (cat !== "All") params.category = cat;
    if (referralCode) params.ref = referralCode;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen page-bg">
      <Helmet>
        <title>{activeType === "laptop" ? "Laptop Skins & Stickers" : "Phone Stickers"} — Shop DripStix</title>
        <meta name="description" content={`Browse ${activeType === "laptop" ? "laptop skins" : "phone stickers"} at DripStix. ${activeCategory !== "All" ? activeCategory + " designs. " : ""}Premium quality, M-PESA checkout, delivered across Kenya.`} />
        <link rel="canonical" href={`https://dripstix.lovable.app/shop?type=${activeType}`} />
        <meta property="og:title" content={`${activeType === "laptop" ? "Laptop Skins" : "Phone Stickers"} — Shop DripStix`} />
        <meta property="og:url" content={`https://dripstix.lovable.app/shop?type=${activeType}`} />
      </Helmet>
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="container pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl text-foreground">
            The <span className="text-gradient">Shop</span>
          </h1>

          <AISearchBar onResults={(ids) => setAiIds(ids)} onClear={() => setAiIds(null)} />

          <div className="mt-6 flex gap-2">
            {(["phone", "laptop"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter("All", t)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${
                  activeType === t ? "gradient-brand text-white shadow-md shadow-primary/20" : "border border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "phone" ? "📱 Phone" : "💻 Laptop"}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["All", ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "gradient-brand text-white shadow-md shadow-primary/20"
                    : "border border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="mt-10"><LoadingSpinner text="Loading products..." /></div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(aiIds
                ? aiIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products
                : products
              ).map((product) => (
                <ProductCard key={product!.id} product={product!} />
              ))}
              {(aiIds ? aiIds.length === 0 : products.length === 0) && (
                <p className="col-span-full text-center text-muted-foreground">No products found in this category.</p>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
