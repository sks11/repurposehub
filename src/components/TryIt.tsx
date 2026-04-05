"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Copy, Check, AlertCircle, ChevronDown, ChevronUp, Link, Type } from "lucide-react";
import { PLATFORMS } from "@/lib/types";

const MAX_PLATFORMS = 3;

export default function TryIt() {
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<{ platform: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [hasTriedOnce, setHasTriedOnce] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_PLATFORMS) return prev;
      return [...prev, id];
    });
  };

  const formatContent = (content: string | Record<string, unknown>): string => {
    if (typeof content === "string") return content;
    return Object.entries(content)
      .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(val) ? val.join(", ") : val}`)
      .join("\n\n");
  };

  const generate = async () => {
    if (inputMode === "text" && !inputText.trim()) { setError("Paste some content to repurpose."); return; }
    if (inputMode === "url" && !inputUrl.trim()) { setError("Enter a URL to repurpose."); return; }
    if (inputMode === "url" && !/^https?:\/\/.+/.test(inputUrl.trim())) { setError("Enter a valid URL starting with http:// or https://"); return; }
    if (!selectedPlatforms.length) { setError("Select at least one platform."); return; }

    // Redirect to signup — don't generate without auth
    window.location.href = "/auth/signup";
    return;

    setError("");
    setLoading(true);
    setOutputs([]);

    try {
      const payload = inputMode === "url"
        ? { url: inputUrl.trim(), platforms: selectedPlatforms }
        : { inputText: inputText.slice(0, 2000), platforms: selectedPlatforms };

      const res = await fetch("/api/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }

      setOutputs(data.outputs || []);
      setHasTriedOnce(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (platform: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="try" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Try It Now</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">
            See it in <span className="gradient-text">action</span>
          </h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            Paste text or a URL, pick up to 3 platforms, and see the magic. No sign-up required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input side */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                  <button onClick={() => setInputMode("text")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === "text" ? "bg-white text-primary shadow-sm border border-primary/20" : "text-muted hover:text-foreground"
                    }`}>
                    <Type className="w-3.5 h-3.5" /> Text
                  </button>
                  <button onClick={() => setInputMode("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === "url" ? "bg-white text-primary shadow-sm border border-primary/20" : "text-muted hover:text-foreground"
                    }`}>
                    <Link className="w-3.5 h-3.5" /> URL
                  </button>
                </div>
                {inputMode === "text" && <span className="text-xs text-muted">{inputText.length} / 2,000</span>}
              </div>
              {inputMode === "text" ? (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.slice(0, 2000))}
                  placeholder="Paste a blog paragraph, tweet, or any text you want to repurpose..."
                  rows={8}
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
                  <p className="text-xs text-muted">We&apos;ll extract the article content and repurpose it.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Pick up to 3 platforms</label>
                <span className="text-xs text-muted">{selectedPlatforms.length} / {MAX_PLATFORMS}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const selected = selectedPlatforms.includes(p.id);
                  const disabled = !selected && selectedPlatforms.length >= MAX_PLATFORMS;
                  return (
                    <button key={p.id} onClick={() => togglePlatform(p.id)} disabled={disabled}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        selected
                          ? "bg-primary/8 text-primary border border-primary/20"
                          : disabled
                          ? "bg-surface text-muted/40 border border-border/30 cursor-not-allowed"
                          : "bg-surface text-muted border border-border/60 hover:border-primary/20"
                      }`}>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

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
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Sign Up &amp; Repurpose{selectedPlatforms.length > 0 ? ` to ${selectedPlatforms.length} Platform${selectedPlatforms.length > 1 ? 's' : ''}` : ''}
                </>
              )}
            </button>
          </motion.div>

          {/* Output side */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Generated Content</h3>

            {outputs.length === 0 && !loading && (
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-primary/30" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Ready to repurpose</h4>
                <p className="text-sm text-muted">Paste your content, pick platforms, and click generate.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
                <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Repurposing...</h4>
                <p className="text-sm text-muted">Creating {selectedPlatforms.length} platform versions</p>
              </div>
            )}

            <div className="space-y-3">
              {outputs.map((output) => {
                const platform = PLATFORMS.find((p) => p.id === output.platform);
                const isExpanded = expandedPlatform === output.platform;
                return (
                  <div key={output.platform} className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                    <div
                      onClick={() => setExpandedPlatform(isExpanded ? null : output.platform)}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-colors cursor-pointer"
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

            {/* CTA after first try */}
            {hasTriedOnce && outputs.length > 0 && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6 text-center">
                <p className="text-sm text-foreground font-medium mb-3">
                  Want all 12 platforms, Brand Voice, URL import, and more?
                </p>
                <a href="/auth/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
                  Sign Up Free — No Credit Card
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
