"use client";

import { motion } from "framer-motion";
import { Globe, MousePointerClick, PanelRight, Copy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Highlight Any Text",
    description: "Select text on any webpage — a blog post, tweet, newsletter, article, or competitor content.",
  },
  {
    icon: PanelRight,
    title: "Side Panel Opens",
    description: "Right-click → 'Repurpose with RepurposeHub'. A side panel slides open with all 12 platform versions.",
  },
  {
    icon: Copy,
    title: "Copy & Publish",
    description: "One-click copy for each platform. Your brand voice is applied automatically. Just paste and post.",
  },
];

export default function ChromeExtension() {
  return (
    <section className="relative py-28 overflow-hidden section-alt border-y border-border/50">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                Chrome Extension
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-foreground">
              Repurpose from{" "}
              <span className="gradient-text">anywhere</span> on the web
            </h2>
            <p className="text-muted text-lg mt-5 leading-relaxed">
              See a great blog post? An inspiring tweet? Highlight the text,
              right-click, and get 12 platform-ready versions instantly — without
              leaving the page.
            </p>

            <div className="space-y-5 mt-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <a
                href="/chrome-extension.zip"
                download
                className="group inline-flex items-center justify-center gap-2 text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                <Globe className="w-4 h-4" />
                Download Chrome Extension
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <span className="text-xs text-muted self-center">
                Free &middot; Works with any RepurposeHub account
              </span>
            </div>
          </motion.div>

          {/* Right: Visual mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Browser mockup with side panel */}
            <div className="rounded-2xl border border-border/60 shadow-xl overflow-hidden bg-white">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-white rounded-lg px-3 py-1 text-[10px] text-muted text-center border border-border/60">
                    blog.example.com/productivity-tips
                  </div>
                </div>
              </div>

              {/* Content area with side panel */}
              <div className="flex">
                {/* Page content */}
                <div className="flex-1 p-5 border-r border-border/50">
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 bg-foreground/10 rounded" />
                    <div className="h-2 w-full bg-muted/10 rounded" />
                    <div className="h-2 w-full bg-muted/10 rounded" />
                    {/* Highlighted text */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 relative">
                      <p className="text-[10px] text-foreground/70 leading-relaxed">
                        The 5 productivity habits that changed my business:
                        focus on one thing at a time, batch similar tasks,
                        protect your morning hours...
                      </p>
                      {/* Floating button mockup */}
                      <div className="absolute -bottom-3 right-4 flex items-center gap-1 bg-gradient-to-r from-primary to-primary-dark text-white text-[9px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg shadow-primary/30">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                        </svg>
                        Repurpose
                      </div>
                    </div>
                    <div className="h-2 w-4/5 bg-muted/10 rounded mt-4" />
                    <div className="h-2 w-full bg-muted/10 rounded" />
                  </div>
                </div>

                {/* Side panel */}
                <div className="w-[180px] bg-surface/50 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">R</span>
                    </div>
                    <span className="text-[9px] font-bold text-foreground">
                      Repurpose<span className="gradient-text">Hub</span>
                    </span>
                  </div>
                  {[
                    { name: "Twitter/X", color: "#1d9bf0" },
                    { name: "LinkedIn", color: "#0a66c2" },
                    { name: "Instagram", color: "#e1306c" },
                    { name: "TikTok", color: "#ff0050" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="bg-white rounded-lg p-2 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${p.color}10`,
                            color: p.color,
                          }}
                        >
                          {p.name}
                        </span>
                        <span className="text-[7px] text-primary font-semibold">
                          Copy
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="h-1 w-full bg-muted/15 rounded" />
                        <div className="h-1 w-4/5 bg-muted/15 rounded" />
                        <div className="h-1 w-3/5 bg-muted/15 rounded" />
                      </div>
                    </div>
                  ))}
                  <div className="text-[8px] text-muted text-center pt-1">
                    +8 more platforms
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
