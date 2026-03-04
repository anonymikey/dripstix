import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string; name: string; description: string; base_price: number;
  category_id: string | null; product_type: "phone" | "laptop";
  image: string; is_featured: boolean; is_active: boolean;
};

type Category = { id: string; name: string; product_type: "phone" | "laptop" };

const emptyProduct: Omit<Product, "id"> = {
  name: "", description: "", base_price: 0, category_id: null,
  product_type: "phone", image: "", is_featured: false, is_active: true,
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, name, product_type").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (p: Omit<Product, "id"> & { id?: string }) => {
      if (p.id) {
        const { error } = await supabase.from("products").update(p).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(p);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product saved!");
      setEditing(null); setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Deleted"); },
  });

  const openEdit = (p: Product) => { setEditing(p); setForm(p); setCreating(false); };
  const openCreate = () => { setForm(emptyProduct); setCreating(true); setEditing(null); };
  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = () => {
    if (!form.name) { toast.error("Name required"); return; }
    saveMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Products</h1>
        <button onClick={openCreate} className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">{editing ? "Edit" : "New"} Product</h2>
            <button onClick={close}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Base Price (KES)</label>
              <input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: +e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Product Type</label>
              <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value as "phone" | "laptop", category_id: null })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none">
                <option value="phone">Phone</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Category</label>
              <select value={form.category_id || ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none">
                <option value="">None</option>
                {categories.filter((c) => c.product_type === form.product_type).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground">Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-primary" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" /> Active
              </label>
            </div>
          </div>
          <button onClick={handleSave} disabled={saveMutation.isPending} className="gradient-neon mt-4 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground">
            {saveMutation.isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      )}

      {/* Desktop table */}
      <div className="mt-6 hidden md:block overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/10">
                <td className="px-4 py-3 flex items-center gap-3">
                  {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-4 py-3 capitalize">{p.product_type}</td>
                <td className="px-4 py-3">KES {p.base_price}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(p.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{p.product_type} · KES {p.base_price}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {p.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-3 flex gap-3 border-t border-border pt-3">
              <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><Pencil className="h-3.5 w-3.5" /> Edit</button>
              <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(p.id); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
