import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
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

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      // order_items cascade-deletes automatically
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

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-bold">{o.customer_name}</p>
                <p className="text-sm text-muted-foreground">{o.phone_number} · {o.delivery_location}</p>
              </div>
              <div className="flex items-center gap-3">
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
            {o.order_items && o.order_items.length > 0 && (
              <div className="mt-3 border-t border-border pt-3 space-y-1">
                {o.order_items.map((item: any) => (
                  <p key={item.id} className="text-sm text-muted-foreground">
                    {item.product_name} × {item.quantity} — KES {item.unit_price * item.quantity}
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
