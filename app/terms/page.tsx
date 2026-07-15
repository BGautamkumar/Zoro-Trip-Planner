import Link from "next/link"
import type { Metadata } from "next"
import Footer from "../_components/Footer"
import { FileText, AlertCircle, CreditCard, Ban, Scale, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — Zoro Trip Planner",
  description: "Read the Terms of Service for Zoro Trip Planner — your AI-powered travel itinerary platform.",
}

const sections = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Acceptance of Terms",
    content: "By accessing or using Zoro Trip Planner, you confirm that you are at least 13 years of age and agree to be bound by these Terms. If you are using Zoro on behalf of an organization, you represent that you have authority to bind that organization.",
  },
  {
    icon: <AlertCircle className="w-5 h-5" />,
    title: "Use of the Service",
    content: "Zoro provides AI-generated travel itineraries for informational purposes. While we strive for accuracy, itinerary details (prices, availability, opening hours) are estimates and should be independently verified before booking. You are responsible for all decisions made based on Zoro's output.",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Account & Billing",
    content: "Free accounts are subject to usage limits. Paid plans are billed monthly or annually and may be cancelled at any time — your access continues until the end of the billing period. We do not offer refunds for partial months.",
  },
  {
    icon: <Ban className="w-5 h-5" />,
    title: "Prohibited Conduct",
    content: "You may not use Zoro to violate any laws, infringe intellectual property rights, send spam, reverse-engineer our AI systems, or attempt unauthorized access to our infrastructure. Violations may result in immediate account termination.",
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Limitation of Liability",
    content: "Zoro is provided 'as is' without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from your use of the service, including travel decisions made based on AI-generated content.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-deep-dark via-deep to-ocean/80">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium mb-6">
            <FileText className="w-3.5 h-3.5" />
            Last updated: July 2025
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Please read these terms carefully before using Zoro Trip Planner.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 leading-relaxed">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Zoro Trip Planner (&ldquo;Zoro&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We may update these Terms from time to time and will notify registered users of material changes. Continued use after updates constitutes acceptance.
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
            Questions about these terms?{" "}
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
          <Link href="/privacy" className="text-gray-400 hover:text-ocean transition-colors">
            Privacy Policy
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
