import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

type AffiliateCode = {
  id: string;
  code: string;
  phone_number: string | null;
  total_earnings: number;
};

type Payout = {
  id: string;
  affiliate_code_id: string;
  amount: number;
  notes: string;
  paid_at: string;
  created_at: string;
  affiliate_codes: { code: string; phone_number: string | null } | null;
};

const AdminPayouts = () => {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ affiliate_code_id: "", amount: "", notes: "" });

  const { data: codes = [] } = useQuery({
    queryKey: ["admin-affiliates-for-payout"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_codes")
        .select("id, code, phone_number, total_earnings")
        .eq("is_active", true)
        .order("code");
      if (error) throw error;
      return data as AffiliateCode[];
    },
  });

  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_payouts")
        .select("*, affiliate_codes(code, phone_number)")
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data as Payout[];
    },
  });

  const createPayout = useMutation({
    mutationFn: async () => {
      if (!form.affiliate_code_id) throw new Error("Select an affiliate");
      if (!form.amount || Number(form.amount) <= 0) throw new Error("Enter a valid amount");
      const { error } = await supabase.from("affiliate_payouts").insert({
        affiliate_code_id: form.affiliate_code_id,
        amount: Number(form.amount),
        notes: form.notes.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payouts"] });
      toast.success("Payout recorded!");
      setCreating(false);
      setForm({ affiliate_code_id: "", amount: "", notes: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delPayout = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("affiliate_payouts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payouts"] });
      toast.success("Payout deleted");
    },
  });

  const totalPaidOut = payouts.reduce((s, p) => s + Number(p.amount), 0);
  const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none";

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-black text-foreground">Payouts</h2>
        <button
          onClick={() => setCreating(true)}
          className="gradient-neon flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Record Payout
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Track affiliate commission payouts. Total paid out: <span className="font-semibold text-primary">KES {totalPaidOut.toLocaleString()}</span>
      </p>

      {creating && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-foreground">New Payout</h3>
            <button onClick={() => setCreating(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Affiliate</label>
              <select
                value={form.affiliate_code_id}
                onChange={(e) => setForm({ ...form, affiliate_code_id: e.target.value })}
                className={`mt-1 w-full ${inputClass}`}
              >
                <option value="">Select affiliate...</option>
                {codes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.phone_number || "No phone"} (Earned: KES {Number(c.total_earnings).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount (KES)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={`mt-1 w-full ${inputClass}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
              <input
                placeholder="e.g. Paid via M-Pesa"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={`mt-1 w-full ${inputClass}`}
              />
            </div>
          </div>
          <button
            onClick={() => createPayout.mutate()}
            disabled={createPayout.isPending}
            className="gradient-neon mt-4 rounded-full px-6 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {createPayout.isPending ? "Saving..." : "Record Payout"}
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading payouts..." />
      ) : payouts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No payouts recorded yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {payouts.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-display font-bold text-foreground">
                    KES {Number(p.amount).toLocaleString()}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      → {p.affiliate_codes?.code || "Unknown"} ({p.affiliate_codes?.phone_number || "N/A"})
                    </span>
                  </p>
                  {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{new Date(p.paid_at).toLocaleDateString()}</span>
                <button
                  onClick={() => { if (confirm("Delete this payout record?")) delPayout.mutate(p.id); }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminPayouts;
