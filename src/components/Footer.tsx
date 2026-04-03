"use client";

import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#how-it-works" },
    { label: "Platforms", href: "/#platforms" },
    { label: "Brand Voice", href: "/#voice" },
    { label: "Chrome Extension", href: "/#extension" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Account: [
    { label: "Sign Up Free", href: "/auth/signup" },
    { label: "Sign In", href: "/auth/signin" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/40">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">Repurpose<span className="gradient-text">Hub</span></span>
            </a>
            <p className="text-sm text-muted leading-relaxed">One text in. Every platform out.<br />Content repurposing, powered by AI.</p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-4 text-foreground">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}><a href={link.href} className="text-sm text-muted hover:text-primary transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} RepurposeHub. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
