import Link from "next/link"
import type { Metadata } from "next"
import Footer from "../_components/Footer"
import { Cookie, ToggleLeft, BarChart2, Settings, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy — Zoro Trip Planner",
  description: "Learn how Zoro Trip Planner uses cookies and similar technologies.",
}

const cookieTypes = [
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Essential Cookies",
    badge: "Always Active",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    content: "These are required for Zoro to function. They handle authentication sessions, security tokens, and core platform features. They cannot be disabled.",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: "Analytics Cookies",
    badge: "Optional",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    content: "We use anonymized analytics (via Vercel Analytics) to understand how users navigate the product — which features are used, where users drop off, and overall performance metrics. No personally identifiable data is collected.",
  },
  {
    icon: <ToggleLeft className="w-5 h-5" />,
    title: "Preference Cookies",
    badge: "Optional",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    content: "These remember your UI preferences such as dark mode, language selection, and saved filters so you don't have to reconfigure them on each visit.",
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-deep-dark via-deep to-ocean/80">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium mb-6">
            <Cookie className="w-3.5 h-3.5" />
            Last updated: July 2025
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            A straightforward explanation of how we use cookies and how you control them.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 leading-relaxed">
          Cookies are small text files stored on your device. Zoro uses a minimal set of cookies — only what is necessary to run the product and understand how it&apos;s being used. We never use cookies for advertising or sell cookie data to third parties.
        </p>

        <div className="space-y-6">
          {cookieTypes.map((cookie, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-ocean/20 transition-colors duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-deep to-ocean flex items-center justify-center text-white shadow-sm">
                {cookie.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {cookie.title}
                  </h2>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cookie.badgeColor}`}>
                    {cookie.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {cookie.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* How to control */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-deep/5 to-ocean/5 border border-ocean/10">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-ocean" />
            How to Control Cookies
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            You can manage or delete cookies through your browser settings. Note that disabling essential cookies will prevent Zoro from functioning correctly. For detailed instructions, visit{" "}
            <a
              href="https://www.allaboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean hover:underline"
            >
              allaboutcookies.org
            </a>
            .
          </p>
        </div>

        {/* Contact */}
        <div className="mt-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cookie questions?{" "}
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
          <Link href="/terms" className="text-gray-400 hover:text-ocean transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
