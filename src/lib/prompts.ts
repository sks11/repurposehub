export function buildSystemPrompt(customInstructions?: string): string {
  let prompt = `You are RepurposeHub, an expert content repurposing engine. Your job is to take a single piece of text and adapt it for multiple social media platforms.

RULES:
1. Each platform version MUST be genuinely different — adapted to that platform's culture, format, and audience expectations.
2. Maintain the core message and key points, but transform the delivery.
3. Use platform-native formatting (threads for Twitter, hashtags for Instagram, etc.).
4. Never start with generic intros like "Hey everyone" unless it's platform-appropriate.
5. Make each version feel like it was natively written for that platform by someone who deeply understands it.
6. Include appropriate CTAs, hashtags, and formatting for each platform.
7. Output ONLY valid JSON — no markdown, no explanation, no commentary.`;

  if (customInstructions) {
    prompt += `

CUSTOM INSTRUCTIONS FROM USER (follow these closely):
${customInstructions}`;
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

PLATFORM-SPECIFIC RULES:

- For Twitter: Max 280 characters. If content is dense, format as a thread using (1/n) numbering with each tweet under 280 chars. Style: punchy, high-impact, 1-2 hashtags max.

- For LinkedIn: Thought-leadership/professional tone. Structure: "The Hook" (first 2 lines that stop the scroll), "The Insight" (data or personal takeaway), "The Discussion" (CTA asking for opinions). Use bullet points for readability. 3-5 industry hashtags.

- For Instagram: Strong hook first line, value-add body, CTA at end. Clean line breaks (no walls of text), use emojis as bullet points. Place 5-15 hashtags at the very bottom, separated from the caption.

- For YouTube: Title: SEO-optimized with high-CTR power words. Description: 200-word keyword-rich summary + "Key Topics" bulleted list. Include a 3-act video script outline (Hook, Meat, Outro) and 10 tags. Do NOT generate fake timestamps.

- For Email: Use labels [Subject Line], [Body], [CTA]. Plain text format, focused on a single clear objective or click-through.

- For Telegram: 5-Block Method: (1) Hook — catch attention, (2) Story — contextualize the info, (3) Data — hard facts/value, (4) Tips — actionable steps, (5) CTA — engagement/link.

- For Reddit: "Human-to-human" tone. Avoid all marketing speak. Frame as a lesson learned, a question for the community, or a detailed breakdown. Write like a real person sharing on a subreddit.

- For Medium: Long-form narrative. Compelling H1 title, H2 subheaders, storytelling approach that weaves the core text into a broader context. Should feel like a published article.

- For TikTok: 15-60 second script format. Elements: 3-second visual hook, rapid-fire value points, "Follow for more" style CTA.

- For Substack: Intimate "behind-the-scenes" tone. Write as if speaking directly to a loyal subscriber list. Emphasize community and depth over brevity.

- For Threads: Casual, low-stakes, conversational. Bite-sized observations. Think "digital watercooler" chat. No heavy formatting.

- For Facebook: Community-centric tone. Start with a relatable opinion or question. Use line breaks for readability. 1-3 hashtags max. Focus on driving comments over likes.`;
}

export function buildVoiceAnalysisPrompt(samples: string[]): string {
  return `Analyze these writing samples and create a voice profile (200-300 words):

${samples.map((s, i) => `--- Sample ${i + 1} ---\n${s}\n`).join('\n')}

Identify tone, vocabulary, sentence structure, personality markers, and distinctive patterns. Return actionable instructions for replicating this style.`;
}
