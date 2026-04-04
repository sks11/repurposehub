import { Zap } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Repurpose<span className="gradient-text">Hub</span></span>
        </a>

        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-10">Last updated: April 2, 2026</p>

        <div className="prose-sm space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p><strong>Account information:</strong> When you create an account, we collect your email address and authentication credentials. If you sign in with Google, we receive your name and email from Google.</p>
            <p className="mt-2"><strong>Content you provide:</strong> We process the text you submit for repurposing. This content is sent to our AI provider (OpenAI) for processing and is stored in your generation history.</p>
            <p className="mt-2"><strong>Usage data:</strong> We track generation counts and feature usage to enforce plan limits and improve our service.</p>
            <p className="mt-2"><strong>Payment information:</strong> Payments are processed by Stripe. We do not store your credit card details. Stripe may collect billing information as described in their privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain the RepurposeHub service</li>
              <li>To process your content repurposing requests</li>
              <li>To manage your account and subscription</li>
              <li>To enforce usage limits based on your plan</li>
              <li>To communicate service updates or changes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Storage and Security</h2>
            <p>Your data is stored in Firebase (Google Cloud) with encryption at rest and in transit (256-bit AES / TLS 1.3). We retain your generation history based on your plan tier (7 days for Free, 90 days for Pro, 365 days for Agency).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. AI Processing</h2>
            <p>Your content is sent to OpenAI for processing. We do not use your content to train any AI models. OpenAI processes data according to their API data usage policy, which states that API inputs and outputs are not used for model training.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Firebase (Google):</strong> Authentication and database</li>
              <li><strong>OpenAI:</strong> AI content generation</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Vercel:</strong> Hosting and deployment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>You may request to export or delete your data at any time from your account settings. Upon account deletion, all your data (profile, generation history, voice profiles) will be permanently removed within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify registered users of significant changes via email.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
            <p>For privacy-related questions, contact us at info@repurposehub.co.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
