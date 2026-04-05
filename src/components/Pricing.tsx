"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter", icon: Zap, description: "For creators getting started",
    price: 0, badge: null,
    features: ["30 generations / month", "All 12 platforms", "Custom Instructions", "7-day history", "One-click copy"],
    cta: "Start Free", ctaStyle: "border-2 border-border hover:border-primary/40 hover:bg-surface text-foreground", popular: false,
  },
  {
    name: "Pro", icon: Crown, description: "For serious content creators",
    price: 29, badge: "Most Popular",
    features: ["1,000 generations / month", "All 12 platforms", "Custom Instructions", "90-day history + search", "URL content import", "Copy All outputs", "Email support"],
    cta: "Upgrade to Pro", ctaStyle: "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white shadow-lg shadow-primary/20", popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[300px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">Simple, <span className="gradient-text">transparent</span> pricing</h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">Start free. Upgrade when you&apos;re ready. No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl p-8 ${plan.popular ? "bg-white border-2 border-primary/20 shadow-xl shadow-primary/8 scale-[1.02]" : "bg-white border border-border/60 shadow-sm"}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">{plan.badge}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary/10" : "bg-surface"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-muted"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted">{plan.description}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted text-sm">{plan.price > 0 ? "/month" : ""}</span>
              </div>
              <a href={plan.price === 0 ? "/auth/signup" : "/auth/signup?plan=pro"}
                className={`block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all hover:scale-[1.02] cursor-pointer ${plan.ctaStyle}`}>{plan.cta}</a>
              <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-primary" : "text-green-500"}`} />
                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-center gap-8 mt-14 text-sm text-muted">
          {["No credit card required for free plan", "Cancel anytime", "GDPR compliant", "256-bit encryption"].map((item) => (
            <div key={item} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500" />{item}</div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
