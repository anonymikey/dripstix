import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import reviewerAmina from "@/assets/reviewer-amina.jpg";
import reviewerBrian from "@/assets/reviewer-brian.jpg";
import reviewerFaith from "@/assets/reviewer-faith.jpg";

interface Review {
  id: string;
  customer_name: string;
  role: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const fallbackImages: Record<string, string> = {
  "1": reviewerAmina,
  "2": reviewerBrian,
  "3": reviewerFaith,
};

const fallbackReviews: Review[] = [
  { id: "1", customer_name: "Amina Wanjiku", role: "University Student", rating: 5, review_text: "The holographic stickers are absolutely stunning! My phone looks so unique now. Fast delivery to Nairobi too.", created_at: "" },
  { id: "2", customer_name: "Brian Ochieng", role: "Content Creator", rating: 5, review_text: "Best sticker quality I've found in Kenya. The matte finish is premium and doesn't peel off easily.", created_at: "" },
  { id: "3", customer_name: "Faith Muthoni", role: "Graphic Designer", rating: 4, review_text: "Love the variety of designs! Ordered for my laptop and phone — both look amazing. Will definitely order again.", created_at: "" },
];

const AUTOPLAY_INTERVAL = 5000;

const TestimonialsSection = () => {
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", rating: 5, text: "" });
  const [isPaused, setIsPaused] = useState(false);

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

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  // Auto-rotate
  useEffect(() => {
    if (isPaused || showForm) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % displayReviews.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, showForm, displayReviews.length]);

  const review = displayReviews[current % displayReviews.length];
  const avatarImage = fallbackImages[review.id];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.92 }),
  };

  // Progress bar for autoplay
  const progressKey = `${current}-${isPaused}`;

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div
        className="container max-w-3xl text-center relative z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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

        {/* Quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30" />
        </motion.div>

        <div className="min-h-[280px] sm:min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={review.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center w-full"
            >
              {/* Avatar with glow ring */}
              <div className="relative mb-5">
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/40 to-accent/40 blur-sm"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-primary/30"
                  style={{ width: "4.5rem", height: "4.5rem" }}
                >
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt={review.customer_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-foreground text-xl sm:text-2xl font-bold">
                      {review.customer_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground">{review.customer_name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">{review.role}</p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  </motion.div>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="ml-2 text-sm font-semibold text-foreground"
                >
                  {review.rating}.0
                </motion.span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed italic"
              >
                "{review.review_text}"
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + progress bar */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            {displayReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative p-1"
              >
                <motion.div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    i === current % displayReviews.length ? "bg-primary" : "bg-muted"
                  }`}
                  animate={i === current % displayReviews.length ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.4 }}
                />
              </button>
            ))}
          </div>
          {/* Autoplay progress */}
          {!isPaused && !showForm && (
            <div className="w-24 h-0.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                key={progressKey}
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Small avatar strip of all reviewers */}
        <div className="flex justify-center gap-3 mt-6">
          {displayReviews.map((r, i) => {
            const img = fallbackImages[r.id];
            const isActive = i === current % displayReviews.length;
            return (
              <motion.button
                key={r.id}
                onClick={() => goTo(i)}
                className={`rounded-full overflow-hidden border-2 transition-all ${
                  isActive ? "border-primary ring-2 ring-primary/30" : "border-border opacity-50 hover:opacity-80"
                }`}
                style={{ width: "2.5rem", height: "2.5rem" }}
                animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {img ? (
                  <img src={img} alt={r.customer_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-foreground text-xs font-bold">
                    {r.customer_name.charAt(0)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10">
          {!showForm ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="rounded-full border-border text-foreground hover:bg-card hover:border-muted-foreground transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Leave a Review
              </Button>
            </motion.div>
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
