'use client';

import React, { useMemo, useState } from 'react';
import { BarChart3, PieChart, TrendingDown, TrendingUp, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import { BudgetBreakdown, DailyBudget, formatBudgetAmount, formatBudgetAmountFull } from '@/lib/trip-budget-calculator';

interface BudgetDashboardProps {
  budget: BudgetBreakdown;
  compact?: boolean;
}

const CATEGORY_COLORS = {
  Hotels: { bg: '#8B5CF6', light: 'bg-violet-100 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
  Food: { bg: '#F97316', light: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
  Transport: { bg: '#3B82F6', light: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  Activities: { bg: '#10B981', light: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
};

type CategoryKey = keyof typeof CATEGORY_COLORS;

// ── Donut Chart ──
function DonutChart({ budget }: { budget: BudgetBreakdown }) {
  const total = budget.total || 1;
  const segments = [
    { label: 'Hotels' as CategoryKey, value: budget.hotels },
    { label: 'Food' as CategoryKey, value: budget.food },
    { label: 'Transport' as CategoryKey, value: budget.transport },
    { label: 'Activities' as CategoryKey, value: budget.activities },
  ];

  let cumulative = 0;
  const gradientStops = segments.map(seg => {
    const start = cumulative;
    const pct = (seg.value / total) * 100;
    cumulative += pct;
    return `${CATEGORY_COLORS[seg.label].bg} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="flex items-center gap-5">
      <div
        className="w-28 h-28 rounded-full shrink-0 relative shadow-inner"
        style={{ background: `conic-gradient(${gradientStops})` }}
      >
        <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
          <span className="text-lg font-bold text-deep dark:text-white">
            {formatBudgetAmount(budget.total, budget.currency)}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {segments.map(seg => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={seg.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CATEGORY_COLORS[seg.label].bg }} />
                  {seg.label}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatBudgetAmount(seg.value, budget.currency)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[seg.label].bg }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Daily Spending Bar Chart ──
function DailySpendingChart({ perDay, currency }: { perDay: DailyBudget[]; currency: string }) {
  const maxTotal = Math.max(...perDay.map(d => d.total), 1);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
        <BarChart3 className="w-4 h-4 text-ocean" />
        Daily Spending
      </h4>
      <div className="flex items-end gap-1.5 h-32">
        {perDay.map((day) => {
          const heightPct = (day.total / maxTotal) * 100;
          const segments = [
            { value: day.hotels, color: CATEGORY_COLORS.Hotels.bg },
            { value: day.food, color: CATEGORY_COLORS.Food.bg },
            { value: day.transport, color: CATEGORY_COLORS.Transport.bg },
            { value: day.activities, color: CATEGORY_COLORS.Activities.bg },
          ];

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1 group">
              {/* Bar */}
              <div className="w-full relative group-hover:opacity-90 transition-opacity" style={{ height: `${heightPct}%` }}>
                <div className="w-full h-full rounded-t-lg overflow-hidden flex flex-col-reverse">
                  {segments.map((seg, i) => {
                    const segPct = day.total > 0 ? (seg.value / day.total) * 100 : 0;
                    return (
                      <div
                        key={i}
                        style={{ height: `${segPct}%`, backgroundColor: seg.color }}
                        className="w-full transition-all duration-500"
                      />
                    );
                  })}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {formatBudgetAmount(day.total, currency)}
                </div>
              </div>

              {/* Day label */}
              <span className="text-[10px] font-medium text-gray-400">
                D{day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export function BudgetDashboard({ budget, compact = false }: BudgetDashboardProps) {
  const [expanded, setExpanded] = useState(!compact);

  // Find highest/lowest spend days
  const stats = useMemo(() => {
    if (budget.perDay.length === 0) return null;
    const sorted = [...budget.perDay].sort((a, b) => a.total - b.total);
    return {
      cheapestDay: sorted[0],
      priciest: sorted[sorted.length - 1],
      avgDaily: Math.round(budget.total / budget.perDay.length),
    };
  }, [budget]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-deep dark:text-white">Budget Dashboard</h3>
            <p className="text-xs text-gray-500">
              Estimated: <span className="font-semibold text-ocean">{formatBudgetAmountFull(budget.total, budget.currency)}</span>
              {' '}·{' '}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                budget.confidence === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                budget.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-gray-100 text-gray-600'
              }`}>
                {budget.confidence} confidence
              </span>
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-6">
          {/* Donut chart */}
          <DonutChart budget={budget} />

          {/* Daily spending bar chart */}
          {budget.perDay.length > 1 && (
            <DailySpendingChart perDay={budget.perDay} currency={budget.currency} />
          )}

          {/* Quick stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                <IndianRupee className="w-4 h-4 text-ocean mx-auto mb-1" />
                <p className="text-xs text-gray-500">Avg/Day</p>
                <p className="text-sm font-bold text-deep dark:text-white">
                  {formatBudgetAmount(stats.avgDaily, budget.currency)}
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl text-center">
                <TrendingDown className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Cheapest</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  Day {stats.cheapestDay.day}
                </p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl text-center">
                <TrendingUp className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Priciest</p>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Day {stats.priciest.day}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetDashboard;
