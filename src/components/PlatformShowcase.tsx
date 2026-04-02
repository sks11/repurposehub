"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import {
  XTwitterIcon, LinkedInIcon, InstagramIcon, YouTubeIcon,
  TelegramIcon, RedditIcon, MediumIcon, TikTokIcon,
  SubstackIcon, ThreadsIcon, PinterestIcon,
} from "./Icons";

const platforms = [
  {
    id: "twitter", name: "Twitter / X", icon: XTwitterIcon, color: "#1d9bf0", badge: "badge-twitter",
    format: "Thread or single tweet", tone: "Punchy, hook-driven, conversational",
    example: `5 lessons from building a $50K/month coaching biz\n\n1/ Fewer clients = deeper impact\nMost coaches chase volume. I cut my roster in half and 3x'd revenue.\n\n2/ Systems beat hustle\nI automated onboarding, follow-ups, and content. Now I work 25hrs/week.\n\n3/ Your story IS the strategy\nPeople don't buy frameworks. They buy transformation they can see in you.\n\n4/ Price for results, not hours\nMoved to outcome-based pricing. Clients happier. Revenue doubled.\n\n5/ Community > audience\nMy private community of 200 converts at 15%. My 10K followers? 0.3%.\n\nThe biggest lesson? Growth isn't about more. It's about better.\n\nBookmark this.`,
  },
  {
    id: "linkedin", name: "LinkedIn", icon: LinkedInIcon, color: "#0a66c2", badge: "badge-linkedin",
    format: "Professional post with data", tone: "Insightful, data-backed, authority",
    example: `18 months ago, my coaching business revenue was $0.\n\nToday, it generates $50K/month.\n\nBut the path wasn't what you'd expect.\n\nThe turning point? I stopped trying to get MORE clients.\n\nInstead, I focused on serving FEWER clients at a dramatically higher level.\n\nHere's what that looked like:\n\n→ Cut my roster from 40 to 18 clients\n→ Tripled my per-client investment\n→ Revenue went from $15K to $50K/month\n→ Client satisfaction scores went from 7.2 to 9.6\n\nThe 5 principles that made this work:\n\n1. Depth over breadth\n2. Systems over hustle\n3. Story-driven positioning\n4. Outcome-based pricing\n5. Community-led growth\n\nWhat's been your biggest business lesson this year?\n\n#coaching #entrepreneurship #growth`,
  },
  {
    id: "instagram", name: "Instagram", icon: InstagramIcon, color: "#e1306c", badge: "badge-instagram",
    format: "Carousel + Caption", tone: "Visual, engaging, save-worthy",
    example: `SAVE THIS for later\n\n$0 → $50K/month in 18 months.\n\nHere's the exact playbook:\n\nSLIDE 1: The Mindset Shift\n"Stop chasing more clients. Start serving fewer, better."\n\nSLIDE 2: The Numbers\n• 40 clients → 18 clients\n• Revenue: 3x increase\n• Hours worked: down 40%\n\nSLIDE 3: The 5 Principles\n1. Depth > breadth\n2. Systems > hustle\n3. Story = strategy\n4. Price for transformation\n5. Community > audience\n\nSLIDE 4: The Secret\nGrowth isn't about more. It's about better.\n\n---\n\nWhich principle resonates most? Tell me in the comments\n\nFollow @repurposehub for more coaching business tips`,
  },
  {
    id: "youtube", name: "YouTube", icon: YouTubeIcon, color: "#ff0000", badge: "badge-youtube",
    format: "Script + Description", tone: "Storytelling, hook-first, educational",
    example: `TITLE: I Went From $0 to $50K/Month — Here's What Nobody Tells You\n\nDESCRIPTION:\nIn this video, I break down the 5 counterintuitive lessons that took my coaching business from zero to $50K/month in just 18 months.\n\nTimestamps:\n0:00 - The $0 starting point\n2:15 - Why I cut my client roster in HALF\n4:30 - The systems that changed everything\n7:00 - Story-driven positioning explained\n9:45 - Outcome-based pricing breakdown\n12:00 - Community vs. audience\n14:30 - The one thing I'd do differently\n\nKey takeaways:\n• Why fewer clients = more revenue\n• The exact systems I use\n• How to price for transformation\n\nSubscribe for weekly coaching business breakdowns`,
  },
  {
    id: "email", name: "Email", icon: Mail, color: "#7c3aed", badge: "badge-email",
    format: "Subject + Body + CTA", tone: "Personal, direct, valuable",
    example: `SUBJECT: The counterintuitive move that 3x'd my revenue\n\nHey [First Name],\n\nQuick story.\n\n18 months ago, I was grinding with 40 coaching clients and making $15K/month. Exhausted. Burning out.\n\nThen I did something that terrified me:\n\nI cut my roster in half.\n\n18 clients. That's it.\n\nWhat happened next? My revenue TRIPLED to $50K/month.\n\nHere are the 5 shifts that made it work:\n\n1. Depth over breadth\n2. Systems over hustle\n3. Story as strategy\n4. Outcome-based pricing\n5. Community over audience\n\nIf you're stuck in the "more clients" trap, hit reply and let me know — I'll share the exact framework I used.\n\nTalk soon,\n[Your name]\n\nP.S. I'm opening 3 spots in my mentorship next month. Reply "INTERESTED" to get first access.`,
  },
  {
    id: "telegram", name: "Telegram", icon: TelegramIcon, color: "#2aabee", badge: "badge-telegram",
    format: "5-block post structure", tone: "Direct, community-focused, value-packed",
    example: `From $0 to $50K/month — The 5 Rules\n\n18 months. That's all it took.\n\nBut here's what surprised me most:\n\nThe growth came from doing LESS, not more.\n\nThe numbers:\n• Clients: 40 → 18\n• Revenue: $15K → $50K/month\n• Hours worked: 50 → 25/week\n• Client satisfaction: 7.2 → 9.6\n\nThe 5 principles:\n\n1. Depth > Breadth\nServe fewer people at a dramatically higher level.\n\n2. Systems > Hustle\nAutomate everything that doesn't need your brain.\n\n3. Story = Strategy\nYour transformation story attracts the right clients.\n\n4. Price for Results\nStop selling hours. Sell outcomes.\n\n5. Community > Audience\n200 engaged members > 10,000 followers.\n\nWhich principle are you implementing first?`,
  },
  {
    id: "reddit", name: "Reddit", icon: RedditIcon, color: "#ff4500", badge: "badge-reddit",
    format: "Discussion post", tone: "Authentic, detailed, community-first",
    example: `Title: Went from $0 to $50K/month coaching in 18 months — here are the 5 things that actually mattered\n\nSo I've been lurking here for a while and wanted to share what actually worked for me.\n\nBackground: Started a coaching business from scratch. No audience. No connections.\n\n1. Serve fewer clients, charge more.\nI went from 40 clients at $375/mo to 18 clients at $2,800/mo. Better results. More revenue. Less burnout.\n\n2. Build systems early.\nAutomated onboarding, scheduling, follow-ups. Freed up 25+ hours/week.\n\n3. Lead with your story.\nNobody cares about your certification. They care about your transformation.\n\n4. Price based on outcomes.\n"I'll help you add $20K in revenue" > "$200/hour."\n\n5. Community > social media following.\nMy private group of 200 has a 15% conversion rate. My 10K social following? 0.3%.\n\nHappy to answer questions. No pitch, just sharing what worked.`,
  },
  {
    id: "medium", name: "Medium", icon: MediumIcon, color: "#333", badge: "badge-medium",
    format: "Long-form article", tone: "Thoughtful, in-depth, narrative",
    example: `# The Counterintuitive Truth About Scaling a Coaching Business\n\n*How doing less led to $50K/month in 18 months*\n\n---\n\nEighteen months ago, I sat in my home office at 11 PM, staring at a spreadsheet that told a painful story: 40 active clients, $15,000 in monthly revenue, and zero energy left.\n\nI was doing everything the "experts" said to do. More clients. More content. More hustle.\n\nIt wasn't working.\n\nSo I made a decision that terrified me: I was going to cut my client roster in half.\n\n## The Math That Changed Everything\n\nWhen I reduced from 40 to 18 clients and restructured my pricing around outcomes rather than hours, something unexpected happened...\n\n[Continues as full article with sections on each principle, data, and anecdotes]`,
  },
  {
    id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "#ff0050", badge: "badge-tiktok",
    format: "Short-form script", tone: "Hooks, fast-paced, trending",
    example: `HOOK: "I made $50K last month and I only have 18 clients"\n\n[Cut to talking head]\n\nEveryone says you need MORE clients to grow.\n\nI did the opposite.\n\nI CUT my clients from 40 to 18.\n\nAnd my revenue went from $15K to $50K a month.\n\nHere's the cheat code nobody talks about:\n\n[Quick cuts between each point]\n\n1. FEWER clients, DEEPER results\n2. Systems over hustle — automate everything\n3. Your STORY attracts the right people\n4. Price for the TRANSFORMATION, not the time\n5. 200 in your community beats 10K followers\n\nThe biggest flex in coaching? Working 25 hours a week and making more than you did at 50.\n\nSave this.\n\n#coaching #entrepreneur #business #growthmindset`,
  },
  {
    id: "substack", name: "Substack", icon: SubstackIcon, color: "#ff6600", badge: "badge-substack",
    format: "Newsletter edition", tone: "Personal, deep-dive, subscriber-intimate",
    example: `# The Less-Is-More Playbook\n\n*Edition #47 — The 5 rules that took me from $0 to $50K/month*\n\n---\n\nHey friend,\n\nI wasn't planning to share this publicly. But last week, three different people asked me the same question:\n\n"How did you actually grow your coaching business so fast?"\n\nSo here's the honest answer — with numbers.\n\nThe timeline: 18 months\nThe result: $0 → $50K/month\nThe surprise: It came from doing LESS\n\nLet me break down the 5 principles that made this work...\n\n[Full newsletter with personal storytelling, data, actionable takeaways]\n\n---\n\n*If this resonated, forward it to one person who needs to hear it.*`,
  },
  {
    id: "threads", name: "Threads", icon: ThreadsIcon, color: "#333", badge: "badge-threads",
    format: "Conversational post", tone: "Casual, authentic, bite-sized",
    example: `hot take: you don't need more clients to grow your business\n\nI cut mine from 40 to 18 and TRIPLED my revenue\n\nthe math most people ignore:\n\n40 clients × $375/mo = $15K\n18 clients × $2,800/mo = $50K\n\nfewer people. deeper work. better results.\n\nthe 5 things that actually mattered:\n→ depth over breadth\n→ systems over hustle\n→ lead with your story\n→ price for outcomes\n→ community > followers\n\n18 months. $0 to $50K/month.\n\nsometimes less really is more`,
  },
  {
    id: "pinterest", name: "Pinterest", icon: PinterestIcon, color: "#e60023", badge: "badge-pinterest",
    format: "Pin description + title", tone: "SEO-rich, aspirational, actionable",
    example: `PIN TITLE: 5 Coaching Business Lessons: $0 to $50K/Month\n\nPIN DESCRIPTION:\nHow I grew my coaching business from $0 to $50,000 per month in just 18 months using 5 counterintuitive principles. Learn why serving FEWER clients led to 3x more revenue, how to build automated systems, and why community beats audience every time.\n\nPerfect for: coaches, consultants, online course creators, solopreneurs\n\nBOARD: Coaching Business Tips\n\nTAGS: coaching business, online coaching, business growth, entrepreneur tips, coaching revenue, scaling business`,
  },
];

export default function PlatformShowcase() {
  const [active, setActive] = useState("twitter");
  const activePlatform = platforms.find((p) => p.id === active)!;

  return (
    <section id="platforms" className="relative py-28 overflow-hidden section-alt">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-accent tracking-wider uppercase">Platform Showcase</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 text-foreground">
            One text. <span className="gradient-text">12 platforms.</span>
          </h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            See how RepurposeHub transforms a single piece of content into platform-native posts — each with the right tone, format, and structure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === p.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-border/60 hover:border-primary/20 text-muted hover:text-foreground shadow-sm"
              }`}
            >
              <p.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{p.name}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="space-y-4">
              <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${activePlatform.color}10` }}>
                    <activePlatform.icon className="w-6 h-6" style={{ color: activePlatform.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{activePlatform.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${activePlatform.badge}`}>Supported</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wider font-medium">Format</span>
                    <p className="text-sm text-foreground mt-1">{activePlatform.format}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wider font-medium">Tone</span>
                    <p className="text-sm text-foreground mt-1">{activePlatform.tone}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-semibold mb-3 text-foreground">Platform Optimization</h4>
                <div className="space-y-2">
                  {["Character limits respected", "Platform-native formatting", "Hashtag optimization", "CTA best practices", "Engagement hooks included"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-border/60 rounded-2xl p-6 h-full shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground">Generated Output Preview</h4>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-primary/8 text-primary hover:bg-primary/12 transition-colors font-medium">
                    Copy to clipboard
                  </button>
                </div>
                <div className="bg-surface rounded-xl p-6 border border-border/50 max-h-[500px] overflow-y-auto">
                  <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                    {activePlatform.example}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
