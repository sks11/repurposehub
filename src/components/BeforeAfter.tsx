"use client";

import { motion } from "framer-motion";
import { X, Check, Clock, ArrowRight } from "lucide-react";

export default function BeforeAfter() {
  return (
    <section className="relative py-28 overflow-hidden section-alt border-y border-border/50">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm font-semibold text-accent tracking-wider uppercase">The Difference</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">Manual vs. <span className="gradient-text">RepurposeHub</span></h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">See how your content workflow changes when you stop copy-pasting and start repurposing.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Clock className="w-5 h-5 text-red-500" /></div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Manual Workflow</h3>
                <span className="text-xs text-red-500 font-medium">~4 hours per content piece</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                "Write original blog post (60 min)", "Manually rewrite for Twitter (20 min)",
                "Adapt for LinkedIn with different tone (25 min)", "Create Instagram carousel copy (30 min)",
                "Write email newsletter version (25 min)", "Format for Telegram channel (15 min)",
                "Write Reddit-style discussion post (20 min)", "Adapt for remaining platforms (45 min)",
                "Review all versions for consistency (20 min)", "Format and schedule across tools (20 min)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5"><X className="w-3 h-3 text-red-400" /></div>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-red-50/50 rounded-xl border border-red-100">
              <div className="text-sm text-red-600 font-semibold">Total: ~4 hours of repetitive work</div>
              <div className="text-xs text-muted mt-1">20 hours/week if you post 5x. That&apos;s a part-time job.</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 border-2 border-primary/20 shadow-lg shadow-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><ArrowRight className="w-5 h-5 text-green-500" /></div>
              <div>
                <h3 className="font-bold text-lg text-foreground">RepurposeHub Workflow</h3>
                <span className="text-xs text-green-600 font-medium">~2 minutes per content piece</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                "Write your original content (you already did this)", "Paste into RepurposeHub (5 seconds)",
                "Click 'Repurpose' (1 click)", "Get 12 platform-ready versions (30 seconds)",
                "Quick review — already in your voice (60 seconds)", "Copy and publish to each platform (30 seconds each)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-green-500" /></div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50/50 rounded-xl border border-green-100">
              <div className="text-sm text-green-600 font-semibold">Total: ~2 minutes. That&apos;s it.</div>
              <div className="text-xs text-muted mt-1">Save 19+ hours/week. Reclaim your creative energy.</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[{ label: "Time Saved", value: "97%" }, { label: "Per Week", value: "19hrs" }, { label: "Per Year", value: "988hrs" }].map((stat) => (
                <div key={stat.label} className="text-center p-3 bg-surface rounded-xl">
                  <div className="text-lg font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
