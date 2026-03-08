import { useQuery } from "@tanstack/react-query";
import { Share2, MessageCircle, Mail, Gift, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <a
                          href={poster.image_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" /> Save
                        </a>
                        <Popover>
                          <PopoverTrigger className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer">
                            <Share2 className="h-3.5 w-3.5" /> Share
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2" align="start">
                            <div className="flex flex-col gap-1">
                              <a
                                href={`https://wa.me/?text=Check%20out%20this%20DripStix%20poster!%20${encodeURIComponent(poster.image_url)}%20Get%2020%25%20off%20by%20sharing!%20https://dripstix.lovable.app/affiliate`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              >
                                <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp
                              </a>
                              <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://dripstix.lovable.app/affiliate")}&quote=${encodeURIComponent("Check out DripStix stickers! Share and get 20% off!")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              >
                                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                              </a>
                              <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out DripStix stickers! Share and get 20% off! 🔥")}&url=${encodeURIComponent("https://dripstix.lovable.app/affiliate")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                X (Twitter)
                              </a>
                              <a
                                href={`https://t.me/share/url?url=${encodeURIComponent("https://dripstix.lovable.app/affiliate")}&text=${encodeURIComponent("Check out DripStix stickers! Share and get 20% off!")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              >
                                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                Telegram
                              </a>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
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
