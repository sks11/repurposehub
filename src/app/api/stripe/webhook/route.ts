import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { updateUserPlan } from '@/lib/firebase/firestore';
import { PlanType } from '@/lib/types';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planType = (session.metadata?.planType || 'pro') as PlanType;

      if (userId) {
        await updateUserPlan(userId, planType, {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
        });
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      const subscriptionId = (invoice as unknown as Record<string, unknown>).subscription as string;
      if (subscriptionId) {
        const subResponse = await getStripe().subscriptions.retrieve(subscriptionId);
        const subData = subResponse as unknown as { metadata: Record<string, string>; current_period_end: number };
        const userId = subData.metadata?.userId;
        if (userId) {
          await updateUserPlan(userId, (subData.metadata?.planType || 'pro') as PlanType, {
            subscriptionStatus: 'active',
            subscriptionCurrentPeriodEnd: subData.current_period_end * 1000,
          });
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subObj = event.data.object as unknown as { metadata: Record<string, string> };
      const userId = subObj.metadata?.userId;
      if (userId) {
        await updateUserPlan(userId, 'free', {
          subscriptionStatus: 'canceled',
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
