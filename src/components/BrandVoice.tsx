"use client";

import { motion } from "framer-motion";
import { Fingerprint, Mic, Brain, ShieldCheck } from "lucide-react";

const features = [
  { icon: Mic, title: "Voice Analysis", description: "Upload 3–5 of your best posts. Our AI learns your tone, vocabulary, sentence rhythm, and personality markers." },
  { icon: Brain, title: "Smart Adaptation", description: "Each platform gets a version that sounds like YOU — not a template. Your LinkedIn sounds professional-you. Your Twitter sounds punchy-you." },
  { icon: Fingerprint, title: "Unique Fingerprint", description: "Your audience will never know it was AI-assisted. Every output carries your distinctive voice, phrases, and style." },
  { icon: ShieldCheck, title: "Always Improving", description: "Rate outputs and your voice profile gets sharper over time. The more you use it, the more it sounds like you." },
];

export default function BrandVoice() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-pink-500/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Brand Voice AI</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight text-foreground">
              It sounds like <span className="gradient-text-warm">you</span>, not a robot.
            </h2>
            <p className="text-muted text-lg mt-5 leading-relaxed">
              Most AI tools produce generic, lifeless content. RepurposeHub learns your unique voice and adapts it for every platform — so your audience always recognizes you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-foreground">{f.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-4">
            {/* Without Brand Voice */}
            <div className="bg-white border border-border/60 rounded-2xl p-6 relative shadow-sm">
              <div className="absolute -top-3 left-5">
                <span className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">Without Brand Voice</span>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-2">
                &ldquo;Here are 5 valuable lessons I learned from building my coaching business. First, it&apos;s important to focus on quality over quantity. Second, systems are crucial for success. Third, storytelling matters in business.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs text-red-500 font-medium">Generic, template-like, no personality</span>
              </div>
            </div>

            {/* With Brand Voice */}
            <div className="bg-white rounded-2xl p-6 relative border-2 border-primary/20 shadow-lg shadow-primary/5">
              <div className="absolute -top-3 left-5 z-10">
                <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">With Brand Voice</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mt-2">
                &ldquo;Real talk: I cut my client roster in HALF and 3x&apos;d my revenue. Wild, right? Here&apos;s what nobody tells you about scaling — it&apos;s not about more. It&apos;s about better. 40 clients → 18 clients → $50K/month. Let me break this down...&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 font-medium">Authentic, personal, unmistakably you</span>
              </div>
            </div>

            {/* Voice metrics */}
            <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-semibold mb-4 text-foreground">Voice Match Score</h4>
              <div className="space-y-3">
                {[
                  { label: "Tone Match", value: 96 },
                  { label: "Vocabulary Consistency", value: 93 },
                  { label: "Sentence Structure", value: 91 },
                  { label: "Personality Markers", value: 94 },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{metric.label}</span>
                      <span className="text-primary font-semibold">{metric.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
