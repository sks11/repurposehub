import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { buildSystemPrompt, buildGenerationPrompt } from '@/lib/prompts';
import { PlatformOutput } from '@/lib/types';

// Stricter rate limit for public: 2 requests per IP per hour
const tryLimits = new Map<string, { count: number; resetAt: number }>();

function checkTryLimit(ip: string): boolean {
  const now = Date.now();
  const entry = tryLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    tryLimits.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 2) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  if (!checkTryLimit(ip)) {
    return NextResponse.json({ error: 'Free trial limit reached. Sign up for more!' }, { status: 403 });
  }

  const body = await request.json();
  const { inputText, platforms } = body as { inputText: string; platforms: string[] };

  if (!inputText?.trim() || !platforms?.length) {
    return NextResponse.json({ error: 'Text and at least one platform required' }, { status: 400 });
  }

  if (inputText.length > 2000) {
    return NextResponse.json({ error: 'Free trial limited to 2,000 characters. Sign up for more!' }, { status: 400 });
  }

  if (platforms.length > 3) {
    return NextResponse.json({ error: 'Free trial limited to 3 platforms. Sign up for all 12!' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt();
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
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmResponse.ok) {
      return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
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

    return NextResponse.json({ outputs });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
