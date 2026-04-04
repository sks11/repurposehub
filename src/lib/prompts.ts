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
- For Facebook: Conversational tone, use line breaks for readability, ask a question or share an opinion to drive engagement, 1-3 relevant hashtags max, include a CTA`;
}

export function buildVoiceAnalysisPrompt(samples: string[]): string {
  return `You are a voice analysis expert. Study these writing samples and create a SPECIFIC, ACTIONABLE voice replication guide. Do NOT write vague descriptions — write concrete instructions that would let someone impersonate this writer convincingly.

SAMPLES:
${samples.map((s, i) => `--- Sample ${i + 1} ---\n${s}\n`).join('\n')}

Create a voice profile covering ALL of these (with SPECIFIC EXAMPLES from the samples):

1. **VOCABULARY LEVEL & SPECIFIC WORDS**: List 10-15 actual words/phrases this person uses. What is their vocabulary level? (e.g., "Uses words like 'exsanguination', 'farraginous', 'stupefaction' — deliberately elevated, Latinate vocabulary")

2. **SENTENCE STRUCTURE**: Average sentence length? Simple or complex? Do they use semicolons, em-dashes, parenthetical asides? Quote specific sentence patterns.

3. **METAPHOR DOMAINS**: What topics do they draw metaphors from? (e.g., cricket, colonial history, literature). Give specific examples from the samples.

4. **RHETORICAL DEVICES**: Do they use irony, understatement, hyperbole, rhetorical questions, tricolons? Quote examples.

5. **PERSONALITY & ATTITUDE**: What is their stance? (e.g., "witty intellectual superiority with self-awareness", "passionate defender of X"). How do they handle disagreement?

6. **SIGNATURE MOVES**: What makes this person IMMEDIATELY recognizable? What would a reader notice in the first sentence? (e.g., "Opens with a provocative reframing of the obvious", "Always connects modern events to historical parallels")

7. **WHAT TO AVOID**: What would this person NEVER write? (e.g., "Would never use corporate buzzwords like 'synergy' or 'leverage'", "Would never write short punchy sentences without subordinate clauses")

Return 400-500 words. Be extremely specific — generic advice like "uses formal tone" is useless. Every point should include quoted examples.`;
}
