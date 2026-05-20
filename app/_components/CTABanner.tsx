'use client'
import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function CTABanner() {
  const { user } = useUser()
  const router = useRouter()
  const { ref, isVisible } = useScrollReveal(0.15)

  const handleCTA = () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    router.push('/create-new-trip')
  }

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-deep via-deep-light to-ocean" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(27,154,170,0.3),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-ocean/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px]" />

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Ready to explore?
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight max-w-3xl mx-auto leading-tight">
              Your next adventure is a{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gold to-gold-light">
                conversation
              </span>{' '}
              away
            </h2>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of travelers who plan smarter with Zoro. No credit card required — start creating your dream trip in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleCTA}
                size="lg"
                className="bg-white text-deep hover:bg-white/90 rounded-full px-10 py-7 text-base font-semibold shadow-2xl shadow-black/20 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 group"
              >
                Start Planning for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-white/50">No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTABanner
