"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Zap, LayoutDashboard, History, Settings, LogOut, CreditCard } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/plans";
import {
  STRIPE_CHECKOUT_PENDING_KEY,
  STRIPE_CHECKOUT_RELOAD_KEY,
} from "@/lib/stripeReturnRecovery";

const navItems = [
  { href: "/dashboard", label: "Generate", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, plan, usage, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const debugAuth = process.env.NODE_ENV !== "production";
  const [isPopup] = useState(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "popup"
  );
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (!debugAuth) return;
    console.info("[DashboardLayout] render-state", {
      pathname,
      loading,
      user: user?.email ?? null,
    });
  }, [debugAuth, loading, pathname, user]);

  useEffect(() => {
    if (!debugAuth || typeof window === "undefined") return;

    (window as Window & { __dashboardDebug?: Record<string, unknown> }).__dashboardDebug = {
      pathname,
      loading,
      user: user?.email ?? null,
      isPopup,
      showRecovery,
      href: window.location.href,
      updatedAt: Date.now(),
    };
  }, [debugAuth, isPopup, loading, pathname, showRecovery, user]);

  useEffect(() => {
    if (!loading && !user) {
      if (debugAuth) {
        console.warn("[DashboardLayout] redirecting to sign in", { pathname });
      }
      router.replace("/auth/signin");
    }
  }, [debugAuth, pathname, user, loading, router]);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setTimeout(() => {
      setShowRecovery(true);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (typeof window === "undefined" || loading || !user) return;

    window.sessionStorage.removeItem(STRIPE_CHECKOUT_PENDING_KEY);
    window.sessionStorage.removeItem(STRIPE_CHECKOUT_RELOAD_KEY);
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        {loading && showRecovery ? (
          <div className="max-w-md rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-foreground">Still restoring your session</h1>
            <p className="mt-2 text-sm text-muted">
              The dashboard is taking longer than expected to load. You can retry this page or sign in again.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
              <button
                onClick={() => router.replace("/auth/signin")}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                Sign In Again
              </button>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-6">
        <div className="max-w-md rounded-2xl border border-border/60 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">Session expired</h1>
          <p className="mt-2 text-sm text-muted">
            Please sign in again to continue to your dashboard.
          </p>
          <Link
            href="/auth/signin"
            className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white"
          >
            Go To Sign In
          </Link>
        </div>
      </div>
    );
  }

  const limits = PLAN_LIMITS[plan];
  const generationsUsed = usage?.generationsCount || 0;
  const generationsLimit = limits.generationsPerMonth;
  const usagePercent = generationsLimit === -1 ? 0 : Math.min(100, (generationsUsed / generationsLimit) * 100);

  if (isPopup) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-foreground">Repurpose<span className="gradient-text">Hub</span></span>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border/60 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Repurpose<span className="gradient-text">Hub</span></span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/8 text-primary border border-primary/15"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usage */}
        <div className="p-4 border-t border-border/50">
          <div className="bg-surface rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Usage</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                plan === 'free' ? 'bg-gray-100 text-gray-600' :
                plan === 'pro' ? 'bg-primary/10 text-primary' :
                'bg-amber-100 text-amber-700'
              }`}>
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Generations</span>
                <span className="text-foreground font-medium">
                  {generationsUsed}{generationsLimit !== -1 ? ` / ${generationsLimit}` : ' (unlimited)'}
                </span>
              </div>
              {generationsLimit !== -1 && (
                <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
                </div>
              )}
            </div>
            {plan === 'free' && (
              <Link href="/dashboard/settings" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold hover:shadow-md transition-all">
                <CreditCard className="w-3.5 h-3.5" /> Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white text-xs font-bold">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{user.email}</div>
            </div>
            <button onClick={() => { signOut(); router.push('/'); }} className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
