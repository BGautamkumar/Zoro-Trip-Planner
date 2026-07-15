import Link from "next/link"
import type { Metadata } from "next"
import Footer from "../_components/Footer"
import { Shield, Lock, Eye, Database, Share2, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — Zoro Trip Planner",
  description: "Learn how Zoro Trip Planner collects, uses, and protects your personal information.",
}

const sections = [
  {
    icon: <Database className="w-5 h-5" />,
    title: "Information We Collect",
    content: "We collect information you provide directly — such as your name, email address, and trip preferences — when you create an account or generate a trip. We also collect usage data (pages visited, features used, time spent) to improve the product.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "How We Use Your Information",
    content: "Your data is used to power your AI-generated itineraries, personalize your experience, send product updates you opt into, and improve our AI models. We do not sell your personal information to third parties.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Third-Party Services",
    content: "Zoro integrates with Google (Maps & Places), OpenRouter (AI models), and Convex (database). Each service operates under its own privacy policy. We share only the minimum data required for these services to function.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Data Security",
    content: "All data is encrypted in transit (TLS 1.3) and at rest. We use industry-standard authentication practices and limit internal access to your personal data on a need-to-know basis.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Your Rights",
    content: "You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us at the email below. We will respond within 30 days.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-deep-dark via-deep to-ocean/80">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            Last updated: July 2025
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            We respect your privacy and are committed to being transparent about how we handle your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 leading-relaxed">
          This policy applies to all users of Zoro Trip Planner (&ldquo;Zoro&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using our service, you agree to the practices described here. If you have questions, reach us at{" "}
          <a href="mailto:support@zorotrip.app" className="text-ocean hover:underline">
            support@zorotrip.app
          </a>
          .
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-ocean/20 transition-colors duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-deep to-ocean flex items-center justify-center text-white shadow-sm">
                {section.icon}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-deep/5 to-ocean/5 border border-ocean/10 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions about this policy?{" "}
            <a href="mailto:support@zorotrip.app" className="text-ocean font-medium hover:underline">
              Contact us
            </a>
          </p>
        </div>

        <div className="mt-10 flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-gray-200 dark:text-gray-700">•</span>
          <Link href="/terms" className="text-gray-400 hover:text-ocean transition-colors">
            Terms of Service
          </Link>
          <span className="text-gray-200 dark:text-gray-700">•</span>
          <Link href="/cookies" className="text-gray-400 hover:text-ocean transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
