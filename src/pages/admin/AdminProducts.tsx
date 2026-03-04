import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, Image, Tag, PackageX } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

type Product = {
  id: string; name: string; description: string; base_price: number;
  sale_price: number | null; is_on_offer: boolean; is_in_stock: boolean;
  category_id: string | null; product_type: "phone" | "laptop";
  image: string; is_featured: boolean; is_active: boolean;
};

type Category = { id: string; name: string; product_type: "phone" | "laptop" };

const emptyProduct: Omit<Product, "id"> = {
  name: "", description: "", base_price: 100, sale_price: null,
  is_on_offer: false, is_in_stock: true, category_id: null,
  product_type: "phone", image: "", is_featured: false, is_active: true,
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<"phone" | "laptop">("phone");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Product[];
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

  const filteredProducts = products.filter((p) => p.product_type === filterType);

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

  const quickUpdate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { error } = await supabase.from("products").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setForm({ ...form, image: urlData.publicUrl });
      toast.success("Image uploaded!");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (p: Product) => { setEditing(p); setForm(p); setCreating(false); };
  const openCreate = () => { setForm({ ...emptyProduct, product_type: filterType }); setCreating(true); setEditing(null); };
  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = () => {
    if (!form.name) { toast.error("Name required"); return; }
    const payload = { ...form };
    if (!payload.is_on_offer) payload.sale_price = null;
    saveMutation.mutate(editing ? { ...payload, id: editing.id } : payload);
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-black sm:text-3xl">Products</h1>
        <button onClick={openCreate} className="gradient-neon flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Type filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["phone", "laptop"] as const).map((t) => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${filterType === t ? "gradient-neon text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
            {t === "phone" ? "📱 Phone Stickers" : "💻 Laptop Stickers"}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold sm:text-xl">{editing ? "Edit" : "New"} Product</h2>
            <button onClick={close}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>

          {/* Image upload area */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground">Product Image</label>
            <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/20">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center"><Image className="h-8 w-8 text-muted-foreground/50" /></div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50">
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
                </button>
                <span className="text-xs text-muted-foreground">Or paste a URL below</span>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Base Price (Ksh)</label>
              <input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: +e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Product Type</label>
              <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value as "phone" | "laptop", category_id: null })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none">
                <option value="phone">📱 Phone</option>
                <option value="laptop">💻 Laptop</option>
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
              <label className="text-sm text-muted-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>

          {/* Offer section */}
          <div className="mt-6 rounded-lg border border-border bg-muted/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">On Offer / Sale</span>
              </div>
              <Switch checked={form.is_on_offer} onCheckedChange={(v) => setForm({ ...form, is_on_offer: v, sale_price: v ? (form.sale_price || Math.round(form.base_price * 0.8)) : null })} />
            </div>
            {form.is_on_offer && (
              <div className="mt-3">
                <label className="text-sm text-muted-foreground">Sale Price (Ksh)</label>
                <input type="number" value={form.sale_price || ""} onChange={(e) => setForm({ ...form, sale_price: +e.target.value || null })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_in_stock} onCheckedChange={(v) => setForm({ ...form, is_in_stock: v })} /> In Stock</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /> Active</label>
          </div>

          <button onClick={handleSave} disabled={saveMutation.isPending} className="gradient-neon mt-6 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground">
            {saveMutation.isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      )}

      {/* Product count */}
      <p className="mt-6 text-sm text-muted-foreground">{filteredProducts.length} {filterType} sticker{filteredProducts.length !== 1 ? "s" : ""}</p>

      {/* Desktop table */}
      <div className="mt-3 hidden lg:block overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Offer</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-muted/10">
                <td className="px-4 py-3 flex items-center gap-3">
                  {p.image ? <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center"><Image className="h-4 w-4 text-muted-foreground" /></div>}
                  <div>
                    <span className="font-medium">{p.name}</span>
                    {p.is_featured && <span className="ml-2 text-xs text-primary">⭐</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.is_on_offer && p.sale_price ? (
                    <div><span className="text-destructive font-medium">Ksh {p.sale_price}</span><span className="ml-1 text-xs text-muted-foreground line-through">Ksh {p.base_price}</span></div>
                  ) : (<span>Ksh {p.base_price}</span>)}
                </td>
                <td className="px-4 py-3">
                  <Switch checked={p.is_on_offer} onCheckedChange={(v) => quickUpdate.mutate({ id: p.id, updates: { is_on_offer: v, sale_price: v ? Math.round(p.base_price * 0.8) : null } })} />
                </td>
                <td className="px-4 py-3">
                  <Switch checked={p.is_in_stock} onCheckedChange={(v) => quickUpdate.mutate({ id: p.id, updates: { is_in_stock: v } })} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium w-fit ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                    {!p.is_in_stock && <span className="rounded-full px-2 py-0.5 text-xs font-medium w-fit bg-orange-500/20 text-orange-400">Out of Stock</span>}
                  </div>
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

      {/* Mobile/tablet cards */}
      <div className="mt-3 space-y-3 lg:hidden">
        {filteredProducts.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              {p.image ? <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" /> : <div className="h-16 w-16 rounded-lg bg-muted/30 flex items-center justify-center shrink-0"><Image className="h-6 w-6 text-muted-foreground" /></div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name} {p.is_featured && "⭐"}</p>
                {p.is_on_offer && p.sale_price ? (
                  <p className="text-sm"><span className="text-destructive font-medium">Ksh {p.sale_price}</span> <span className="text-muted-foreground line-through text-xs">Ksh {p.base_price}</span></p>
                ) : (<p className="text-sm text-muted-foreground">Ksh {p.base_price}</p>)}
                <div className="mt-1 flex flex-wrap gap-1">
                  {!p.is_in_stock && <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-orange-500/20 text-orange-400">Out of Stock</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{p.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Switch checked={p.is_on_offer} onCheckedChange={(v) => quickUpdate.mutate({ id: p.id, updates: { is_on_offer: v, sale_price: v ? Math.round(p.base_price * 0.8) : null } })} /> Offer</label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Switch checked={p.is_in_stock} onCheckedChange={(v) => quickUpdate.mutate({ id: p.id, updates: { is_in_stock: v } })} /> Stock</label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(p.id); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
