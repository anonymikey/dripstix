import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { DbProduct } from "@/hooks/useProducts";

const RelatedProducts = ({ productId }: { productId: string }) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.functions.invoke("ai-recommendations", { body: { productId } });
        const ids: string[] = data?.ids ?? [];
        if (ids.length === 0) { if (!cancelled) setProducts([]); return; }
        const { data: prods } = await supabase
          .from("products")
          .select("*, category:categories(name, emoji)")
          .in("id", ids);
        if (cancelled) return;
        const ordered = ids.map((id) => prods?.find((p: any) => p.id === id)).filter(Boolean) as unknown as DbProduct[];
        setProducts(ordered);
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [productId]);

  if (loading || products.length === 0) return null;

  return (
    <section className="container pb-16">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">AI picks for you</h2>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default RelatedProducts;