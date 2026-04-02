"use client";

import { motion } from "framer-motion";
import { Clock, Layers, Zap, TrendingUp } from "lucide-react";

const stats = [
  { icon: Layers, value: "50,000+", label: "Posts Generated", description: "Across all platforms" },
  { icon: Clock, value: "< 30s", label: "Per Generation", description: "12 posts at once" },
  { icon: TrendingUp, value: "3.2x", label: "More Engagement", description: "vs. manual repurposing" },
  { icon: Zap, value: "8 hrs", label: "Saved Per Week", description: "Average per creator" },
];

export default function SocialProof() {
  return (
    <section className="relative py-20 border-y border-border/50 bg-surface/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-white border border-border/60 shadow-sm card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-foreground">{stat.label}</div>
              <div className="text-xs text-muted mt-1">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
