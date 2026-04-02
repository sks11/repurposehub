"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Zap, LayoutDashboard, History, Mic, Settings, LogOut, CreditCard } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/plans";

const navItems = [
  { href: "/dashboard", label: "Generate", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/voice", label: "Brand Voice", icon: Mic },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, plan, usage, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const limits = PLAN_LIMITS[plan];
  const generationsUsed = usage?.generationsCount || 0;
  const generationsLimit = limits.generationsPerMonth;
  const usagePercent = generationsLimit === -1 ? 0 : Math.min(100, (generationsUsed / generationsLimit) * 100);

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border/60 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Repurpose<span className="gradient-text">Hub</span></span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/8 text-primary border border-primary/15"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
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
              <a href="/dashboard/settings" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold hover:shadow-md transition-all">
                <CreditCard className="w-3.5 h-3.5" /> Upgrade
              </a>
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
