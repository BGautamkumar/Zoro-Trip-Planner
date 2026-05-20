"use client"
import React, { useState } from 'react'
import { Sparkles, DollarSign, Activity, Moon, MapPin, Clock, Utensils, Send, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ValidatedTripInfo } from '@/lib/ai-data-validator'

interface AIAssistantPanelProps {
  tripData: ValidatedTripInfo;
  isMobile?: boolean;
}

const aiPrompts = [
  { icon: <DollarSign className="w-4 h-4" />, label: "Make itinerary cheaper" },
  { icon: <Activity className="w-4 h-4" />, label: "Add adventure activities" },
  { icon: <Moon className="w-4 h-4" />, label: "Add nightlife & bars" },
  { icon: <MapPin className="w-4 h-4" />, label: "Add hidden gems" },
  { icon: <Clock className="w-4 h-4" />, label: "Optimize travel time" },
  { icon: <Utensils className="w-4 h-4" />, label: "Add food recommendations" }
]

export default function AIAssistantPanel({ tripData, isMobile = false }: AIAssistantPanelProps) {
  const [query, setQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(!isMobile)

  const handlePromptClick = (label: string) => {
    setQuery(label)
    // Simulate AI response for the mock UI
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setQuery('')
    }, 1500)
  }

  const parseCost = (budgetStr: string) => {
    // Mock parsing logic to generate realistic-looking estimated totals based on budget string
    const base = budgetStr?.toLowerCase().includes('cheap') ? 500 : 
                 budgetStr?.toLowerCase().includes('luxury') ? 3500 : 1200;
    const transport = Math.round(base * 0.3);
    const hotels = Math.round(base * 0.4);
    const activities = Math.round(base * 0.3);
    return { transport, hotels, activities, total: transport + hotels + activities };
  }

  const estimatedCosts = parseCost(tripData?.budget || 'Moderate');

  return (
    <div className={`flex flex-col gap-6 ${isMobile ? 'h-auto' : 'h-[calc(100vh-8rem)] sticky top-24'}`}>
      
      {/* ── Budget Intelligence Card ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-deep dark:text-white mb-4 flex items-center justify-between">
          <span>Estimated Budget</span>
          <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{tripData?.budget || 'Moderate'}</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> Transport</span>
            <span className="font-medium">${estimatedCosts.transport}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Moon className="w-4 h-4 text-purple-500"/> Hotels</span>
            <span className="font-medium">${estimatedCosts.hotels}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4 text-orange-500"/> Activities</span>
            <span className="font-medium">${estimatedCosts.activities}</span>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="font-semibold text-deep dark:text-white">Live Total</span>
            <span className="text-xl font-bold text-ocean">${estimatedCosts.total}</span>
          </div>
        </div>
      </div>

      {/* ── AI Assistant Panel ── */}
      <div className="bg-linear-to-b from-deep-dark/5 to-ocean/5 dark:from-deep-dark/50 dark:to-gray-900/50 rounded-2xl flex-1 flex flex-col overflow-hidden border border-ocean/10 shadow-inner">
        
        {/* Header */}
        <button 
          onClick={() => isMobile && setIsExpanded(!isExpanded)}
          className={`p-5 border-b border-ocean/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex items-center justify-between text-left ${isMobile ? 'cursor-pointer hover:bg-white/60 dark:hover:bg-gray-900/60' : 'cursor-default'}`}
        >
          <div>
            <h3 className="font-semibold text-deep dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-deep to-ocean flex items-center justify-center shadow-lg shadow-ocean/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Zoro AI Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-10">
              Edit, optimize, or customize your itinerary instantly.
            </p>
          </div>
          {isMobile && (
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <>
            {/* Chat / Prompts Area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 max-h-[50vh] lg:max-h-none">
          <div className="space-y-3">
            {aiPrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handlePromptClick(prompt.label)}
                className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-ocean/30 hover:shadow-md transition-all duration-200 group flex items-center justify-between"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-ocean transition-colors">
                  <span className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-ocean group-hover:bg-ocean/10">
                    {prompt.icon}
                  </span>
                  {prompt.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>

          {isTyping && (
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 animate-pulse">
              <Sparkles className="w-4 h-4 text-ocean" />
              Zoro is updating your itinerary...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative flex items-center">
            <Input 
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Ask Zoro to change anything..." 
              className="pr-12 rounded-full border-gray-200 dark:border-gray-700 focus-visible:ring-ocean shadow-sm"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handlePromptClick(query)}
            />
            <Button 
              size="icon" 
              className="absolute right-1 w-8 h-8 rounded-full bg-ocean hover:bg-ocean-dark text-white transition-colors"
              onClick={() => handlePromptClick(query)}
              disabled={!query.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        </>
      )}

      </div>
    </div>
  )
}
