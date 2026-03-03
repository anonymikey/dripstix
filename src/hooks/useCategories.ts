import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbCategory = Tables<"categories">;

export const useCategories = (productType?: "phone" | "laptop") => {
  return useQuery({
    queryKey: ["categories", productType],
    queryFn: async () => {
      let query = supabase.from("categories").select("*").order("sort_order");
      if (productType) query = query.eq("product_type", productType);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
