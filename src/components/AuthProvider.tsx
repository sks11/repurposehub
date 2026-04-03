"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/config";
import { PlanType, UsageInfo } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  plan: PlanType;
  usage: UsageInfo | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshPlan: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isFirebaseConfigured());
  const [plan, setPlan] = useState<PlanType>("free");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const debugAuth = process.env.NODE_ENV !== "production";

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  const refreshPlan = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan || "free");
      }
    } catch { /* ignore */ }
  }, [getIdToken]);

  const refreshUsage = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch("/api/usage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch { /* ignore */ }
  }, [getIdToken]);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      if (debugAuth) {
        console.info("[Auth] Firebase client config missing; skipping auth restore");
      }
      return;
    }

    const auth = getFirebaseAuth();
    let isActive = true;

    if (debugAuth) {
      console.info("[Auth] Starting auth restore", {
        currentUser: auth.currentUser?.email ?? null,
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isActive) return;
      if (debugAuth) {
        console.info("[Auth] onAuthStateChanged", {
          user: firebaseUser?.email ?? null,
        });
      }
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        // Sync session & fetch plan
        const token = await firebaseUser.getIdToken();
        try {
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (isActive) {
              setPlan(data.plan || "free");
            }
            if (debugAuth) {
              console.info("[Auth] Session sync complete", {
                plan: data.plan || "free",
              });
            }
          }
        } catch { /* ignore */ }
        // Fetch usage
        try {
          const res = await fetch("/api/usage", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (isActive) {
              setUsage(data);
            }
            if (debugAuth) {
              console.info("[Auth] Usage loaded", {
                generationsCount: data.generationsCount ?? null,
              });
            }
          }
        } catch { /* ignore */ }
      } else {
        setPlan("free");
        setUsage(null);
      }
    });

    auth.authStateReady()
      .then(() => {
        if (!isActive) return;
        if (debugAuth) {
          console.info("[Auth] authStateReady resolved", {
            currentUser: auth.currentUser?.email ?? null,
          });
        }
        setUser(auth.currentUser);
        setLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        if (debugAuth) {
          console.warn("[Auth] authStateReady rejected");
        }
        setLoading(false);
      });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [debugAuth]);

  useEffect(() => {
    if (!debugAuth || typeof window === "undefined") return;

    (window as Window & { __authDebug?: Record<string, unknown> }).__authDebug = {
      loading,
      user: user?.email ?? null,
      plan,
      generationsCount: usage?.generationsCount ?? null,
      href: window.location.href,
      updatedAt: Date.now(),
    };
  }, [debugAuth, loading, plan, usage, user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(getFirebaseAuth(), provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(getFirebaseAuth());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        plan,
        usage,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        getIdToken,
        refreshPlan,
        refreshUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
