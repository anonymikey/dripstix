import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Share2, MessageCircle, Mail, Gift, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import LoadingSpinner from "@/components/LoadingSpinner";

const WHATSAPP_NUMBER = "254710988061";
const EMAIL = "info@dripstix.site";

type Poster = { id: string; title: string; image_url: string; is_active: boolean; created_at: string };

const steps = [
  { icon: Share2, title: "Share a Poster", desc: "Pick a poster below and share it with your friends and family on social media." },
  { icon: MessageCircle, title: "Send Proof", desc: `Take a screenshot of your share and send it to us on WhatsApp (+${WHATSAPP_NUMBER}) or email (${EMAIL}).` },
  { icon: Gift, title: "Get 20% Off", desc: "Once we verify your share, we'll activate a 20% discount on your phone number. It auto-applies at checkout!" },
];

const Affiliate = () => {
  const { data: posters = [], isLoading } = useQuery({
    queryKey: ["affiliate-posters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_posters")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Poster[];
    },
  });

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container max-w-4xl pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
            Share & <span className="text-gradient">Save 20%</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Share any DripStix poster with your friends and get <span className="font-semibold text-primary">20% off</span> your next order.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Posters Gallery */}
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-foreground">
              📸 Pick a <span className="text-gradient">Poster</span> to Share
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Long-press or right-click to save, then share on WhatsApp, Instagram, or anywhere!
            </p>

            {isLoading ? (
              <LoadingSpinner text="Loading posters..." />
            ) : posters.length === 0 ? (
              <p className="mt-8 text-center text-muted-foreground">No posters available yet. Check back soon!</p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posters.map((poster) => (
                  <div key={poster.id} className="group overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm card-hover">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={poster.image_url}
                        alt={poster.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-display font-bold text-foreground">{poster.title}</p>
                      <a
                        href={poster.image_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" /> Save Poster
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Contact CTA */}
          <section className="mt-10 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <h2 className="font-display text-xl font-bold text-foreground">Shared a poster?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send us a screenshot of your share and we'll activate your 20% discount!
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20DripStix!%20I%20shared%20a%20poster%20and%20want%20my%2020%25%20discount.%20Here%27s%20my%20screenshot:`}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
              <a
                href={`mailto:${EMAIL}?subject=Affiliate%20Share%20Proof&body=Hi%20DripStix!%20I%20shared%20a%20poster.%20Please%20find%20my%20screenshot%20attached.`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" /> Email Us
              </a>
            </div>
          </section>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            The discount is linked to the phone number you use at checkout. Make sure to use the same number you share with us!
          </p>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Affiliate;
