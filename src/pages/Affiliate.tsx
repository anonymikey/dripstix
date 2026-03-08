import { Link } from "react-router-dom";
import { Share2, MessageCircle, Mail, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const WHATSAPP_NUMBER = "254710988061";
const EMAIL = "info@dripstix.site";

const steps = [
  { icon: Share2, title: "Share a Poster", desc: "Browse our shop, pick a poster you love, and share it with your friends and family." },
  { icon: MessageCircle, title: "Send Proof", desc: `Take a screenshot of your share and send it to us on WhatsApp (+${WHATSAPP_NUMBER}) or email (${EMAIL}).` },
  { icon: Gift, title: "Get 20% Off", desc: "Once we verify your share, we'll activate a 20% discount on your phone number. It auto-applies at checkout!" },
];

const Affiliate = () => {
  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container max-w-3xl pt-24 pb-20">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
            Share & <span className="text-gradient">Save 20%</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Share any DripStix poster with your friends and get <span className="font-semibold text-primary">20% off</span> your next order. Here's how it works:
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

          <section className="mt-10 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <h2 className="font-display text-xl font-bold text-foreground">Ready to share?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Head to the shop, pick a poster, and share it on WhatsApp, Instagram, or anywhere you like. Then send us proof!
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25"
              >
                <Share2 className="h-4 w-4" /> Browse & Share
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20DripStix!%20I%20shared%20a%20poster%20and%20want%20my%2020%25%20discount.%20Here%27s%20my%20screenshot:`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
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
