import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review approved");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Customer Reviews</h1>
      {reviews?.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
      {reviews?.map((r) => (
        <div key={r.id} className="p-4 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{r.customer_name}</span>
              {!r.is_approved && (
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Pending</span>
              )}
              {r.is_approved && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Approved</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{r.role}</p>
            <div className="flex gap-0.5 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-sm text-foreground">{r.review_text}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {!r.is_approved && (
              <Button size="sm" onClick={() => approve.mutate(r.id)} className="rounded-full">
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={() => remove.mutate(r.id)} className="rounded-full">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReviews;
