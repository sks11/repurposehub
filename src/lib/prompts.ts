export function buildSystemPrompt(voiceAnalysis?: string): string {
  let prompt = `You are RepurposeHub, an expert content repurposing engine. Your job is to take a single piece of text and adapt it for multiple social media platforms.

RULES:
1. Each platform version MUST be genuinely different — adapted to that platform's culture, format, and audience expectations.
2. Maintain the core message and key points, but transform the delivery.
3. Use platform-native formatting (threads for Twitter, hashtags for Instagram, etc.).
4. Never start with generic intros like "Hey everyone" unless it's platform-appropriate.
5. Make each version feel like it was natively written for that platform by someone who deeply understands it.
6. Include appropriate CTAs, hashtags, and formatting for each platform.
7. Output ONLY valid JSON — no markdown, no explanation, no commentary.`;

  if (voiceAnalysis) {
    prompt += `

BRAND VOICE INSTRUCTIONS:
The user has a specific writing voice. Here is the analysis of their style:
${voiceAnalysis}

You MUST match this voice in every output. Maintain their characteristic phrases, tone, formality level, and personality markers while adapting format for each platform.`;
  }

  return prompt;
}

export function buildGenerationPrompt(inputText: string, platforms: string[]): string {
  return `Take the following text and create adapted versions for each of these platforms: ${platforms.join(', ')}.

INPUT TEXT:
"""
${inputText}
"""

Return a JSON object with this exact structure:
{
  "outputs": [
    {
      "platform": "platform_id",
      "content": "the adapted content for this platform"
    }
  ]
}

Platform IDs to use: ${platforms.join(', ')}

CRITICAL: The "content" field for EVERY platform MUST be a plain text string. NEVER return nested objects, arrays, or JSON inside the content field. All formatting should be done with plain text, line breaks, and labels.

IMPORTANT:
- For Twitter: MUST be under 280 characters total including hashtags and emojis. If the content is too long for one tweet, create a thread with numbered tweets (1/3, 2/3, 3/3) each under 280 chars, separated by line breaks
- For LinkedIn: Professional tone, include relevant hashtags, data-driven
- For Instagram: Write a ready-to-paste caption (NOT carousel slides). Use line breaks for readability, emojis sparingly, a strong hook in the first line, key points as short punchy lines, end with a CTA and 5-15 relevant hashtags
- For YouTube: SEO-optimized title, a keyword-rich description (2-3 paragraphs with a hook in the first line), a "Key Topics" section listing what the video covers, relevant tags, and a short video script outline with talking points. Do NOT generate fake timestamps — there is no video yet
- For Email: Subject line + body + CTA as plain text with labels
- For Telegram: 5-block structure (hook, story, data, tips, CTA)
- For Reddit: Authentic discussion style, no promotional feel
- For Medium: Article-length with headers and narrative
- For TikTok: Short-form script with hook, quick points, CTA
- For Substack: Newsletter format, personal and subscriber-intimate
- For Threads: Casual, conversational, bite-sized
- For Pinterest: Plain text with labeled sections — Title, Description, Suggested Board, and Tags on separate lines`;
}

export function buildVoiceAnalysisPrompt(samples: string[]): string {
  return `Analyze the following writing samples and create a detailed voice profile. Identify:

1. **Tone**: formal/informal, serious/playful, etc.
2. **Vocabulary**: common phrases, jargon level, word preferences
3. **Sentence structure**: short/long, simple/complex, rhythm
4. **Personality markers**: humor style, use of metaphors, rhetorical devices
5. **Formatting preferences**: use of bullet points, emojis, caps, etc.
6. **Distinctive patterns**: catchphrases, opening/closing styles

SAMPLES:
${samples.map((s, i) => `--- Sample ${i + 1} ---\n${s}\n`).join('\n')}

Return a concise but thorough voice profile description (200-300 words) that can be used as instructions for an AI to replicate this writing style. Focus on actionable characteristics.`;
}
