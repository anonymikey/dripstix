import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+254 710 988 061", href: "tel:+254710988061" },
  { icon: Phone, label: "Phone", value: "+254 113 313 240", href: "tel:+254113313240" },
  { icon: Phone, label: "Phone", value: "+254 782 829 321", href: "tel:+254782829321" },
  { icon: Mail, label: "Email", value: "info@dripstix.site", href: "mailto:info@dripstix.site" },
  { icon: MapPin, label: "Location", value: "Voi, Mombasa Road", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9AM–6PM", href: "#" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you soon 🎉");
    setForm({ name: "", email: "", phone: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated orbs */}
        <motion.div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <MessageCircle className="h-3.5 w-3.5" />
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Let's{" "}
            <span className="text-gradient">Talk</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Got a question, custom order, or just want to say hi? We'd love to hear from you!
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="container pb-24">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info Cards */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {contactInfo.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                variants={itemVariants}
                whileHover={{ scale: 1.03, x: 6 }}
                className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div variants={itemVariants} className="mt-2 flex items-center gap-3">
              {[
                {
                  name: "TikTok",
                  href: "https://www.tiktok.com/@dripstix_?_r=1&_t=ZS-94XOhj69hLM",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73A8.19 8.19 0 0 0 20.82 10V6.53a4.77 4.77 0 0 1-1.23.16Z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/dripstix_?igsh=OXF0N3Fta2J5ZDgy",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  name: "WhatsApp",
                  href: "https://chat.whatsapp.com/C1GMKlNHZWd2SdlvaSaYAK?mode=hq1tcla",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/60 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://chat.whatsapp.com/C1GMKlNHZWd2SdlvaSaYAK?mode=hq1tcla"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[hsl(142,70%,45%)] px-6 py-4 font-semibold text-white shadow-lg shadow-[hsl(142,70%,45%)]/20 transition-shadow hover:shadow-xl hover:shadow-[hsl(142,70%,45%)]/30"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">Send a Message</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Your Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Brian"
                  maxLength={100}
                  required
                  className="bg-background/50 border-border/60 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="brian@email.com"
                  maxLength={255}
                  className="bg-background/50 border-border/60 focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0700 000 000"
                maxLength={15}
                className="bg-background/50 border-border/60 focus:border-primary"
              />
            </div>

            <div className="mt-5 space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Message *</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you need..."
                rows={5}
                maxLength={1000}
                required
                className="bg-background/50 border-border/60 focus:border-primary resize-none"
              />
            </div>

            <motion.div className="mt-6" whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={sending}
                className="w-full gradient-brand rounded-full py-6 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30"
              >
                {sending ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
