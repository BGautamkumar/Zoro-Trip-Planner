'use client'

import { useState } from "react"
import Link from "next/link"
import Footer from "../_components/Footer"

const tabs = ["Privacy Policy", "Terms of Service", "Cookie Policy"] as const
type Tab = typeof tabs[number]

export default function LegalPage() {
  const [active, setActive] = useState<Tab>("Privacy Policy")

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-14">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Legal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 2025 · Zoro Trip Planner</p>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
                active === tab
                  ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Privacy Policy ── */}
        {active === "Privacy Policy" && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
            <Section title="What We Collect">
              When you sign up or plan a trip we collect your name, email address, and the trip preferences you provide. We also collect basic usage data (pages visited, features used) to improve the product.
            </Section>

            <Section title="How We Use It">
              Your data is used to generate and save your itineraries, personalise your experience, and send product updates you opt into. We do not sell your data.
            </Section>

            <Section title="Third-Party Services">
              Zoro uses Google Maps/Places (for location data), OpenRouter (AI), and Convex (database). We share only the minimum data required for these services to work.
            </Section>

            <Section title="Data Security">
              All data is encrypted in transit (TLS) and at rest. Access to personal data is restricted internally on a need-to-know basis.
            </Section>

            <Section title="Your Rights">
              You can request access to, correction of, or deletion of your data at any time by emailing{" "}
              <a href="mailto:support@zorotrip.app" className="text-gray-900 dark:text-white underline underline-offset-2">
                support@zorotrip.app
              </a>
              . We respond within 30 days.
            </Section>
          </div>
        )}

        {/* ── Terms of Service ── */}
        {active === "Terms of Service" && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
            <Section title="Acceptance">
              By using Zoro you agree to these Terms. If you are under 13, you may not use the service.
            </Section>

            <Section title="Use of Service">
              Zoro generates AI-powered travel itineraries for informational purposes. Prices, availability, and opening hours are estimates — verify them independently before booking. You are responsible for decisions made based on Zoro's output.
            </Section>

            <Section title="Accounts & Billing">
              Free accounts have usage limits. Paid plans are billed monthly or annually and can be cancelled at any time — access continues until the period ends. Partial-month refunds are not issued.
            </Section>

            <Section title="Prohibited Conduct">
              Do not use Zoro to violate laws, infringe intellectual property, send spam, or attempt to reverse-engineer our systems. Violations may result in account termination.
            </Section>

            <Section title="Limitation of Liability">
              Zoro is provided "as is." We are not liable for indirect or consequential damages, including losses arising from travel decisions made based on AI-generated content.
            </Section>

            <Section title="Changes">
              We may update these Terms at any time. Continued use after updates constitutes acceptance. We will notify registered users of material changes.
            </Section>
          </div>
        )}

        {/* ── Cookie Policy ── */}
        {active === "Cookie Policy" && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
            <p className="text-sm leading-relaxed">
              Cookies are small text files stored on your device. Zoro uses only what is needed to operate and understand usage. We do not use cookies for advertising.
            </p>

            <Section title="Essential Cookies">
              Required for authentication sessions, security tokens, and core platform features. Cannot be disabled.
            </Section>

            <Section title="Analytics Cookies">
              Anonymised analytics (via Vercel Analytics) that help us understand which features are used and where performance can be improved. No personally identifiable data is collected.
            </Section>

            <Section title="Preference Cookies">
              Remember your UI settings (dark mode, filters) so you don't need to reconfigure them on each visit.
            </Section>

            <Section title="How to Control Cookies">
              You can manage or delete cookies through your browser settings. Disabling essential cookies will prevent Zoro from functioning correctly. See{" "}
              <a
                href="https://www.allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-white underline underline-offset-2"
              >
                allaboutcookies.org
              </a>{" "}
              for instructions.
            </Section>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Questions?{" "}
            <a href="mailto:support@zorotrip.app" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300">
              support@zorotrip.app
            </a>
            {" · "}
            <Link href="/" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300">
              Back to home
            </Link>
          </p>
        </div>

      </div>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h2>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  )
}
