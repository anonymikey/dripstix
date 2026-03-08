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
  { icon: Phone, label: "Phone", value: "+254 700 000 000", href: "tel:+254700000000" },
  { icon: Mail, label: "Email", value: "hello@dripstix.com", href: "mailto:hello@dripstix.com" },
  { icon: MapPin, label: "Location", value: "Nairobi, Kenya", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9AM–6PM", href: "#" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/254700000000"
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
