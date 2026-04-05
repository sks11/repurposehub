"use client";

import { motion } from "framer-motion";
import { Globe, MousePointerClick, PanelRight, Copy, ArrowRight, Download, Puzzle, FolderOpen } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Select & Right-Click",
    description: "Highlight any text on a webpage, then right-click and choose 'Repurpose with RepurposeHub'.",
  },
  {
    icon: PanelRight,
    title: "Choose Platforms",
    description: "The side panel opens with your text loaded. Pick which platforms you want, then hit Generate.",
  },
  {
    icon: Copy,
    title: "Copy & Publish",
    description: "Copy individual outputs or use Copy All. Just paste and post.",
  },
];

const installSteps = [
  {
    icon: Download,
    num: "1",
    title: "Download",
    description: "Click the button above to download the extension zip file.",
  },
  {
    icon: FolderOpen,
    num: "2",
    title: "Unzip",
    description: "Extract the downloaded zip file to a folder on your computer.",
  },
  {
    icon: Puzzle,
    num: "3",
    title: "Install",
    description: "Go to chrome://extensions, enable Developer Mode, click 'Load unpacked', and select the folder.",
  },
];

export default function ChromeExtension() {
  return (
    <section id="extension" className="relative py-28 overflow-hidden section-alt border-y border-border/50">
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
              See a great blog post? An inspiring article? Select the text,
              right-click, and get platform-ready versions instantly — without
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
                <Download className="w-4 h-4" />
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
            {/* Browser mockup with right-click context menu */}
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
                    techcrunch.com/2026/openai-acquires-tbpn
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div className="flex">
                {/* Page content with context menu */}
                <div className="flex-1 p-5 relative">
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 bg-foreground/10 rounded" />
                    <div className="h-2 w-full bg-muted/10 rounded" />
                    {/* Highlighted text */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-[10px] text-foreground/70 leading-relaxed">
                        OpenAI has acquired TBPN, the popular founder-led business
                        talk show, marking its first move into media content...
                      </p>
                    </div>
                    <div className="h-2 w-4/5 bg-muted/10 rounded" />
                    <div className="h-2 w-full bg-muted/10 rounded" />
                  </div>

                  {/* Context menu mockup */}
                  <div className="absolute top-16 right-6 bg-white rounded-lg shadow-2xl border border-border/80 py-1 w-[200px] z-10">
                    <div className="px-3 py-1.5 text-[10px] text-muted hover:bg-surface">Copy</div>
                    <div className="px-3 py-1.5 text-[10px] text-muted hover:bg-surface">Paste</div>
                    <div className="h-px bg-border/50 my-0.5" />
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-primary bg-primary/5 flex items-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                      </svg>
                      Repurpose with RepurposeHub
                    </div>
                    <div className="px-3 py-1.5 text-[10px] text-muted hover:bg-surface">Search Google for...</div>
                  </div>
                </div>

                {/* Side panel */}
                <div className="w-[180px] bg-surface/50 p-3 space-y-2 border-l border-border/50">
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

        {/* Installation instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">How to Install</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {installSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">{step.num}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
