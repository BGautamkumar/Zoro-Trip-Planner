'use client'
import React from 'react'
import { Sparkles, Map, Calendar, CreditCard, Globe, Shield } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'AI-Crafted Itineraries',
    description: 'Describe your dream trip and our AI builds a complete day-by-day plan with attractions, restaurants, and local experiences.',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: 'Interactive Maps',
    description: 'Visualize every stop on an interactive map. Drag, reorder, and customize your route with real-time updates.',
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Smart Scheduling',
    description: 'Intelligent time optimization ensures you see the most without the rush. We factor in travel time and opening hours.',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Budget Optimization',
    description: 'Get cost estimates for flights, hotels, and activities. Zoro finds options that match your budget perfectly.',
    color: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global Coverage',
    description: 'From Tokyo to Tuscany, our AI has knowledge of 10,000+ destinations worldwide with local insider recommendations.',
    color: 'from-deep to-ocean',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Travel Intelligence',
    description: 'Real-time awareness of seasonal events, local customs, visa requirements, and safety advisories for smarter travel.',
    color: 'from-rose-500 to-red-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  },
]

function Features() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-surface dark:bg-gray-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ocean/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean/10 text-ocean text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Why Zoro
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-deep dark:text-white mb-5 tracking-tight">
            Everything you need for the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
              perfect trip
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Zoro combines artificial intelligence with deep travel knowledge to create experiences that feel personally curated — because they are.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-7 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 card-hover transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-deep dark:text-white mb-2 group-hover:text-ocean transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover border accent */}
              <div className={`absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl bg-linear-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
