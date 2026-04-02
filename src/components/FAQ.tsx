"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does RepurposeHub adapt content for different platforms?", a: "Our AI analyzes the unique requirements of each platform — character limits, formatting rules, audience expectations, and engagement best practices. It then rewrites your content to match the optimal tone, structure, and format for each platform while maintaining your core message and brand voice." },
  { q: "What is the Brand Voice feature and how does it work?", a: "Brand Voice is our signature feature that learns your unique writing style. You upload 3-5 sample texts that represent your best work, and our AI analyzes your tone, vocabulary, sentence structure, and personality markers. All future generations will match your style — so your content sounds like you, not a template." },
  { q: "Which platforms are supported?", a: "We currently support 12 platforms: Twitter/X, LinkedIn, Instagram, YouTube, Email newsletters, Telegram, Reddit, Medium, TikTok, Substack, Threads, and Pinterest. We're constantly adding more based on user requests." },
  { q: "Can I use RepurposeHub for my clients' content?", a: "Absolutely! Our Agency plan includes 10 separate Brand Voice profiles, making it perfect for managing multiple clients. Each profile learns and maintains a distinct voice. You can switch between them instantly." },
  { q: "How long does it take to generate content?", a: "Most generations complete in under 30 seconds. You'll get all 12 platform versions simultaneously — no waiting for each one individually. Pro and Agency users get priority processing for even faster results." },
  { q: "Is my content private and secure?", a: "Yes. We use 256-bit AES encryption for all data in transit and at rest. Your content is never used to train our models. We're GDPR compliant, and you can delete all your data at any time. We also offer a DPA for enterprise customers." },
  { q: "What's the character/word limit for input text?", a: "Free users can input up to 3,000 words per generation. Pro and Agency users can input up to 10,000 words — enough for full blog posts, podcast transcripts, or long-form content." },
  { q: "Do you offer an API?", a: "Yes! Agency plan users get full API access, allowing you to integrate RepurposeHub into your existing content workflows, custom tools, or publishing pipelines. We provide comprehensive documentation and dedicated support for API integration." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel anytime with no penalties. Your access continues until the end of your current billing period. We also offer a 14-day free trial on all paid plans — no credit card required to start." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 section-alt border-y border-border/50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">Questions? <span className="gradient-text">Answered.</span></h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className={`w-full text-left p-5 rounded-2xl transition-all ${open === i ? "bg-white border border-primary/15 shadow-md shadow-primary/5" : "bg-white border border-border/60 hover:border-primary/15 shadow-sm"}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className={`font-medium text-sm ${open === i ? "text-foreground" : "text-muted"}`}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="text-sm text-muted leading-relaxed mt-3 pt-3 border-t border-border/50">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
