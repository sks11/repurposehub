"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Generation, PLATFORMS } from "@/lib/types";
import { History, Copy, Check, ChevronDown, ChevronUp, Search } from "lucide-react";

export default function HistoryPage() {
  const { getIdToken } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch("/api/history?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGenerations(data.generations || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const copyToClipboard = async (key: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = generations.filter((g) =>
    !search || g.inputText.toLowerCase().includes(search.toLowerCase())
  );

  const formatContent = (content: string | Record<string, unknown>): string => {
    if (typeof content === 'string') return content;
    return Object.entries(content)
      .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(val) ? val.join(', ') : val}`)
      .join('\n\n');
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generation History</h1>
          <p className="text-muted mt-2">View and re-copy your previous generations.</p>
        </div>
        <span className="text-sm text-muted">{generations.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by content..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted/50 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-primary/30" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {search ? "No results found" : "No generations yet"}
          </h3>
          <p className="text-sm text-muted">
            {search ? "Try a different search term." : "Go to the Generate tab to create your first content."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((gen) => (
            <div key={gen.id} className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm text-foreground font-medium truncate">
                    {gen.inputText.slice(0, 120)}...
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted">{formatDate(gen.createdAt)}</span>
                    <span className="text-xs text-primary font-medium">{gen.outputs.length} platforms</span>
                  </div>
                </div>
                {expanded === gen.id ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
              </button>

              {expanded === gen.id && (
                <div className="border-t border-border/50 p-5 space-y-3">
                  {/* Original text */}
                  <div className="bg-surface rounded-xl p-4 mb-4">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">Original Input</span>
                    <p className="text-sm text-foreground/80 mt-2 leading-relaxed whitespace-pre-wrap">{gen.inputText}</p>
                  </div>

                  {/* Outputs */}
                  {gen.outputs.map((output) => {
                    const platform = PLATFORMS.find((p) => p.id === output.platform);
                    const copyKey = `${gen.id}-${output.platform}`;
                    return (
                      <div key={output.platform} className="bg-surface rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${platform?.badge || ''}`}>
                            {platform?.name || output.platform}
                          </span>
                          <button
                            onClick={() => copyToClipboard(copyKey, formatContent(output.content))}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              copied === copyKey ? "bg-green-50 text-green-600" : "bg-primary/5 text-primary hover:bg-primary/10"
                            }`}>
                            {copied === copyKey ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                        <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">{formatContent(output.content)}</pre>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
