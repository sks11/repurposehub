import { getAdminDb } from './admin';
import { FieldValue } from 'firebase-admin/firestore';
import { PlanType, UserProfile, UsageInfo, Generation, VoiceProfile } from '../types';

function db() {
  return getAdminDb();
}

// ---- User operations ----

export async function getOrCreateUser(uid: string, email: string): Promise<UserProfile> {
  const ref = db().collection('users').doc(uid);
  const doc = await ref.get();

  if (doc.exists) {
    return doc.data() as UserProfile;
  }

  const newUser: UserProfile = {
    email,
    plan: 'free',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await ref.set(newUser);
  return newUser;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await db().collection('users').doc(uid).get();
  return doc.exists ? (doc.data() as UserProfile) : null;
}

export async function updateUserPlan(uid: string, plan: PlanType, stripeData?: Record<string, unknown>) {
  await db().collection('users').doc(uid).update({
    plan,
    ...stripeData,
    updatedAt: Date.now(),
  });
}

// ---- Usage operations ----

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function getUsage(uid: string): Promise<UsageInfo> {
  const monthKey = getMonthKey();
  const ref = db().collection('users').doc(uid).collection('usage').doc(monthKey);
  const doc = await ref.get();

  if (!doc.exists) {
    return { generationsCount: 0, monthKey, lastUpdated: Date.now() };
  }

  return { ...doc.data(), monthKey } as UsageInfo;
}

export async function incrementUsage(uid: string): Promise<void> {
  const monthKey = getMonthKey();
  const ref = db().collection('users').doc(uid).collection('usage').doc(monthKey);

  await ref.set(
    {
      generationsCount: FieldValue.increment(1),
      lastUpdated: Date.now(),
    },
    { merge: true }
  );
}

// ---- Generation history ----

export async function saveGeneration(gen: Omit<Generation, 'id'>): Promise<string> {
  const ref = await db().collection('users').doc(gen.userId).collection('generations').add(gen);
  return ref.id;
}

export async function getGenerations(uid: string, limit = 20, offset = 0): Promise<Generation[]> {
  const snapshot = await db()
    .collection('users')
    .doc(uid)
    .collection('generations')
    .orderBy('createdAt', 'desc')
    .offset(offset)
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Generation);
}

export async function getGeneration(uid: string, genId: string): Promise<Generation | null> {
  const doc = await db().collection('users').doc(uid).collection('generations').doc(genId).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Generation) : null;
}

// ---- Voice profiles ----

export async function saveVoiceProfile(uid: string, profile: Omit<VoiceProfile, 'id'>): Promise<string> {
  const ref = await db().collection('users').doc(uid).collection('voiceProfiles').add(profile);
  return ref.id;
}

export async function getVoiceProfiles(uid: string): Promise<VoiceProfile[]> {
  const snapshot = await db()
    .collection('users')
    .doc(uid)
    .collection('voiceProfiles')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as VoiceProfile);
}

export async function getVoiceProfile(uid: string, profileId: string): Promise<VoiceProfile | null> {
  const doc = await db().collection('users').doc(uid).collection('voiceProfiles').doc(profileId).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as VoiceProfile) : null;
}

export async function deleteVoiceProfile(uid: string, profileId: string): Promise<void> {
  await db().collection('users').doc(uid).collection('voiceProfiles').doc(profileId).delete();
}
