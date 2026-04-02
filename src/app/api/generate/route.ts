import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/auth-helper';
import { getUsage, getUserProfile, incrementUsage, saveGeneration } from '@/lib/firebase/firestore';
import { getVoiceProfile } from '@/lib/firebase/firestore';
import { canGenerate } from '@/lib/plans';
import { checkRateLimit } from '@/lib/rate-limit';
import { buildSystemPrompt, buildGenerationPrompt } from '@/lib/prompts';
import { PlatformOutput } from '@/lib/types';

export async function POST(request: NextRequest) {
  // Auth
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  // Parse body
  const body = await request.json();
  const { inputText, platforms, voiceProfileId } = body as {
    inputText: string;
    platforms: string[];
    voiceProfileId?: string;
  };

  if (!inputText || !platforms?.length) {
    return NextResponse.json({ error: 'inputText and platforms are required' }, { status: 400 });
  }

  if (inputText.length > 50000) {
    return NextResponse.json({ error: 'Input text too long' }, { status: 400 });
  }

  // Check quota
  const [profile, usage] = await Promise.all([
    getUserProfile(authUser.uid),
    getUsage(authUser.uid),
  ]);

  const plan = profile?.plan || 'free';
  if (!canGenerate(plan, usage.generationsCount)) {
    return NextResponse.json({
      error: 'Monthly generation limit reached. Upgrade your plan for unlimited generations.',
    }, { status: 403 });
  }

  // Get voice profile if specified
  let voiceAnalysis: string | undefined;
  if (voiceProfileId) {
    const vp = await getVoiceProfile(authUser.uid, voiceProfileId);
    if (vp) voiceAnalysis = vp.analysis;
  }

  // Call LLM
  const systemPrompt = buildSystemPrompt(voiceAnalysis);
  const userPrompt = buildGenerationPrompt(inputText, platforms);

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error('LLM error:', errorText);
      return NextResponse.json({ error: 'Content generation failed. Please try again.' }, { status: 500 });
    }

    const llmData = await llmResponse.json();
    const content = llmData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    let outputs: PlatformOutput[];
    try {
      const parsed = JSON.parse(content);
      outputs = parsed.outputs || [];
    } catch {
      return NextResponse.json({ error: 'Failed to parse generated content' }, { status: 500 });
    }

    // Save generation and increment usage
    const [genId] = await Promise.all([
      saveGeneration({
        userId: authUser.uid,
        inputText,
        platforms,
        outputs,
        voiceProfileId,
        createdAt: Date.now(),
      }),
      incrementUsage(authUser.uid),
    ]);

    return NextResponse.json({
      id: genId,
      outputs,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
