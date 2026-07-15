import type { Metadata } from "next"
import Link from "next/link"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "How It Works — Zoro Trip Planner",
  description: "A step-by-step guide to planning your perfect trip with Zoro's AI-powered itinerary builder.",
}

const steps = [
  {
    number: "01",
    title: "Sign In",
    description: "Create a free account using Google or email. Your trips are saved to your account and accessible any time from the My Trips page.",
    note: null,
  },
  {
    number: "02",
    title: "Click \"Create New Trip\"",
    description: "Hit the Create New Trip button in the top navigation. This opens the AI trip planner chat interface.",
    note: null,
  },
  {
    number: "03",
    title: "Choose Your Destination",
    description: "Type any city, region, or country in the world. Zoro supports thousands of destinations globally — from major cities to off-the-beaten-path locations.",
    note: null,
  },
  {
    number: "04",
    title: "Set Your Travel Dates",
    description: "Enter how many days you want to travel. Zoro will build a day-by-day schedule optimised for that duration — from 1-day getaways up to multi-week trips.",
    note: null,
  },
  {
    number: "05",
    title: "Select Travel Mode",
    description: "Choose how you are getting there — flight, road trip, train, or cruise. This affects the type of recommendations Zoro makes for your journey.",
    note: null,
  },
  {
    number: "06",
    title: "Pick Your Group Size",
    description: "Tell Zoro if you are travelling Solo, as a Couple, with Family, or a Large Group. Group size influences activity suggestions and accommodation types.",
    note: null,
  },
  {
    number: "07",
    title: "Set Your Budget",
    description: "Choose Budget, Moderate, or Luxury. Zoro tailors hotel tiers, dining recommendations, and activity suggestions to match your spending preference.",
    note: null,
  },
  {
    number: "08",
    title: "Generate Your Itinerary",
    description: "Zoro's AI runs parallel processing across multiple models to build your complete itinerary — hotels, attractions, restaurants, and local tips — in under 30 seconds.",
    note: "You will see a progress indicator while the itinerary is being generated. Do not refresh the page during this step.",
  },
  {
    number: "09",
    title: "Explore Your Trip",
    description: "Your itinerary opens in the trip workspace. You can view day-by-day plans, hotel options, top attractions, and an interactive map with all pinned locations.",
    note: null,
  },
  {
    number: "10",
    title: "Access It Anytime",
    description: "All generated trips are saved to your account. Visit My Trips from the user menu to revisit, review, or share any past itinerary.",
    note: null,
  },
]

const faqs = [
  {
    q: "Is Zoro free to use?",
    a: "Yes. Free accounts can generate itineraries with standard limits. See the Pricing page for plan details.",
  },
  {
    q: "Can I regenerate or change my trip?",
    a: "Currently each generation creates a new saved trip. Simply start a new trip with adjusted inputs to get a different itinerary.",
  },
  {
    q: "How accurate are the recommendations?",
    a: "Zoro's AI generates well-researched suggestions, but prices, hours, and availability should always be verified before booking.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your account and trip data are encrypted at rest and in transit. We never sell your data. See our Privacy Policy for details.",
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-10 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-ocean mb-3">User Guide</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          How Zoro Works
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          Follow these steps to plan your trip from start to finish. The entire process takes under 2 minutes.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block" />

          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                {/* Step number badge */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center z-10">
                  <span className="text-xs font-bold text-white dark:text-gray-900">{step.number}</span>
                </div>

                {/* Content */}
                <div className="pt-1.5 pb-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                    {step.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  {step.note && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-800/40">
                      ⚠ {step.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 p-6 rounded-2xl bg-gray-950 dark:bg-white/5 text-center">
          <p className="text-white dark:text-white text-sm font-medium mb-4">
            Ready to plan your first trip?
          </p>
          <Link
            href="/create-new-trip?mode=create"
            className="inline-block bg-gradient-to-r from-deep to-ocean text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Start Planning for Free →
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/pricing" className="text-xs text-gray-400 hover:text-ocean transition-colors">
            Pricing
          </Link>
          <Link href="/about-us" className="text-xs text-gray-400 hover:text-ocean transition-colors">
            About Us
          </Link>
          <Link href="/legal" className="text-xs text-gray-400 hover:text-ocean transition-colors">
            Privacy & Terms
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
