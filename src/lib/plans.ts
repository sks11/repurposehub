import { PlanType } from './types';

export interface PlanLimits {
  generationsPerMonth: number;
  voiceProfiles: number;
  historyDays: number;
  maxInputWords: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    generationsPerMonth: 30,
    voiceProfiles: 1,
    historyDays: 7,
    maxInputWords: 3000,
  },
  pro: {
    generationsPerMonth: 1000,
    voiceProfiles: 3,
    historyDays: 90,
    maxInputWords: 10000,
  },
  agency: {
    generationsPerMonth: -1, // unlimited
    voiceProfiles: 10,
    historyDays: 365,
    maxInputWords: 10000,
  },
};

export function canGenerate(plan: PlanType, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].generationsPerMonth;
  if (limit === -1) return true;
  return currentCount < limit;
}
