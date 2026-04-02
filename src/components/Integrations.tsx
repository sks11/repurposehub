"use client";

import { motion } from "framer-motion";
import { Plug, ArrowRight } from "lucide-react";

const integrations = [
  { name: "Zapier", description: "Automate your workflow", color: "#ff4a00" },
  { name: "Buffer", description: "Schedule across platforms", color: "#168eea" },
  { name: "Notion", description: "Sync content library", color: "#333" },
  { name: "Google Docs", description: "Import from docs", color: "#4285f4" },
  { name: "WordPress", description: "Publish blog posts", color: "#21759b" },
  { name: "Slack", description: "Team notifications", color: "#4a154b" },
  { name: "Airtable", description: "Content calendar", color: "#18bfff" },
  { name: "Webhooks", description: "Custom integrations", color: "#7c3aed" },
];

export default function Integrations() {
  return (
    <section className="relative py-28 section-alt border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-4">
              <Plug className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-accent tracking-wider uppercase">Integrations</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-foreground">Connects to your <span className="gradient-text">existing stack</span></h2>
            <p className="text-muted text-lg mt-5 leading-relaxed">RepurposeHub works with the tools you already use. Automate your entire content pipeline — from creation to scheduling to publishing.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors">View all integrations <ArrowRight className="w-4 h-4" /></a>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">API documentation <ArrowRight className="w-4 h-4" /></a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {integrations.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.3 }}
                className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm card-hover group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold" style={{ background: `${item.color}10`, color: item.color }}>{item.name[0]}</div>
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</div>
                    <div className="text-xs text-muted">{item.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
