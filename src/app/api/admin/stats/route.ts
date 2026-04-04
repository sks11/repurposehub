import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getAdminDb } from '@/lib/firebase/admin';

// Add your admin email(s) here
const ADMIN_EMAILS = ['shravanksinghdce@gmail.com', 'nomi137@gmail.com'];

export async function GET(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser || !ADMIN_EMAILS.includes(authUser.email || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getAdminDb();

  // Get all users
  const usersSnap = await db.collection('users').get();
  const users = usersSnap.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  }));

  // Get usage for current month
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const usagePromises = users.map(async (user) => {
    const usageDoc = await db.collection('users').doc(user.uid).collection('usage').doc(monthKey).get();
    const generationsSnap = await db.collection('users').doc(user.uid).collection('generations')
      .orderBy('createdAt', 'desc').limit(5).get();

    return {
      ...user,
      currentMonthUsage: usageDoc.exists ? usageDoc.data() : { generationsCount: 0 },
      recentGenerations: generationsSnap.docs.map(d => ({
        id: d.id,
        platforms: d.data().platforms,
        createdAt: d.data().createdAt,
        inputPreview: (d.data().inputText || '').slice(0, 100),
      })),
    };
  });

  const usersWithUsage = await Promise.all(usagePromises);

  // Summary stats
  const totalUsers = users.length;
  const proUsers = users.filter((u: Record<string, unknown>) => u.plan === 'pro').length;
  const totalGenerationsThisMonth = usersWithUsage.reduce(
    (sum, u) => sum + ((u.currentMonthUsage as Record<string, number>)?.generationsCount || 0), 0
  );
  const activeUsersThisMonth = usersWithUsage.filter(
    u => ((u.currentMonthUsage as Record<string, number>)?.generationsCount || 0) > 0
  ).length;

  return NextResponse.json({
    summary: {
      totalUsers,
      proUsers,
      freeUsers: totalUsers - proUsers,
      activeUsersThisMonth,
      totalGenerationsThisMonth,
      monthKey,
    },
    users: usersWithUsage.map(u => ({
      uid: u.uid,
      email: (u as Record<string, unknown>).email,
      plan: (u as Record<string, unknown>).plan,
      createdAt: (u as Record<string, unknown>).createdAt,
      generationsThisMonth: ((u.currentMonthUsage as Record<string, number>)?.generationsCount || 0),
      recentGenerations: u.recentGenerations,
    })),
  });
}
