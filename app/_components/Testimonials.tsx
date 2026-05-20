"use client"
import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Frequent Traveler",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    quote: "Zoro turned 3 weeks of stressful spreadsheet planning into a 15-second joy. The itinerary was flawless, balancing famous sights with hidden local gems.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Digital Nomad",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote: "As someone who travels full-time, this tool is indispensable. It understands pacing, budget constraints, and geographical routing better than any human agent I've used.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Family Vacation Planner",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    quote: "Planning for a family of 5 usually ends in tears. Zoro crafted an itinerary that kept the kids entertained while still giving us parents the cultural experiences we wanted.",
    rating: 5
  }
];

const stats = [
  { value: "50,000+", label: "Trips Planned" },
  { value: "120+", label: "Countries Covered" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "10x", label: "Faster Planning" }
];

function Testimonials() {
  return (
    <section className="py-24 bg-surface dark:bg-gray-950 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ocean/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Trusted By Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 animate-reveal-up">
          {stats.map((stat, i) => (
            <div key={i} className={`text-center stagger-${i + 1}`}>
              <div className="text-4xl md:text-5xl font-bold text-deep dark:text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16 animate-reveal-up stagger-2">
          <h2 className="text-3xl md:text-4xl font-bold text-deep dark:text-white mb-4">
            Loved by travelers worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Don't just take our word for it. Here's what modern explorers have to say about their Zoro experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-deep/5 card-hover relative animate-reveal-up stagger-${index + 3}`}
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-ocean/10" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-surface dark:border-gray-800"
                />
                <div>
                  <h4 className="font-semibold text-deep dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
