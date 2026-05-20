'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Globe2, Plane, Landmark, Compass,
  ArrowRight, Sparkles, MapPin, Star
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/* ── Exported for re-use in EmptyBoxState ── */
export const suggestions = [
  {
    title: 'Create New Trip',
    icon: <Globe2 className="h-5 w-5 text-blue-500" />,
  },
  {
    title: 'Inspire me where to go',
    icon: <Plane className="h-5 w-5 text-orange-500" />,
  },
  {
    title: 'Discover Hidden gems',
    icon: <Landmark className="h-5 w-5 text-purple-500" />,
  },
  {
    title: 'Adventure Destination',
    icon: <Compass className="h-5 w-5 text-emerald-500" />,
  },
]

/* ── Destination cards that float on the hero ── */
const floatingDestinations = [
  { city: 'Tokyo', country: 'Japan', emoji: '🗼', delay: 'animate-float' },
  { city: 'Paris', country: 'France', emoji: '🗼', delay: 'animate-float-delayed' },
  { city: 'Dubai', country: 'UAE', emoji: '🏙️', delay: 'animate-float' },
]

/* ── Quick action cards ── */
const quickActions = [
  {
    title: 'Plan a Trip',
    description: 'Describe your dream destination and let AI handle the rest',
    icon: <Globe2 className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    title: 'Get Inspired',
    description: 'Not sure where to go? We\'ll suggest amazing places',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'from-orange-500 to-amber-400',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    title: 'Hidden Gems',
    description: 'Discover off-the-beaten-path destinations worldwide',
    icon: <Landmark className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-400',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    title: 'Adventures',
    description: 'Find thrilling experiences tailored to your style',
    icon: <Compass className="h-6 w-6" />,
    color: 'from-emerald-500 to-teal-400',
    shadowColor: 'shadow-emerald-500/20',
  },
]

function Hero() {
  const { user } = useUser()
  const router = useRouter()

  const handleGetStarted = () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    router.push('/create-new-trip')
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-ocean/5" />

        {/* Floating gradient orbs */}
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-ocean/8 rounded-full blur-[120px] motion-safe:animate-gradient-shift motion-reduce:hidden" />
        <div className="absolute bottom-20 -right-40 w-[600px] h-[600px] bg-deep/8 rounded-full blur-[140px] motion-safe:animate-gradient-shift motion-reduce:hidden" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] motion-reduce:hidden" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(11,29,58,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(11,29,58,0.3) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ── Main hero content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column: Copy + CTAs ── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-reveal-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-ocean/20 text-sm font-medium text-deep">
              <Sparkles className="h-4 w-4 text-ocean" />
              <span>AI-Powered Travel Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="animate-reveal-up stagger-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-deep dark:text-white">Navigate</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-deep via-ocean to-ocean-light">
                Your Next
              </span>
              <br />
              <span className="text-deep dark:text-white">Adventure</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-reveal-up stagger-2 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Your AI-powered compass to the world. Describe where you dream of going — Zoro crafts flights, stays, and itineraries in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="animate-reveal-up stagger-3 flex flex-wrap gap-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-ocean/25 hover:shadow-2xl hover:shadow-ocean/35 transition-all duration-300 hover:-translate-y-1 group"
              >
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGetStarted}
                className="rounded-full px-8 py-6 text-base font-semibold border-2 border-deep/15 text-deep hover:bg-deep/5 hover:border-deep/25 transition-all duration-300"
              >
                See How It Works
              </Button>
            </div>

            {/* Social proof */}
            <div className="animate-reveal-up stagger-4 flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {['🧑‍💻', '👩‍🎨', '🧑‍🚀', '👩‍💼'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-linear-to-br from-deep/10 to-ocean/10 border-2 border-white flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                  <span className="ml-1 font-semibold text-deep">4.9</span>
                </div>
                <span className="text-gray-500">Loved by 2,000+ travelers</span>
              </div>
            </div>
          </div>

          {/* ── Right column: Floating destination cards ── */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[520px]">

              {/* Main showcase card */}
              <div className="animate-float absolute top-8 left-8 right-8 glass rounded-3xl p-6 shadow-2xl shadow-deep/10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-deep to-ocean flex items-center justify-center shrink-0">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-ocean uppercase tracking-wider">Your next trip</p>
                    <h3 className="text-xl font-bold text-deep mt-1">7 Days in Tokyo</h3>
                    <p className="text-sm text-gray-500 mt-1">From New York • 2 travelers</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {['Flights', 'Hotels', 'Activities'].map((item, i) => (
                    <div key={i} className="bg-deep/5 rounded-xl p-3 text-center">
                      <p className="text-xs font-medium text-gray-500">{item}</p>
                      <p className="text-sm font-bold text-deep mt-0.5">
                        {item === 'Flights' ? '✈️ Booked' : item === 'Hotels' ? '🏨 3 nights' : '🎌 12 plans'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating mini cards */}
              {floatingDestinations.map((dest, i) => (
                <div
                  key={dest.city}
                  className={`${dest.delay} absolute glass rounded-2xl px-4 py-3 shadow-lg shadow-deep/5 ${
                    i === 0 ? 'bottom-20 left-0' :
                    i === 1 ? 'bottom-4 left-1/3' :
                    'bottom-28 right-0'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{dest.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-deep">{dest.city}</p>
                      <p className="text-xs text-gray-500">{dest.country}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative glow ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-ocean/10 animate-pulse-glow -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick action cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.title}
              onClick={handleGetStarted}
              className={`group card-hover text-left p-5 rounded-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-reveal-up stagger-${index + 1}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.color} flex items-center justify-center text-white mb-4 shadow-lg ${action.shadowColor} transition-transform duration-300 group-hover:scale-110`}>
                {action.icon}
              </div>
              <h3 className="font-bold text-deep dark:text-white mb-1 group-hover:text-ocean transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero