import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getUsage, getUserProfile } from '@/lib/firebase/firestore';
import { PLAN_LIMITS } from '@/lib/plans';

export async function GET(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [usage, profile] = await Promise.all([
    getUsage(authUser.uid),
    getUserProfile(authUser.uid),
  ]);

  const plan = profile?.plan || 'free';
  const limits = PLAN_LIMITS[plan];

  return NextResponse.json({
    ...usage,
    limit: limits.generationsPerMonth,
    plan,
  });
}
