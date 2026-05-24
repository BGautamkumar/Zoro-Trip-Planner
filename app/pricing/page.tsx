import { PricingTable } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose your Zoro Trip Planner plan. Start free with AI-powered trip generation and upgrade for premium features.",
  openGraph: {
    title: "Pricing — Zoro Trip Planner",
    description: "Start free and upgrade as your travel ambitions grow. AI-powered trip planning for everyone.",
  },
};

function Pricing() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-ocean/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean/10 text-ocean text-sm font-medium mb-6">
                        <Sparkles className="h-3.5 w-3.5" />
                        Pricing
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-deep dark:text-white mb-4 tracking-tight">
                        Pick your{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
                            plan
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Start free and upgrade as your travel ambitions grow. Every plan includes AI-powered trip generation.
                    </p>
                </div>

                {/* Clerk Pricing Table */}
                <div className="max-w-lg mx-auto">
                    <PricingTable />
                </div>
            </div>
        </div>
    )
}

export default Pricing