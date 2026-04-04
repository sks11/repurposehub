export type PlanType = 'free' | 'pro' | 'agency';

export interface UsageInfo {
  generationsCount: number;
  monthKey: string;
  lastUpdated: number;
}

export interface UserProfile {
  email: string;
  plan: PlanType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  subscriptionCurrentPeriodEnd?: number;
  createdAt: number;
  updatedAt: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  samples: string[];
  analysis: string;
  createdAt: number;
  updatedAt: number;
}

export interface Generation {
  id: string;
  userId: string;
  inputText: string;
  platforms: string[];
  outputs: PlatformOutput[];
  voiceProfileId?: string;
  cost?: { model: string; inputTokens: number; outputTokens: number; totalTokens: number; costUsd: number };
  createdAt: number;
}

export interface PlatformOutput {
  platform: string;
  content: string;
}

export const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', badge: 'badge-facebook' },
  { id: 'instagram', name: 'Instagram', badge: 'badge-instagram' },
  { id: 'youtube', name: 'YouTube', badge: 'badge-youtube' },
  { id: 'twitter', name: 'Twitter / X', badge: 'badge-twitter' },
  { id: 'tiktok', name: 'TikTok', badge: 'badge-tiktok' },
  { id: 'linkedin', name: 'LinkedIn', badge: 'badge-linkedin' },
  { id: 'reddit', name: 'Reddit', badge: 'badge-reddit' },
  { id: 'threads', name: 'Threads', badge: 'badge-threads' },
  { id: 'telegram', name: 'Telegram', badge: 'badge-telegram' },
  { id: 'email', name: 'Email', badge: 'badge-email' },
  { id: 'medium', name: 'Medium', badge: 'badge-medium' },
  { id: 'substack', name: 'Substack', badge: 'badge-substack' },
] as const;
