'use client'
import React from 'react'
import { MessageSquareText, Cpu, Map } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const steps = [
  {
    number: '01',
    icon: <MessageSquareText className="h-7 w-7" />,
    title: 'Describe Your Dream Trip',
    description: 'Tell Zoro where you want to go, your travel style, budget, and preferences. Our AI asks smart follow-up questions to understand exactly what you need.',
    visual: '💬',
  },
  {
    number: '02',
    icon: <Cpu className="h-7 w-7" />,
    title: 'AI Crafts Your Itinerary',
    description: 'In seconds, Zoro generates a complete trip plan — flights, hotels, daily activities, hidden gems, and local recommendations tailored to you.',
    visual: '⚡',
  },
  {
    number: '03',
    icon: <Map className="h-7 w-7" />,
    title: 'Explore & Customize',
    description: 'Review your trip on an interactive map, adjust the plan, and save it to your dashboard. Your perfect adventure is ready to go.',
    visual: '🗺️',
  },
]

function HowItWorks() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-gray-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep/5 text-deep dark:bg-ocean/10 dark:text-ocean text-sm font-medium mb-6">
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-deep dark:text-white mb-5 tracking-tight">
            Three steps to your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
              next adventure
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            No forms, no endless scrolling through options. Just a conversation that turns into a complete travel plan.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-[20%] right-[20%] h-[2px]">
            <div className={`h-full bg-linear-to-r from-deep via-ocean to-ocean-light transition-all duration-1000 ${isVisible ? 'scale-x-100' : 'scale-x-0'} origin-left`} />
          </div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-deep to-ocean flex items-center justify-center text-white shadow-xl shadow-ocean/20">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-deep text-xs font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-deep dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
