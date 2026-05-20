import { Globe2, Heart, Sparkles, Users, MapPin, Zap } from "lucide-react"
import Image from "next/image"

const values = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-First Approach",
    description: "We believe artificial intelligence should make travel planning effortless, not complicated.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Traveler Obsessed",
    description: "Every feature we build starts with a simple question: does this make the trip better?",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: "Global Perspective",
    description: "We celebrate every culture and destination. Our AI understands local nuances worldwide.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Speed Matters",
    description: "From dream to itinerary in seconds. We obsess over making every interaction instant.",
    color: "from-orange-500 to-amber-400",
  },
]

const stats = [
  { value: "10K+", label: "Destinations" },
  { value: "2K+", label: "Happy Travelers" },
  { value: "15s", label: "Avg. Plan Time" },
  { value: "4.9★", label: "User Rating" },
]

function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-deep via-deep-light to-ocean -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,154,170,0.3),transparent_70%)] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 md:pt-44 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
              <Users className="h-3.5 w-3.5" />
              About Zoro
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              We're building the future of{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gold to-gold-light">
                travel planning
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
              Zoro was born from a simple frustration: planning a trip shouldn't take longer than the trip itself. We combined cutting-edge AI with deep travel expertise to create something truly different.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-xl shadow-deep/5 border border-gray-100 dark:border-gray-800">
                <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-deep dark:text-white mb-6 tracking-tight">
                Our{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
                  mission
                </span>
              </h2>
              <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Travel should be about discovery, not logistics. Yet millions of people spend hours — sometimes days — researching flights, comparing hotels, and stitching together itineraries from scattered blog posts.
                </p>
                <p>
                  Zoro eliminates that friction. Our AI understands your travel style, budget, and interests, then crafts a complete, personalized trip plan in seconds. It's like having a world-class travel agent who knows every destination intimately.
                </p>
                <p>
                  We're not just building an app — we're reimagining how people experience the world. Every trip planned through Zoro is a story waiting to unfold.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-deep/10">
                <div className="aspect-[4/3] bg-linear-to-br from-deep/5 to-ocean/5 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-deep to-ocean flex items-center justify-center shadow-xl">
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-deep dark:text-white">10,000+ Destinations</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Every corner of the globe, understood deeply by our AI</p>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -bottom-8 -right-8 w-[200px] h-[200px] bg-ocean/10 rounded-full blur-[80px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-surface dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-deep dark:text-white mb-4 tracking-tight">
              What drives us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide every decision we make at Zoro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 card-hover">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${value.color} flex items-center justify-center text-white mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-deep dark:text-white mb-2 group-hover:text-ocean transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
