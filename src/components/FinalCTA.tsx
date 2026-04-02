"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-accent/4 rounded-full blur-[150px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted mb-8">
            <Sparkles className="w-4 h-4 text-primary" />Ready to repurpose?
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold leading-tight text-foreground">Stop rewriting. <span className="gradient-text">Start repurposing.</span></h2>
          <p className="text-lg text-muted mt-6 max-w-2xl mx-auto leading-relaxed">Join 2,400+ creators who save 19+ hours every week with RepurposeHub. Turn one piece of content into 12 platform-ready posts — in your voice, in seconds.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href="/auth/signup" className="group flex items-center gap-2 text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary px-10 py-5 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]">
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-sm text-muted mt-5">No credit card required &middot; 30 free generations &middot; Cancel anytime</p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 pt-8 border-t border-border/50">
            {[{ value: "2,400+", label: "Active creators" }, { value: "50,000+", label: "Posts generated" }, { value: "4.9/5", label: "Average rating" }, { value: "< 30s", label: "Generation time" }].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
