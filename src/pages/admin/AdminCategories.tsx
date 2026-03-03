import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Cat = { id: string; name: string; emoji: string; description: string; product_type: "phone" | "laptop"; sort_order: number };

const AdminCategories = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Cat | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "📦", description: "", product_type: "phone" as "phone" | "laptop", sort_order: 0 });

  const { data: cats = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data as Cat[];
    },
  });

  const save = useMutation({
    mutationFn: async (c: Omit<Cat, "id"> & { id?: string }) => {
      if (c.id) {
        const { error } = await supabase.from("categories").update(c).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(c);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Saved!"); setEditing(null); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("categories").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Deleted"); },
  });

  const openEdit = (c: Cat) => { setEditing(c); setForm(c); setCreating(false); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Categories</h1>
        <button onClick={() => { setForm({ name: "", emoji: "📦", description: "", product_type: "phone", sort_order: 0 }); setCreating(true); setEditing(null); }} className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
      </div>

      {(creating || editing) && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">{editing ? "Edit" : "New"} Category</h2>
            <button onClick={() => { setEditing(null); setCreating(false); }}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            <input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value as "phone" | "laptop" })} className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none">
              <option value="phone">Phone</option>
              <option value="laptop">Laptop</option>
            </select>
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button onClick={() => save.mutate(editing ? { ...form, id: editing.id } : form)} className="gradient-neon mt-4 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground">Save</button>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{c.product_type} · #{c.sort_order}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate(c.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
