import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getGenerations, getGeneration } from '@/lib/firebase/firestore';

export async function GET(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const gen = await getGeneration(authUser.uid, id);
    if (!gen) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(gen);
  }

  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const generations = await getGenerations(authUser.uid, limit, offset);
  return NextResponse.json({ generations });
}
