import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteContent = () => {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      data.forEach((row) => { map[row.key] = row.value; });
      return map;
    },
  });
};
