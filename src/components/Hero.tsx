"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Mail } from "lucide-react";
import {
  XTwitterIcon,
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
  TelegramIcon,
  SubstackIcon,
} from "./Icons";

const platformIcons = [
  { icon: XTwitterIcon, label: "X / Twitter", color: "#1d9bf0" },
  { icon: LinkedInIcon, label: "LinkedIn", color: "#0a66c2" },
  { icon: InstagramIcon, label: "Instagram", color: "#e1306c" },
  { icon: YouTubeIcon, label: "YouTube", color: "#ff0000" },
  { icon: Mail, label: "Email", color: "#7c3aed" },
  { icon: TelegramIcon, label: "Telegram", color: "#2aabee" },
  { icon: SubstackIcon, label: "Substack", color: "#ff6600" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/3 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Now supporting 12+ platforms</span>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            New
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto text-foreground"
        >
          One text in.{" "}
          <span className="gradient-text">Every platform</span> out.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Paste any text and get perfectly adapted, ready-to-publish content for
          12+ platforms in seconds — written in{" "}
          <span className="text-foreground font-semibold">your voice</span>, not
          a template.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="/auth/signup"
            className="group flex items-center gap-2 text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]"
          >
            Start Free — No Card Required
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#platforms"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-medium text-foreground border border-border hover:border-primary/30 hover:bg-surface transition-all"
          >
            See Live Demo
          </a>
        </motion.div>

        {/* Platform icons */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-5 mt-14"
        >
          {platformIcons.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 200 }}
              className="w-11 h-11 rounded-xl bg-white border border-border/80 shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all cursor-default"
              title={p.label}
            >
              <p.icon className="w-5 h-5" style={{ color: p.color }} />
            </motion.div>
          ))}
          <div className="w-11 h-11 rounded-xl bg-white border border-border/80 shadow-sm flex items-center justify-center text-muted text-sm font-semibold">
            +5
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-14 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-purple-400", "bg-blue-400", "bg-pink-400", "bg-cyan-400", "bg-amber-400"].map((bg, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${bg} border-2 border-white shadow-sm`}
                />
              ))}
            </div>
            <span>
              <strong className="text-foreground">2,400+</strong> creators
            </span>
          </div>
          <div className="w-px h-5 bg-border hidden sm:block" />
          <span>
            <strong className="text-foreground">50,000+</strong> posts generated
          </span>
          <div className="w-px h-5 bg-border hidden sm:block" />
          <span>
            <strong className="text-foreground">12</strong> platforms supported
          </span>
        </motion.div>

        {/* App preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden">
          </div>
        </motion.div>
      </div>
    </section>
  );
}
