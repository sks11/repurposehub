import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getVoiceProfiles, saveVoiceProfile, deleteVoiceProfile, getUserProfile } from '@/lib/firebase/firestore';
import { PLAN_LIMITS } from '@/lib/plans';
import { buildVoiceAnalysisPrompt } from '@/lib/prompts';

export async function GET(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profiles = await getVoiceProfiles(authUser.uid);
  return NextResponse.json({ profiles });
}

export async function POST(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, samples } = body as { name: string; samples: string[] };

  if (!name || !samples?.length || samples.length < 3) {
    return NextResponse.json({ error: 'Name and at least 3 sample texts are required' }, { status: 400 });
  }

  // Check profile limit
  const [profiles, profile] = await Promise.all([
    getVoiceProfiles(authUser.uid),
    getUserProfile(authUser.uid),
  ]);

  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan].voiceProfiles;

  if (profiles.length >= limit) {
    return NextResponse.json({
      error: `Your ${plan} plan allows up to ${limit} voice profile(s). Upgrade for more.`,
    }, { status: 403 });
  }

  // Analyze voice using LLM
  const analysisPrompt = buildVoiceAnalysisPrompt(samples);

  try {
    const llmResponse = await fetch(`${process.env.LLM_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert linguistic analyst specializing in writing style analysis.' },
          { role: 'user', content: analysisPrompt },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!llmResponse.ok) {
      return NextResponse.json({ error: 'Voice analysis failed' }, { status: 500 });
    }

    const llmData = await llmResponse.json();
    const analysis = llmData.choices?.[0]?.message?.content || '';

    const profileId = await saveVoiceProfile(authUser.uid, {
      name,
      samples,
      analysis,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ id: profileId, analysis });
  } catch (error) {
    console.error('Voice analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze voice' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
  }

  await deleteVoiceProfile(authUser.uid, id);
  return NextResponse.json({ success: true });
}
