"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { VoiceProfile } from "@/lib/types";
import { PLAN_LIMITS } from "@/lib/plans";
import { Mic, Plus, Trash2, AlertCircle, Check } from "lucide-react";

export default function VoicePage() {
  const { getIdToken, plan } = useAuth();
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [samples, setSamples] = useState(["", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfiles = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch("/api/voice", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const filledSamples = samples.filter((s) => s.trim().length > 50);
    if (!name.trim()) { setError("Please enter a profile name."); return; }
    if (filledSamples.length < 3) { setError("Please provide at least 3 samples (each 50+ characters)."); return; }

    setCreating(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), samples: filledSamples }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setSuccess("Voice profile created! AI has analyzed your writing style.");
      setShowForm(false);
      setName(""); setSamples(["", "", ""]);
      fetchProfiles();
    } catch { setError("Failed to create profile."); }
    finally { setCreating(false); }
  };

  const deleteProfile = async (id: string) => {
    if (!confirm("Delete this voice profile?")) return;
    const token = await getIdToken();
    await fetch(`/api/voice?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchProfiles();
  };

  const maxProfiles = PLAN_LIMITS[plan].voiceProfiles;
  const canCreate = profiles.length < maxProfiles;

  const addSample = () => setSamples([...samples, ""]);
  const updateSample = (i: number, val: string) => {
    const updated = [...samples];
    updated[i] = val;
    setSamples(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brand Voice</h1>
          <p className="text-muted mt-2">Teach AI your writing style so every output sounds like you.</p>
        </div>
        {!showForm && canCreate && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Plus className="w-4 h-4" /> New Profile
          </button>
        )}
      </div>

      {error && <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-6"><AlertCircle className="w-4 h-4" />{error}</div>}
      {success && <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 mb-6"><Check className="w-4 h-4" />{success}</div>}

      {/* Create form */}
      {showForm && (
        <form onSubmit={createProfile} className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 mb-8 space-y-5">
          <h3 className="text-lg font-bold text-foreground">Create Voice Profile</h3>
          <p className="text-sm text-muted">Upload 3-5 samples of your best writing. The AI will analyze your tone, vocabulary, and style.</p>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Profile Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My Personal Brand"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {samples.map((sample, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Sample {i + 1} {i < 3 && <span className="text-red-400">*</span>}
              </label>
              <textarea value={sample} onChange={(e) => updateSample(i, e.target.value)} rows={4}
                placeholder="Paste a piece of your writing (social post, newsletter excerpt, etc.)..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              <span className="text-xs text-muted mt-1 block">{sample.length} characters {sample.length > 0 && sample.length < 50 ? "(need 50+)" : ""}</span>
            </div>
          ))}

          {samples.length < 5 && (
            <button type="button" onClick={addSample} className="text-sm text-primary font-medium hover:underline">+ Add another sample</button>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={creating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {creating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : "Create Profile"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(""); }}
              className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Profiles list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : profiles.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-primary/30" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No voice profiles yet</h3>
          <p className="text-sm text-muted mb-6">Create a voice profile so your generated content sounds like you, not a template.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold">
            <Plus className="w-4 h-4" /> Create Your First Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{profile.name}</h3>
                    <span className="text-xs text-muted">{profile.samples.length} samples &middot; Created {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => deleteProfile(profile.id)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-surface rounded-xl p-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">AI Voice Analysis</span>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{profile.analysis}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted text-center">
            {profiles.length} / {maxProfiles} profiles used ({plan} plan)
          </p>
        </div>
      )}
    </div>
  );
}
