import { motion } from "framer-motion";

const steps = [
  { number: 1, title: "Browse\nDesigns", desc: "Explore our collection of premium phone and laptop stickers." },
  { number: 2, title: "Pick Your\nStyle", desc: "Choose from matte, glossy, transparent, or holographic finishes." },
  { number: 3, title: "Place Your\nOrder", desc: "Add to cart, enter your details, and pay via M-PESA." },
  { number: 4, title: "Get It\nDelivered", desc: "We process and deliver your stickers right to your door." },
];

const HowItWorks = () => (
  <section className="py-16 sm:py-24">
    <div className="container max-w-5xl">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3"
      >
        How It Works
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-12 sm:mb-16"
      >
        Order your stickers —<br className="hidden sm:block" /> step by step
      </motion.h2>

      {/* Desktop */}
      <div className="hidden md:block relative">
        <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border" />
        <div className="grid grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center text-primary font-bold text-lg mb-6 shadow-lg shadow-primary/20">
                {step.number}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground whitespace-pre-line leading-tight mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-8 relative pl-8">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative flex gap-4 items-start"
          >
            <div className="relative z-10 shrink-0 w-10 h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center text-primary font-bold text-sm -ml-8 shadow-lg shadow-primary/20">
              {step.number}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">{step.title.replace("\n", " ")}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
