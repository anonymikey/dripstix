import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, CreditCard } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const paymentColors: Record<string, string> = {
  pending: "bg-orange-500/20 text-orange-400",
  stk_sent: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
};

const AdminOrders = () => {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success("Status updated"); },
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, payment_status }: { id: string; payment_status: string }) => {
      const { error } = await supabase.from("orders").update({ payment_status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success("Payment status updated"); },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order deleted");
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
      setDeletingId(null);
    },
  });

  const pendingPaymentCount = orders.filter((o) => o.payment_status === "pending").length;
  const completedPaymentCount = orders.filter((o) => o.payment_status === "completed").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Orders</h1>

      {/* Stats */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Total:</span> <span className="font-bold text-foreground">{orders.length}</span>
        </div>
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm">
          <span className="text-orange-400">Awaiting Payment:</span> <span className="font-bold text-orange-400">{pendingPaymentCount}</span>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm">
          <span className="text-green-400">Paid:</span> <span className="font-bold text-green-400">{completedPaymentCount}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-bold">{o.customer_name}</p>
                <p className="text-sm text-muted-foreground">{o.phone_number} · {o.delivery_location}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Order status */}
                <select
                  value={o.status}
                  onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[o.status] || "bg-muted text-muted-foreground"} border-0 focus:outline-none cursor-pointer`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Payment status */}
                <select
                  value={o.payment_status}
                  onChange={(e) => updatePaymentStatus.mutate({ id: o.id, payment_status: e.target.value })}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${paymentColors[o.payment_status] || "bg-muted text-muted-foreground"} border-0 focus:outline-none cursor-pointer`}
                >
                  <option value="pending">💰 Unpaid</option>
                  <option value="stk_sent">📱 STK Sent</option>
                  <option value="completed">✅ Paid</option>
                  <option value="failed">❌ Failed</option>
                </select>

                <span className="font-display font-bold text-secondary">KES {o.total}</span>

                {deletingId === o.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteOrder.mutate(o.id)}
                      disabled={deleteOrder.isPending}
                      className="rounded-lg bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      {deleteOrder.isPending ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(o.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete order"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {o.affiliate_code && (
              <p className="mt-2 text-xs text-primary">🎉 Affiliate: {o.affiliate_code} (−KES {o.affiliate_discount})</p>
            )}
            {o.order_items && o.order_items.length > 0 && (
              <div className="mt-3 border-t border-border pt-3 space-y-1">
                {o.order_items.map((item: any) => (
                  <p key={item.id} className="text-sm text-muted-foreground">
                    {item.product_name} ({item.style}) × {item.quantity} — KES {item.unit_price * item.quantity}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
