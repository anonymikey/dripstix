import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Share2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AFFILIATE_STORAGE_KEY = "dripstix_affiliate_code";

const generateCode = () => `DRIP${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const Affiliate = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(() => localStorage.getItem(AFFILIATE_STORAGE_KEY) || "");

  const shareLink = useMemo(() => {
    if (!code) return "";
    return `${window.location.origin}/shop?ref=${encodeURIComponent(code)}`;
  }, [code]);

  const createAffiliateLink = async () => {
    setLoading(true);
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const candidate = generateCode();
        const { error } = await supabase.from("affiliate_codes").insert({ code: candidate });

        if (!error) {
          setCode(candidate);
          localStorage.setItem(AFFILIATE_STORAGE_KEY, candidate);
          localStorage.setItem("dripstix_referral_code", candidate);
          toast.success("Affiliate link created");
          return;
        }

        if ((error as { code?: string }).code === "23505") {
          continue;
        }

        throw error;
      }

      throw new Error("Could not generate a unique link. Please try again.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create affiliate link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    toast.success("Link copied. Share it with family & friends 🎉");
  };

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container max-w-3xl pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
            Affiliate <span className="text-gradient">Link</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Create your personal share link. Anyone who orders through your link gets <span className="font-semibold text-primary">20% off</span> at checkout.
          </p>

          <section className="mt-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Your affiliate code</p>
                <p className="mt-1 font-display text-2xl font-black tracking-wide text-primary">{code || "Not generated yet"}</p>
              </div>
              <button
                onClick={createAffiliateLink}
                disabled={loading}
                className="gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating..." : code ? "Generate New Link" : "Generate My Link"}
              </button>
            </div>

            {shareLink && (
              <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Share URL</p>
                <p className="mt-2 break-all text-sm text-foreground">{shareLink}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={copyLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Copy className="h-4 w-4" /> Copy Link
                  </button>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" /> Pick a poster to share
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Affiliate;
