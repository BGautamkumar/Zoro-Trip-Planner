import { 
  Globe2, 
  Heart, 
  Sparkles, 
  Users, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Check, 
  X, 
  Compass, 
  RefreshCw, 
  Star, 
  BarChart3, 
  Shield 
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import Footer from "../_components/Footer"

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover the Zoro Trip Planner difference. Learn how our AI-powered travel intelligence replaces manual planning chaos with unified trip blueprints.",
  openGraph: {
    title: "About Zoro Trip Planner — The Future of Travel",
    description: "We are transforming travel planning. Compare the manual tabs apocalypse with the Zoro AI Engine.",
  },
};

const pillars = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Multi-Vector AI Synthesis",
    description: "Zoro doesn't just wrap prompts. Our system parses, structures, and cross-references schedule nodes, hotel cards, and travel times into a cohesive itinerary.",
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Real Budget Calculation",
    description: "No more guessing stay or activity costs. Zoro computes localized budget projections categorized by dining, hotel tiers, transit, and sightseeing.",
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: "Dynamic Visual Mapping",
    description: "Never travel blind. Every generated destination incorporates direct coordinate matching, authentic imagery databases, and integrated route geometry.",
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Instant Portability",
    description: "Take your plans anywhere. Generate offline-ready PDF blueprints, sync routes, or share instantly with travel companions using dynamic QR layouts.",
    color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  },
]

const stats = [
  { value: "15,000+", label: "Trips Created" },
  { value: "15 Seconds", label: "Avg. Generation Speed" },
  { value: "10,000+", label: "Destinations Covered" },
  { value: "4.9 ★", label: "User Satisfaction" },
]

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-950 dark:text-white transition-colors duration-300">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32 z-0">
        {/* Premium Dark Mesh Grid Background */}
        <div className="absolute inset-0 bg-deep dark:bg-gray-950 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--color-deep-light),transparent_60%)] -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(27,154,170,0.2),transparent_60%)] -z-10" />
        
        {/* Floating background grids */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Copy */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="animate-reveal-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 text-white text-sm font-semibold border border-white/20 dark:border-white/10 backdrop-blur-md">
                <Compass className="h-4 w-4 text-ocean-light animate-spin" style={{ animationDuration: '8s' }} />
                <span>The Zoro Thesis</span>
              </div>
              
              <h1 className="animate-reveal-up stagger-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                From 20 scattered tabs to{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-ocean-light via-gold to-gold-light">
                  one perfect blueprint
                </span>
              </h1>
              
              <p className="animate-reveal-up stagger-2 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Planning a trip shouldn't feel like a part-time job. Zoro brings together AI intelligence, precise routing, localized pricing, and weather insights to synthesize complex travel routes in 15 seconds.
              </p>
              
              <div className="animate-reveal-up stagger-3 flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/create-new-trip?mode=create"
                  className="bg-linear-to-r from-deep-light via-ocean to-ocean-light text-white rounded-full px-8 py-4 text-base font-bold shadow-xl shadow-ocean/20 hover:shadow-2xl hover:shadow-ocean/35 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                >
                  Plan Your Trip
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a 
                  href="#why-zoro"
                  className="bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-full px-8 py-4 text-base font-semibold border border-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  Learn the Difference
                </a>
              </div>
            </div>

            {/* Premium CSS Interactive Mockup */}
            <div className="lg:col-span-5 animate-reveal-scale stagger-2">
              <div className="relative glass-dark border border-white/15 rounded-3xl p-6 shadow-2xl shadow-deep-dark/50 bg-slate-900/60 dark:bg-black/60 backdrop-blur-xl">
                
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest">ZORO ENGINE V2</span>
                </div>

                {/* Mock Card contents */}
                <div className="space-y-4 text-left">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-ocean-light font-bold uppercase tracking-wider">Active Query</span>
                        <h4 className="text-base font-bold text-white mt-0.5">7 Days in Kyoto & Osaka</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Generated</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/70">🎌 Cultural</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/70">💸 Moderate</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/70">👫 2 Travelers</span>
                    </div>
                  </div>

                  {/* Mock Steps */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-white/90">
                      <div className="w-6 h-6 rounded-full bg-ocean/20 text-ocean-light text-xs font-bold flex items-center justify-center">1</div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold">Synthesizing Local Attractions</p>
                        <p className="text-white/40 text-[10px]">Fushimi Inari, Kinkaku-ji, Gion district</p>
                      </div>
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-white/90">
                      <div className="w-6 h-6 rounded-full bg-ocean/20 text-ocean-light text-xs font-bold flex items-center justify-center">2</div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold">Coordinating Hotel Tiers</p>
                        <p className="text-white/40 text-[10px]">Comparing 3 verified stays near transit</p>
                      </div>
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-white/90">
                      <div className="w-6 h-6 rounded-full bg-ocean/20 text-ocean-light text-xs font-bold flex items-center justify-center">3</div>
                      <div className="flex-1 text-xs text-white/40">
                        <p className="font-semibold">Plotting Route Budgets & Forecasts</p>
                        <p className="text-[10px]">Calculating transit costs & local forecasts</p>
                      </div>
                      <RefreshCw className="h-3.5 w-3.5 text-ocean-light animate-spin" />
                    </div>
                  </div>

                  {/* Budget Tracker UI Mock */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/70">Projected Total Cost</span>
                      <span className="font-bold text-gold">₹1,25,000 INR</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-linear-to-r from-ocean to-gold h-full rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>

                {/* Background glow behind browser mock */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-ocean/30 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-deep-light/40 rounded-full blur-3xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROBLEM VS SOLUTION (THE CONTRAST) ── */}
      <section id="why-zoro" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-ocean">
              How We Differ
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
              The Planning Apocalypse vs.{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-deep dark:from-white to-ocean">
                The Zoro Way
              </span>
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Why spend days coordinating logistics when AI can synthesize an intelligent layout in seconds?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* The Old Way */}
            <div className="rounded-3xl p-8 bg-slate-50 dark:bg-gray-900 border border-rose-200/50 dark:border-rose-950/20 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-6">
                  <X className="h-3.5 w-3.5" />
                  Manual Research
                </div>
                
                <h4 className="text-2xl font-bold mb-4">The Chaotic Traditional Way</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Planning a trip traditionally involves browsing scattered directories, guessing distances, and feeling overwhelmed by information overload.
                </p>

                <ul className="space-y-4 text-left">
                  {[
                    "20+ open browser tabs comparing flights, stays, and reviews.",
                    "Excel sheets to manually copy paste addresses, links, and times.",
                    "Estimating budgets blindly or relying on outdated forum posts.",
                    "Research fatigue that makes you exhausted before the trip begins."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 pt-8 border-t border-rose-100 dark:border-rose-950/30 text-xs font-semibold text-rose-500">
                Time required: 6 to 12 Hours
              </div>
            </div>

            {/* The Zoro Way */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-ocean/5 via-transparent to-transparent border-2 border-ocean/40 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-ocean/5">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6">
                  <Check className="h-3.5 w-3.5" />
                  Zoro AI Engine
                </div>
                
                <h4 className="text-2xl font-bold mb-4">The Streamlined Zoro Blueprint</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  A dynamic, unified travel blueprint crafted instantly based on your budget, style, and real-world coordinates.
                </p>

                <ul className="space-y-4 text-left">
                  {[
                    "One simple prompt captures flights, hotels, and maps.",
                    "Localized cost datasets calculate real, verified budgets automatically.",
                    "Fully dynamic mapping with coordinate links and real location images.",
                    "Generation in 15 seconds with seamless QR/PDF exports."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-emerald-100 dark:border-emerald-950/30 text-xs font-semibold text-emerald-500">
                Time required: 15 Seconds
              </div>
              
              {/* Subtle background pulse glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-ocean/10 rounded-full blur-2xl -z-10" />
            </div>

          </div>

        </div>
      </section>

      {/* ── METRICS SHOWCASE ── */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,var(--color-deep-light),transparent_80%) -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2 text-center animate-reveal-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-ocean-light to-gold">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-slate-400 font-semibold tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SAAS PILLARS ── */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-ocean">
              Product Capabilities
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Under the Hood of Zoro
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Not just template generations. Our platform orchestrates several intelligence vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-ocean/20 transition-all duration-300 flex items-start gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${pillar.color}`}>
                  {pillar.icon}
                </div>
                <div className="space-y-2 text-left">
                  <h4 className="text-lg font-bold group-hover:text-ocean transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── HUMAN ELEMENT / MISSION ── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Mission Copy */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-deep-light/10 to-ocean/10 text-ocean dark:text-ocean-light text-xs font-semibold">
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>Our Purpose</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Designed for spontaneous minds
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                <p>
                  Zoro was founded by a small group of software engineers and travel writers who got tired of spending hours planning itineraries instead of actually walking the streets of Kyoto, dining in Rome, or navigating Tokyo's subways.
                </p>
                <p>
                  We believe that the best journeys have structure but leave space for discovery. By offloading scheduling constraints, budget formulas, and research lookup to AI, you get back the energy to enjoy the adventure.
                </p>
                <p>
                  We are obsessed with speed, interface beauty, and reliability. Every line of code we write is focused on making your travel dreams materialize instantly.
                </p>
              </div>
            </div>

            {/* Decorative Visual Card */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-linear-to-tr from-deep to-ocean p-1 shadow-2xl shadow-ocean/10 overflow-hidden group">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[22px] p-8 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <span className="text-3xl">✈️</span>
                    <h4 className="text-2xl font-bold">100% Free to Use</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Zoro is funded by partner recommendations and travel service integrations. Our AI itinerary generation is, and always will be, free for everyone.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-orange-400 flex items-center justify-center text-xs">🧑</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-teal-400 flex items-center justify-center text-xs">👱‍♀️</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-indigo-400 flex items-center justify-center text-xs">👨</div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Join 2,500+ monthly active planners</span>
                  </div>
                </div>
              </div>
              {/* Background blurs */}
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-ocean/20 rounded-full blur-2xl -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* ── PREMIUM CTA BANNER ── */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-deep via-deep-light to-ocean p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to build your next adventure?
              </h3>
              <p className="text-slate-200 text-base md:text-lg">
                Enter your target location, budget category, and traveler count — and let Zoro formulate your optimal journey.
              </p>
              <div className="pt-2">
                <Link 
                  href="/create-new-trip?mode=create"
                  className="inline-flex items-center gap-2 bg-white text-deep font-bold rounded-full px-8 py-4 shadow-xl hover:shadow-2xl hover:scale-102 transition-all duration-300"
                >
                  Start Planning Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-light/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
