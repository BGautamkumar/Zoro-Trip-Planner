"use client"
import React, { useState, useMemo } from 'react'
import { Sparkles, Send, ChevronRight, ChevronDown, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ValidatedTripInfo } from '@/lib/ai-data-validator'
import { calculateTripBudget, formatBudgetAmount, formatBudgetAmountFull, BudgetBreakdown, DailyBudget } from '@/lib/trip-budget-calculator'

interface AIAssistantPanelProps {
  tripData: ValidatedTripInfo;
  isMobile?: boolean;
}

const aiPrompts = [
  { icon: <TrendingDown className="w-4 h-4" />, label: "Make itinerary cheaper" },
  { icon: <TrendingUp className="w-4 h-4" />, label: "Add adventure activities" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Add hidden gems" },
]

// ── Budget Donut Chart (pure CSS) ──
function BudgetDonut({ budget }: { budget: BudgetBreakdown }) {
  const total = budget.total || 1;
  const segments = [
    { label: 'Hotels', value: budget.hotels, color: '#8B5CF6' },
    { label: 'Food', value: budget.food, color: '#F97316' },
    { label: 'Transport', value: budget.transport, color: '#3B82F6' },
    { label: 'Activities', value: budget.activities, color: '#10B981' },
  ];

  // Calculate conic-gradient stops
  let cumulative = 0;
  const gradientStops = segments.map(seg => {
    const start = cumulative;
    const pct = (seg.value / total) * 100;
    cumulative += pct;
    return `${seg.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-20 h-20 rounded-full shrink-0 relative"
        style={{
          background: `conic-gradient(${gradientStops})`,
        }}
      >
        <div className="absolute inset-2.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {formatBudgetAmount(seg.value, budget.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Daily Breakdown Row ──
function DailyRow({ day, currency }: { day: DailyBudget; currency: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-ocean/10 text-ocean font-bold flex items-center justify-center text-[10px]">
          {day.day}
        </span>
        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
          {day.dayPlan || `Day ${day.day}`}
        </span>
      </div>
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        {formatBudgetAmount(day.total, currency)}
      </span>
    </div>
  );
}

export default function AIAssistantPanel({ tripData, isMobile = false }: AIAssistantPanelProps) {
  const [query, setQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const [showDailyBreakdown, setShowDailyBreakdown] = useState(false)

  // Real budget calculation from trip data
  const budget = useMemo<BudgetBreakdown>(() => {
    return calculateTripBudget(tripData);
  }, [tripData]);

  const handlePromptClick = (label: string) => {
    setQuery(label)
    setIsTyping(true)
    // TODO: Wire to actual AI endpoint for itinerary modification
    setTimeout(() => {
      setIsTyping(false)
      setQuery('')
    }, 1500)
  }

  return (
    <div className={`flex flex-col gap-4 ${isMobile ? 'h-auto' : 'h-[calc(100vh-8rem)] sticky top-24'}`}>

      {/* ── Budget Intelligence Card ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-deep dark:text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-ocean" />
            Trip Budget Estimate
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              budget.confidence === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              budget.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {budget.confidence} confidence
            </span>
          </div>
        </div>

        {/* Donut chart */}
        <BudgetDonut budget={budget} />

        {/* Total */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-deep dark:text-white">Estimated Total</span>
          <span className="text-xl font-bold text-ocean">
            {formatBudgetAmountFull(budget.total, budget.currency)}
          </span>
        </div>

        {/* Per person */}
        {tripData?.group_size && (
          <p className="text-[10px] text-gray-400 text-right mt-1">
            Based on {tripData.budget || 'moderate'} budget • {tripData.group_size}
          </p>
        )}

        {/* Daily breakdown toggle */}
        {budget.perDay.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowDailyBreakdown(!showDailyBreakdown)}
              className="flex items-center gap-1 text-xs text-ocean hover:text-ocean-dark font-medium transition-colors"
            >
              {showDailyBreakdown ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Daily breakdown
            </button>

            {showDailyBreakdown && (
              <div className="mt-2 max-h-48 overflow-y-auto scrollbar-thin">
                {budget.perDay.map(day => (
                  <DailyRow key={day.day} day={day} currency={budget.currency} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── AI Assistant Panel ── */}
      <div className="bg-gradient-to-b from-deep-dark/5 to-ocean/5 dark:from-deep-dark/50 dark:to-gray-900/50 rounded-2xl flex-1 flex flex-col overflow-hidden border border-ocean/10 shadow-inner">

        {/* Header */}
        <button
          onClick={() => isMobile && setIsExpanded(!isExpanded)}
          className={`p-4 border-b border-ocean/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex items-center justify-between text-left ${isMobile ? 'cursor-pointer hover:bg-white/60 dark:hover:bg-gray-900/60' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep to-ocean flex items-center justify-center shadow-lg shadow-ocean/20 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-deep dark:text-white">
                Zoro AI Assistant
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                Optimize & customize your itinerary
              </p>
            </div>
          </div>
          {isMobile && (
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <>
            {/* Prompts Area */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 max-h-[40vh] lg:max-h-none">
              <div className="space-y-2">
                {aiPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt.label)}
                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-ocean/30 hover:shadow-md transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-ocean transition-colors">
                      <span className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-ocean group-hover:bg-ocean/10">
                        {prompt.icon}
                      </span>
                      {prompt.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>

              {isTyping && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-ocean" />
                  Zoro is updating your itinerary...
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="relative flex items-center">
                <Input
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Ask Zoro anything..."
                  className="pr-10 text-sm rounded-full border-gray-200 dark:border-gray-700 focus-visible:ring-ocean shadow-sm"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handlePromptClick(query)}
                />
                <Button
                  size="icon"
                  className="absolute right-1 w-7 h-7 rounded-full bg-ocean hover:bg-ocean-dark text-white transition-colors"
                  onClick={() => handlePromptClick(query)}
                  disabled={!query.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
