"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { PLAN_LIMITS } from "@/lib/plans";
import { CreditCard, Check, Crown, Building, Zap, ExternalLink } from "lucide-react";
import {
  STRIPE_CHECKOUT_CANCELED_NOTICE_KEY,
  STRIPE_CHECKOUT_PENDING_KEY,
} from "@/lib/stripeReturnRecovery";

const planCards = [
  {
    id: "free" as const, name: "Starter", icon: Zap, price: "$0",
    features: ["30 generations/month", "All 12 platforms", "1 voice profile", "7-day history"],
  },
  {
    id: "pro" as const, name: "Pro", icon: Crown, price: "$29",
    features: ["1,000 generations/month", "All 12 platforms", "3 voice profiles", "90-day history", "Email support"],
  },
];

export default function SettingsPage() {
  const { user, plan, usage, getIdToken } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [checkoutCanceled] = useState(() => {
    if (typeof window === "undefined") return false;

    const search = new URLSearchParams(window.location.search);
    if (search.get("checkout") === "canceled") {
      return true;
    }

    return window.sessionStorage.getItem(STRIPE_CHECKOUT_CANCELED_NOTICE_KEY) === "1";
  });

  useEffect(() => {
    if (!checkoutCanceled || typeof window === "undefined") return;

    window.history.replaceState({}, "", window.location.pathname);
    window.sessionStorage.removeItem(STRIPE_CHECKOUT_CANCELED_NOTICE_KEY);
  }, [checkoutCanceled]);

  const handleUpgrade = async (planType: 'pro' | 'agency') => {
    setUpgrading(planType);
    try {
      window.sessionStorage.setItem(
        STRIPE_CHECKOUT_PENDING_KEY,
        JSON.stringify({
          planType,
          returnTo: window.location.pathname,
        })
      );

      const token = await getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
    } catch { /* ignore */ }

    window.sessionStorage.removeItem(STRIPE_CHECKOUT_PENDING_KEY);
    setUpgrading(null);
  };

  const limits = PLAN_LIMITS[plan];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-2">Manage your account, plan, and billing.</p>
      </div>

      {checkoutCanceled && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checkout was canceled. Your current plan has not changed.
        </div>
      )}

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted uppercase tracking-wide font-medium">Email</span>
            <p className="text-sm text-foreground mt-1">{user?.email}</p>
          </div>
          <div>
            <span className="text-xs text-muted uppercase tracking-wide font-medium">Current Plan</span>
            <p className="text-sm text-foreground mt-1 font-semibold capitalize">{plan}</p>
          </div>
          <div>
            <span className="text-xs text-muted uppercase tracking-wide font-medium">Generations This Month</span>
            <p className="text-sm text-foreground mt-1">
              {usage?.generationsCount || 0}
              {limits.generationsPerMonth !== -1 ? ` / ${limits.generationsPerMonth}` : ' (unlimited)'}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted uppercase tracking-wide font-medium">Voice Profile Slots</span>
            <p className="text-sm text-foreground mt-1">{limits.voiceProfiles}</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          <CreditCard className="w-5 h-5 inline mr-2 text-primary" />
          Plans & Billing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planCards.map((p) => {
            const isCurrent = plan === p.id;
            return (
              <div key={p.id} className={`bg-white rounded-2xl p-6 ${
                isCurrent ? "border-2 border-primary/20 shadow-lg shadow-primary/5" : "border border-border/60 shadow-sm"
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCurrent ? "bg-primary/10" : "bg-surface"}`}>
                    <p.icon className={`w-5 h-5 ${isCurrent ? "text-primary" : "text-muted"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{p.name}</h3>
                    <span className="text-lg font-bold text-foreground">{p.price}<span className="text-xs text-muted font-normal">/mo</span></span>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted">
                      <Check className={`w-3.5 h-3.5 ${isCurrent ? "text-primary" : "text-green-500"}`} />{f}
                    </div>
                  ))}
                </div>
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl bg-primary/5 text-primary text-sm font-semibold text-center">Current Plan</div>
                ) : p.id !== 'free' ? (
                  <button onClick={() => handleUpgrade(p.id as 'pro' | 'agency')} disabled={!!upgrading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {upgrading === p.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Upgrade <ExternalLink className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Data & Privacy</h2>
        <div className="space-y-3">
          <p className="text-sm text-muted">Your content is encrypted in transit and at rest (256-bit AES). We never use your content to train our models.</p>
          <div className="flex gap-3">
            <button className="text-sm text-primary font-medium hover:underline">Export My Data</button>
            <button className="text-sm text-red-500 font-medium hover:underline">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
