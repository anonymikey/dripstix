import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  is_on_offer: boolean;
  is_in_stock: boolean;
  category_id: string | null;
  product_type: "phone" | "laptop";
  image: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: { name: string; emoji: string } | null;
};

export const useProducts = (productType?: "phone" | "laptop", categoryName?: string) => {
  return useQuery({
    queryKey: ["products", productType, categoryName],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, category:categories(name, emoji)")
        .order("created_at", { ascending: false });

      if (productType) query = query.eq("product_type", productType);

      const { data, error } = await query;
      if (error) throw error;

      let results = data as unknown as DbProduct[];
      if (categoryName && categoryName !== "All") {
        results = results.filter((p) => p.category?.name === categoryName);
      }
      return results;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, emoji)")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as unknown as DbProduct[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, emoji)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as DbProduct | null;
    },
    enabled: !!id,
  });
};
