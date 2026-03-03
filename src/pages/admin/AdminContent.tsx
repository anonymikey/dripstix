import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { toast } from "sonner";

const AdminContent = () => {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    setValues(map);
  }, [rows]);

  const save = useMutation({
    mutationFn: async () => {
      for (const row of rows) {
        if (values[row.key] !== row.value) {
          const { error } = await supabase.from("site_content").update({ value: values[row.key] }).eq("id", row.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-site-content"] }); toast.success("Content saved!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const labels: Record<string, string> = {
    hero_title_1: "Hero Title Part 1",
    hero_title_2: "Hero Title Part 2",
    hero_tagline: "Hero Tagline",
    hero_cta: "Hero CTA Button Text",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Site Content</h1>
        <button onClick={() => save.mutate()} disabled={save.isPending} className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground">
          <Save className="h-4 w-4" /> {save.isPending ? "Saving..." : "Save All"}
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-muted-foreground">{labels[r.key] || r.key}</label>
            <input
              value={values[r.key] || ""}
              onChange={(e) => setValues({ ...values, [r.key]: e.target.value })}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
