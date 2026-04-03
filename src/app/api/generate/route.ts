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
  const { platforms, voiceProfileId, url } = body as {
    inputText?: string;
    platforms: string[];
    voiceProfileId?: string;
    url?: string;
  };
  let { inputText } = body as { inputText?: string };

  if (!platforms?.length) {
    return NextResponse.json({ error: 'platforms are required' }, { status: 400 });
  }

  // Fetch content from URL if provided
  if (url && !inputText) {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return NextResponse.json({ error: 'Only HTTP/HTTPS URLs are supported' }, { status: 400 });
      }
      const pageRes = await fetch(url, {
        headers: { 'User-Agent': 'RepurposeHub/1.0' },
        signal: AbortSignal.timeout(15000),
      });
      if (!pageRes.ok) {
        return NextResponse.json({ error: `Failed to fetch URL (${pageRes.status})` }, { status: 400 });
      }
      const html = await pageRes.text();
      // Extract text content from HTML — strip tags, scripts, styles
      inputText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 50000);
    } catch (e) {
      const message = e instanceof Error && e.name === 'TimeoutError'
        ? 'URL took too long to respond'
        : 'Failed to fetch content from URL';
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!inputText) {
    return NextResponse.json({ error: 'inputText or url is required' }, { status: 400 });
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

    // Calculate cost from token usage
    const usage = llmData.usage;
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    // Pricing per 1M tokens (USD)
    const PRICING: Record<string, { input: number; output: number }> = {
      'gpt-4o-mini': { input: 0.15, output: 0.60 },
      'gpt-4o': { input: 2.50, output: 10.00 },
      'gpt-4': { input: 30.00, output: 60.00 },
      'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    };
    const pricing = PRICING[model] || PRICING['gpt-4o-mini'];
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;
    const totalTokens = usage?.total_tokens || 0;
    const costUsd = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

    console.log(`[Cost] model=${model} input=${inputTokens} output=${outputTokens} total=${totalTokens} cost=$${costUsd.toFixed(6)} platforms=${platforms.length} user=${authUser.uid}`);

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
        ...(voiceProfileId ? { voiceProfileId } : {}),
        createdAt: Date.now(),
      }),
      incrementUsage(authUser.uid),
    ]);

    return NextResponse.json({
      id: genId,
      outputs,
      cost: {
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        costUsd: Math.round(costUsd * 1_000_000) / 1_000_000, // 6 decimal places
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
