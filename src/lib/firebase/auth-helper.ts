import { NextRequest } from 'next/server';
import { getAdminAuth } from './admin';

export async function verifyAuth(request: NextRequest): Promise<{ uid: string; email: string } | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split('Bearer ')[1];
    if (!token) return null;

    const decoded = await getAdminAuth().verifyIdToken(token, true);
    return { uid: decoded.uid, email: decoded.email || '' };
  } catch {
    return null;
  }
}
