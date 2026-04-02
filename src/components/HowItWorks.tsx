"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Wand2, Send } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste, step: "01", title: "Paste Your Content",
    description: "Drop in any text — a blog post, newsletter, podcast transcript, or just a rough idea. No formatting needed.",
    color: "from-primary to-primary-dark", detail: "Supports up to 10,000 words per input",
  },
  {
    icon: Wand2, step: "02", title: "AI Adapts Everything",
    description: "Our AI analyzes your text and rewrites it for each platform — matching tone, length, format, and best practices automatically.",
    color: "from-accent to-blue-500", detail: "Uses your Brand Voice profile for consistency",
  },
  {
    icon: Send, step: "03", title: "Copy & Publish",
    description: "Get ready-to-post content for all 12 platforms. One click to copy. No editing needed. Just publish.",
    color: "from-pink-500 to-purple-500", detail: "Average time: under 30 seconds",
  },
];

export default function HowItWorks() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">How It Works</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">
            Three steps. <span className="gradient-text">Zero effort.</span>
          </h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            Stop spending hours manually rewriting content for every platform. RepurposeHub handles the heavy lifting in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative group"
            >
              {i < 2 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 border-t-2 border-dashed border-border" />
              )}
              <div className="bg-white border border-border/60 rounded-2xl p-8 h-full shadow-sm card-hover group-hover:border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-primary/15`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-bold text-border group-hover:text-primary/15 transition-colors">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted leading-relaxed mb-4">{step.description}</p>
                <div className="text-xs text-primary font-medium bg-primary/5 px-3 py-1.5 rounded-lg inline-block">{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
