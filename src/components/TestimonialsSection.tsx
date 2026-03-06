import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: string;
  customer_name: string;
  role: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const fallbackReviews: Review[] = [
  { id: "1", customer_name: "Amina Wanjiku", role: "University Student", rating: 5, review_text: "The holographic stickers are absolutely stunning! My phone looks so unique now. Fast delivery to Nairobi too." } as Review,
  { id: "2", customer_name: "Brian Ochieng", role: "Content Creator", rating: 5, review_text: "Best sticker quality I've found in Kenya. The matte finish is premium and doesn't peel off easily." } as Review,
  { id: "3", customer_name: "Faith Muthoni", role: "Graphic Designer", rating: 4, review_text: "Love the variety of designs! Ordered for my laptop and phone — both look amazing. Will definitely order again." } as Review,
];

const TestimonialsSection = () => {
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", rating: 5, text: "" });

  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        customer_name: form.name,
        role: form.role,
        rating: form.rating,
        review_text: form.text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review submitted! It will appear after approval.");
      setForm({ name: "", role: "", rating: 5, text: "" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Failed to submit review."),
  });

  const displayReviews = reviews && reviews.length > 0 ? reviews : fallbackReviews;
  const review = displayReviews[current % displayReviews.length];

  return (
    <section className="py-16 sm:py-24">
      <div className="container max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3"
        >
          Best & Affordable
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-10 sm:mb-14"
        >
          What they say
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center text-foreground text-xl sm:text-2xl font-bold mb-4 border border-border">
              {review.customer_name.charAt(0)}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">{review.customer_name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">{review.role}</p>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
              <span className="ml-2 text-sm font-semibold text-foreground">{review.rating}.0</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">{review.review_text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-8">
          {displayReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                i === current % displayReviews.length ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="mt-10">
          {!showForm ? (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="rounded-full border-border text-foreground hover:bg-card hover:border-muted-foreground"
            >
              Leave a Review
            </Button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3 max-w-md mx-auto text-left"
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.name || !form.text) return;
                submitReview.mutate();
              }}
            >
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder="Your role (e.g. Student, Designer)"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rating:</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm((f) => ({ ...f, rating: r }))}>
                    <Star className={`w-5 h-5 ${r <= form.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Write your review..."
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="rounded-full gradient-brand text-white shadow-md shadow-primary/20"
                  disabled={submitReview.isPending}
                >
                  {submitReview.isPending ? "Submitting..." : "Submit"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-full text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
