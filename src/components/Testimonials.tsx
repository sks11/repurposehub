"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah Chen", role: "Business Coach", avatar: "SC", gradient: "from-pink-400 to-purple-500", rating: 5, text: "I used to spend 3 hours every Monday rewriting my blog post for social. Now it takes 2 minutes. And honestly? The AI versions get MORE engagement than what I wrote manually.", metric: "3x engagement increase" },
  { name: "Marcus Johnson", role: "Course Creator", avatar: "MJ", gradient: "from-blue-400 to-cyan-500", rating: 5, text: "The Custom Instructions feature is unreal. I set my tone once and every platform output sounds like me. My students have no idea I'm using RepurposeHub.", metric: "Consistent tone everywhere" },
  { name: "Elena Rodriguez", role: "Marketing Consultant", avatar: "ER", gradient: "from-orange-400 to-red-500", rating: 5, text: "I manage content for 6 clients. RepurposeHub turned a 30-hour/week job into a 5-hour/week job. My clients get better content and I get my life back.", metric: "25 hours saved weekly" },
  { name: "David Park", role: "Fitness Coach", avatar: "DP", gradient: "from-green-400 to-teal-500", rating: 5, text: "I was posting on 2 platforms because I couldn't keep up. Now I'm on 8 platforms and my audience has grown 4x in 3 months. This tool pays for itself 100x over.", metric: "4x audience growth" },
  { name: "Amira Hassan", role: "Leadership Expert", avatar: "AH", gradient: "from-violet-400 to-fuchsia-500", rating: 5, text: "What sets RepurposeHub apart is that it actually understands platform nuances. My LinkedIn posts feel professional, my Threads feel casual — but they all sound like me.", metric: "Platform-native tone" },
  { name: "James Wei", role: "SaaS Founder", avatar: "JW", gradient: "from-amber-400 to-orange-500", rating: 5, text: "We replaced our $4K/month content repurposing contractor with RepurposeHub. Better quality, instant turnaround, and it actually captures our tone. No-brainer.", metric: "$48K saved annually" },
];

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">Loved by <span className="gradient-text">2,400+ creators</span></h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">Coaches, course creators, and marketers trust RepurposeHub to power their content across every platform.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm card-hover relative">
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/8" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 font-medium">{t.metric}</span>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white`}>{t.avatar}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
