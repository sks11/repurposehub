"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Platforms", href: "#platforms" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const { user, loading: authLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-primary/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Repurpose<span className="gradient-text">Hub</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!authLoading && user ? (
              <a
                href="/dashboard"
                className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/auth/signin"
                  className="text-sm text-muted hover:text-foreground transition-colors px-4 py-2 font-medium"
                >
                  Sign in
                </a>
                <a
                  href="/auth/signup"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Get Started Free
                </a>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-6 border-t border-border flex flex-col gap-3">
                {!authLoading && user ? (
                  <a
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-3 rounded-xl font-medium text-lg"
                  >
                    Dashboard
                  </a>
                ) : (
                  <>
                    <a href="/auth/signin" className="text-muted text-lg">Sign in</a>
                    <a
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                      className="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-3 rounded-xl font-medium text-lg"
                    >
                      Get Started Free
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
