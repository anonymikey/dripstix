import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbStyleOption = Tables<"style_options">;

export const useStyleOptions = () => {
  return useQuery({
    queryKey: ["style-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("style_options").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};
