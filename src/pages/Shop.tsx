import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import PageBackground from "@/components/PageBackground";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const activeType = (searchParams.get("type") || "phone") as "phone" | "laptop";

  const { data: products = [], isLoading } = useProducts(activeType, activeCategory);
  const { data: categories = [] } = useCategories(activeType);

  const setFilter = (cat: string, type?: "phone" | "laptop") => {
    const t = type || activeType;
    const params: Record<string, string> = { type: t };
    if (cat !== "All") params.category = cat;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="container pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl text-foreground">
            The <span className="text-gradient">Shop</span>
          </h1>

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
            <div className="mt-20 text-center text-muted-foreground">Loading products...</div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
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
