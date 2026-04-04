"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Users, TrendingUp, Crown, Activity, RefreshCw, Zap } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  plan: string;
  createdAt: number;
  generationsThisMonth: number;
  recentGenerations: {
    id: string;
    platforms: string[];
    createdAt: number;
    inputPreview: string;
    cost?: { model: string; inputTokens: number; outputTokens: number; totalTokens: number; costUsd: number };
  }[];
}

interface Stats {
  summary: {
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    activeUsersThisMonth: number;
    totalGenerationsThisMonth: number;
    monthKey: string;
  };
  users: UserData[];
}

export default function AdminPage() {
  const { user, loading: authLoading, getIdToken } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setError("Access denied. Admin only.");
        return;
      }
      if (!res.ok) {
        setError("Failed to load stats");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }
    if (user) fetchStats();
  }, [user, authLoading, router, fetchStats]);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  const formatDateTime = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-8 text-center max-w-md">
          <div className="text-red-500 text-lg font-semibold mb-2">{error}</div>
          <a href="/dashboard" className="text-primary text-sm hover:underline">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { summary } = stats;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted">RepurposeHub — {summary.monthKey}</p>
            </div>
          </div>
          <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border/60 text-sm font-medium text-foreground hover:bg-surface transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted font-medium">Total Users</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{summary.totalUsers}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm text-muted font-medium">Pro Users</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{summary.proUsers}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm text-muted font-medium">Active This Month</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{summary.activeUsersThisMonth}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-muted font-medium">Generations (Month)</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{summary.totalGenerationsThisMonth}</div>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50">
            <h2 className="text-lg font-bold text-foreground">All Users ({stats.users.length})</h2>
          </div>
          <div className="divide-y divide-border/50">
            {stats.users
              .sort((a, b) => b.generationsThisMonth - a.generationsThisMonth)
              .map((u) => (
              <div key={u.uid}>
                <div
                  className="px-6 py-4 flex items-center justify-between hover:bg-surface/50 cursor-pointer transition-colors"
                  onClick={() => setExpandedUser(expandedUser === u.uid ? null : u.uid)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white text-xs font-bold">
                      {u.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{u.email}</div>
                      <div className="text-xs text-muted">Joined {formatDate(u.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.plan === 'pro' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.plan?.charAt(0).toUpperCase() + u.plan?.slice(1)}
                    </span>
                    <span className="text-sm font-medium text-foreground w-16 text-right">
                      {u.generationsThisMonth} gen
                    </span>
                  </div>
                </div>

                {/* Expanded: recent generations */}
                {expandedUser === u.uid && u.recentGenerations.length > 0 && (
                  <div className="px-6 pb-4 bg-surface/30">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 pt-2">Recent Generations</div>
                    {u.recentGenerations.map((g) => (
                      <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div className="text-xs text-foreground/70 flex-1 truncate mr-4">
                          {g.inputPreview || '(no preview)'}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {g.cost && (
                            <span className="text-xs text-amber-600 font-medium">${g.cost.costUsd.toFixed(4)} · {g.cost.totalTokens} tok</span>
                          )}
                          <span className="text-xs text-muted">{g.platforms.length} platforms</span>
                          <span className="text-xs text-muted">{formatDateTime(g.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
