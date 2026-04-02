"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { PLATFORMS } from "@/lib/types";
import { PlatformOutput } from "@/lib/types";
import { Wand2, Copy, Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function DashboardPage() {
  const { getIdToken, refreshUsage, plan } = useAuth();
  const [inputText, setInputText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    PLATFORMS.map((p) => p.id)
  );
  const [voiceProfileId] = useState<string | undefined>(undefined);
  const [outputs, setOutputs] = useState<PlatformOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedPlatforms(PLATFORMS.map((p) => p.id));
  const selectNone = () => setSelectedPlatforms([]);

  const generate = useCallback(async () => {
    if (!inputText.trim()) { setError("Please paste some content to repurpose."); return; }
    if (!selectedPlatforms.length) { setError("Select at least one platform."); return; }

    setError("");
    setLoading(true);
    setOutputs([]);

    try {
      const token = await getIdToken();
      if (!token) { setError("Please sign in again."); return; }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputText, platforms: selectedPlatforms, voiceProfileId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        return;
      }

      setOutputs(data.outputs || []);
      refreshUsage();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, selectedPlatforms, voiceProfileId, getIdToken, refreshUsage]);

  const copyToClipboard = async (platform: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const maxWords = plan === "free" ? 3000 : 10000;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Repurpose Your Content</h1>
        <p className="text-muted mt-2">Paste your text below and generate platform-specific versions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input panel */}
        <div className="space-y-5">
          {/* Text input */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Your Content</label>
              <span className={`text-xs font-medium ${wordCount > maxWords ? "text-red-500" : "text-muted"}`}>
                {wordCount.toLocaleString()} / {maxWords.toLocaleString()} words
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your blog post, newsletter, podcast transcript, or any content you want to repurpose..."
              rows={12}
              className="w-full bg-surface rounded-xl p-4 border border-border text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted/50"
            />
          </div>

          {/* Platform selector */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-foreground">Platforms ({selectedPlatforms.length})</label>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-primary hover:underline font-medium">All</button>
                <span className="text-border">|</span>
                <button onClick={selectNone} className="text-xs text-muted hover:underline font-medium">None</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? "bg-primary/8 text-primary border border-primary/20"
                        : "bg-surface text-muted border border-border/60 hover:border-primary/20"
                    }`}>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate button */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <button onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-base font-semibold hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating {selectedPlatforms.length} versions...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Repurpose to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Generated Content</h2>
            {outputs.length > 0 && (
              <span className="text-xs text-muted">{outputs.length} versions</span>
            )}
          </div>

          {outputs.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-primary/30" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to repurpose</h3>
              <p className="text-sm text-muted">Paste your content on the left and click generate to see platform-specific versions here.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Repurposing your content...</h3>
              <p className="text-sm text-muted">Creating {selectedPlatforms.length} platform-specific versions</p>
            </div>
          )}

          <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            {outputs.map((output) => {
              const platform = PLATFORMS.find((p) => p.id === output.platform);
              const isExpanded = expandedPlatform === output.platform;

              return (
                <div key={output.platform} className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedPlatform(isExpanded ? null : output.platform)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${platform?.badge || ''}`}>
                        {platform?.name || output.platform}
                      </span>
                      <span className="text-xs text-muted">{output.content.length} chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(output.platform, output.content); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          copied === output.platform
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
                        }`}>
                        {copied === output.platform ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border/50">
                      <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans mt-3 bg-surface rounded-xl p-4">
                        {output.content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
