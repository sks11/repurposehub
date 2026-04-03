"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Zap, CheckCircle, Loader2 } from "lucide-react";

export default function ExtensionCallbackPage() {
  const { user, getIdToken, plan, usage } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!user) return;

    const sendTokenToExtension = async () => {
      try {
        const token = await getIdToken();
        if (!token) {
          setStatus("error");
          return;
        }

        // Post message that the content script or extension can listen for
        window.postMessage(
          {
            type: "REPURPOSEHUB_AUTH",
            authToken: token,
            userEmail: user.email,
            userPlan: plan,
            usageCount: usage?.generationsCount || 0,
            usageLimit: plan === "free" ? 30 : -1,
          },
          "*"
        );

        setStatus("success");

        // Auto-close after a moment
        setTimeout(() => window.close(), 2000);
      } catch {
        setStatus("error");
      }
    };

    sendTokenToExtension();
  }, [user, getIdToken, plan, usage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            Repurpose<span className="gradient-text">Hub</span>
          </span>
        </div>

        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-muted">Connecting to extension...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
            <p className="text-foreground font-medium">Connected! You can close this tab.</p>
            <p className="text-muted text-sm">The extension is now signed in.</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <p className="text-red-600 font-medium">Failed to connect. Please sign in first.</p>
            <a href="/auth/signin" className="text-primary hover:underline text-sm">Go to Sign In</a>
          </div>
        )}
      </div>
    </div>
  );
}
