import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getOrCreateUser } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getOrCreateUser(authUser.uid, authUser.email);

  return NextResponse.json({
    plan: user.plan,
    email: user.email,
  });
}
