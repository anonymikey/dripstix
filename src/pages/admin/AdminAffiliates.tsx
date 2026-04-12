import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, X, Phone, Tag, ToggleLeft, ToggleRight, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

type AffiliateCode = {
  id: string;
  code: string;
  phone_number: string | null;
  discount_percent: number;
  is_active: boolean;
  usage_count: number;
  total_earnings: number;
  created_at: string;
};

type Poster = {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

const generateCode = () => `DRIP${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const AdminAffiliates = () => {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ phone_number: "", code: generateCode(), discount_percent: 20 });
  const [posterForm, setPosterForm] = useState({ title: "" });
  const [creatingPoster, setCreatingPoster] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Affiliate codes query
  const { data: codes = [], isLoading: codesLoading } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AffiliateCode[];
    },
  });

  // Posters query
  const { data: posters = [], isLoading: postersLoading } = useQuery({
    queryKey: ["admin-posters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_posters")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Poster[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const phone = form.phone_number.trim();
      if (!phone) throw new Error("Phone number is required");
      if (!/^[0-9+\s]{9,15}$/.test(phone)) throw new Error("Invalid phone number format");
      const { error } = await supabase.from("affiliate_codes").insert({
        code: form.code,
        phone_number: phone,
        discount_percent: form.discount_percent,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.success("Affiliate code created!");
      setCreating(false);
      setForm({ phone_number: "", code: generateCode(), discount_percent: 20 });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("affiliate_codes").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.success("Updated");
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("affiliate_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.success("Deleted");
    },
  });

  // Poster mutations
  const createPoster = useMutation({
    mutationFn: async (file: File) => {
      if (!posterForm.title.trim()) throw new Error("Poster title is required");
      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("affiliate-posters").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("affiliate-posters").getPublicUrl(path);
      const { error } = await supabase.from("affiliate_posters").insert({
        title: posterForm.title.trim(),
        image_url: urlData.publicUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posters"] });
      toast.success("Poster uploaded!");
      setCreatingPoster(false);
      setPosterForm({ title: "" });
      setUploading(false);
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setUploading(false);
    },
  });

  const togglePoster = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("affiliate_posters").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posters"] });
      toast.success("Updated");
    },
  });

  const delPoster = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("affiliate_posters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posters"] });
      toast.success("Deleted");
    },
  });

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) createPoster.mutate(file);
  };

  const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none";

  return (
    <div className="space-y-10">
      {/* ── POSTERS SECTION ── */}
      <section>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-black text-foreground">Posters</h1>
          <button
            onClick={() => { setPosterForm({ title: "" }); setCreatingPoster(true); }}
            className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add Poster
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload promotional posters that clients can share to earn their 20% discount.
        </p>

        {creatingPoster && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">New Poster</h2>
              <button onClick={() => setCreatingPoster(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Poster Title</label>
              <input
                placeholder="e.g. Summer Sale Poster"
                value={posterForm.title}
                onChange={(e) => setPosterForm({ title: e.target.value })}
                className={`mt-1 w-full ${inputClass}`}
              />
            </div>
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handlePosterUpload} />
            <button
              onClick={() => {
                if (!posterForm.title.trim()) { toast.error("Enter a poster title first"); return; }
                fileRef.current?.click();
              }}
              disabled={uploading}
              className="gradient-neon mt-4 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        )}

        {postersLoading ? (
          <LoadingSpinner text="Loading posters..." />
        ) : posters.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No posters yet. Upload one for clients to share.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posters.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">{p.title}</p>
                    <span className={`text-xs font-semibold ${p.is_active ? "text-primary" : "text-muted-foreground"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePoster.mutate({ id: p.id, is_active: !p.is_active })} className="text-muted-foreground hover:text-primary">
                      {p.is_active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button onClick={() => { if (confirm("Delete this poster?")) delPoster.mutate(p.id); }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── AFFILIATE CODES SECTION ── */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-black text-foreground">Affiliate Codes</h2>
          <button
            onClick={() => { setForm({ phone_number: "", code: generateCode(), discount_percent: 20 }); setCreating(true); }}
            className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add Code
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          After verifying a client's share screenshot, create an affiliate code linked to their phone number.
        </p>

        {creating && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">New Affiliate Code</h2>
              <button onClick={() => setCreating(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer Phone Number</label>
                <input placeholder="0712 345 678" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} className={`mt-1 w-full ${inputClass}`} />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Code (auto-generated)</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={`mt-1 w-full ${inputClass}`} />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Discount %</label>
                <input type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: +e.target.value })} className={`mt-1 w-full ${inputClass}`} />
              </div>
            </div>
            <button onClick={() => create.mutate()} disabled={create.isPending} className="gradient-neon mt-4 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
              {create.isPending ? "Creating..." : "Create Code"}
            </button>
          </div>
        )}

        {codesLoading ? (
          <LoadingSpinner text="Loading codes..." />
        ) : (
          <div className="mt-6 space-y-3">
            {codes.length === 0 && (
              <p className="text-sm text-muted-foreground">No affiliate codes yet.</p>
            )}
            {codes.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-display font-bold text-foreground">{c.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone_number || "No phone"}</span>
                    <span>{c.discount_percent}% off</span>
                    <span>Used {c.usage_count}×</span>
                    <span className="font-semibold text-primary">Earned KES {c.total_earnings.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive.mutate({ id: c.id, is_active: !c.is_active })} className="text-muted-foreground hover:text-primary" title={c.is_active ? "Deactivate" : "Activate"}>
                    {c.is_active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button onClick={() => { if (confirm("Delete this affiliate code?")) del.mutate(c.id); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAffiliates;
