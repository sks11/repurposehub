import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getUserProfile } from '@/lib/firebase/firestore';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { planType } = body as { planType: 'pro' | 'agency' };

  const priceId = planType === 'agency'
    ? process.env.STRIPE_AGENCY_PRICE_ID
    : process.env.STRIPE_PRO_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
  }

  const profile = await getUserProfile(authUser.uid);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const sessionParams: Record<string, unknown> = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/dashboard/settings`,
    metadata: { userId: authUser.uid, planType },
  };

  if (profile?.stripeCustomerId) {
    sessionParams.customer = profile.stripeCustomerId;
  } else {
    sessionParams.customer_email = authUser.email;
  }

  const s = getStripe();
  const session = await s.checkout.sessions.create(sessionParams as Parameters<typeof s.checkout.sessions.create>[0]);

  return NextResponse.json({ url: session.url });
}
