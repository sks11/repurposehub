"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { PLATFORMS } from "@/lib/types";
import { PlatformOutput } from "@/lib/types";
import { Wand2, Copy, Check, AlertCircle, ChevronDown, ChevronUp, Link, Type, ClipboardList, MessageSquare, Save } from "lucide-react";

export default function DashboardPage() {
  const { getIdToken, refreshUsage, plan } = useAuth();
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [inputText, setInputText] = useState("");

  // Pre-fill from query param (e.g. from Chrome extension)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const text = params.get("text");
    if (text) {
      setInputText(text);
      setInputMode("text");
    }
  }, []);

  const [inputUrl, setInputUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // Load custom instructions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("repurposehub_custom_instructions");
      if (saved) setCustomInstructions(saved);
    } catch { /* ignore */ }
  }, []);
  const [outputs, setOutputs] = useState<PlatformOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedPlatforms(PLATFORMS.map((p) => p.id));
  const selectNone = () => setSelectedPlatforms([]);

  const generate = useCallback(async () => {
    if (inputMode === "text" && !inputText.trim()) { setError("Please paste some content to repurpose."); return; }
    if (inputMode === "url" && !inputUrl.trim()) { setError("Please enter a URL to repurpose."); return; }
    if (inputMode === "url" && !/^https?:\/\/.+/.test(inputUrl.trim())) { setError("Please enter a valid URL starting with http:// or https://"); return; }
    if (!selectedPlatforms.length) { setError("Select at least one platform."); return; }

    setError("");
    setLoading(true);
    setOutputs([]);

    try {
      const token = await getIdToken();
      if (!token) { setError("Please sign in again."); return; }

      const payload = inputMode === "url"
        ? { url: inputUrl.trim(), platforms: selectedPlatforms, customInstructions: customInstructions.trim() || undefined }
        : { inputText, platforms: selectedPlatforms, customInstructions: customInstructions.trim() || undefined };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        return;
      }

      setOutputs(data.outputs || []);
      // cost data available in data.cost (visible in server logs)
      refreshUsage();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, inputUrl, inputMode, selectedPlatforms, customInstructions, getIdToken, refreshUsage]);

  const copyToClipboard = async (platform: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const allContent = outputs
      .map((output) => {
        const platform = PLATFORMS.find((p) => p.id === output.platform);
        return `--- ${platform?.name || output.platform} ---\n${formatContent(output.content)}`;
      })
      .join('\n\n');
    await navigator.clipboard.writeText(allContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const formatContent = (content: string | Record<string, unknown>): string => {
    if (typeof content === 'string') return content;
    return Object.entries(content)
      .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(val) ? val.join(', ') : val}`)
      .join('\n\n');
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
          {/* Input mode toggle + input */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    inputMode === "text"
                      ? "bg-white text-primary shadow-sm border border-primary/20"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text
                </button>
                <button
                  onClick={() => setInputMode("url")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    inputMode === "url"
                      ? "bg-white text-primary shadow-sm border border-primary/20"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Link className="w-3.5 h-3.5" /> URL
                </button>
              </div>
              {inputMode === "text" && (
                <span className={`text-xs font-medium ${wordCount > maxWords ? "text-red-500" : "text-muted"}`}>
                  {wordCount.toLocaleString()} / {maxWords.toLocaleString()} words
                </span>
              )}
            </div>
            {inputMode === "text" ? (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your blog post, newsletter, podcast transcript, or any content you want to repurpose..."
                rows={12}
                className="w-full bg-surface rounded-xl p-4 border border-border text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted/50"
              />
            ) : (
              <div className="space-y-3">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/blog/your-article"
                  className="w-full bg-surface rounded-xl p-4 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted/50"
                />
                <p className="text-xs text-muted">We&apos;ll extract the article content from this URL and repurpose it across your selected platforms.</p>
              </div>
            )}
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

          {/* Custom instructions */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <label className="text-sm font-semibold text-foreground">Custom Instructions</label>
                <span className="text-xs text-muted">(optional)</span>
              </div>
              <button
                onClick={() => {
                  try {
                    localStorage.setItem("repurposehub_custom_instructions", customInstructions);
                    setInstructionsSaved(true);
                    setTimeout(() => setInstructionsSaved(false), 2000);
                  } catch { /* ignore */ }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  instructionsSaved
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
                }`}
              >
                {instructionsSaved ? <><Check className="w-3 h-3" /> Saved</> : <><Save className="w-3 h-3" /> Save</>}
              </button>
            </div>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Write in casual tone, target startup founders, always include a CTA, use short sentences..."
              rows={3}
              className="w-full bg-surface rounded-xl p-3 border border-border text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted/50"
            />
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
            <div className="flex items-center gap-3">
              {outputs.length > 0 && (
                <>
                  <button
                    onClick={copyAll}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copiedAll
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
                    }`}
                  >
                    {copiedAll ? <><Check className="w-3 h-3" /> Copied All!</> : <><ClipboardList className="w-3 h-3" /> Copy All</>}
                  </button>
                  <span className="text-xs text-muted">{outputs.length} versions</span>
                </>
              )}
            </div>
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
                  <div
                    onClick={() => setExpandedPlatform(isExpanded ? null : output.platform)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedPlatform(isExpanded ? null : output.platform); }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${platform?.badge || ''}`}>
                        {platform?.name || output.platform}
                      </span>
                      <span className="text-xs text-muted">{formatContent(output.content).length} chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(output.platform, formatContent(output.content)); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          copied === output.platform
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
                        }`}>
                        {copied === output.platform ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border/50">
                      <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans mt-3 bg-surface rounded-xl p-4">
                        {formatContent(output.content)}
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
