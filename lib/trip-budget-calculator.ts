/**
 * Trip Budget Calculator
 * Computes real budget breakdowns from AI-generated trip data.
 * Replaces the hardcoded mock calculations.
 */

import { ValidatedTripInfo, ValidatedItinerary, ValidatedActivity, ValidatedHotel } from './ai-data-validator';

// ─── Types ──────────────────────────────────────────────

export interface BudgetBreakdown {
  hotels: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
  currency: string;
  perDay: DailyBudget[];
  confidence: 'high' | 'medium' | 'low';
}

export interface DailyBudget {
  day: number;
  dayPlan: string;
  hotels: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

// ─── Currency Parsing ───────────────────────────────────

const CURRENCY_PATTERNS: Record<string, RegExp> = {
  USD: /\$\s*([\d,]+(?:\.\d{1,2})?)/,
  EUR: /€\s*([\d,]+(?:\.\d{1,2})?)/,
  GBP: /£\s*([\d,]+(?:\.\d{1,2})?)/,
  INR: /₹\s*([\d,]+(?:\.\d{1,2})?)|(?:Rs\.?\s*([\d,]+(?:\.\d{1,2})?))|(?:INR\s*([\d,]+(?:\.\d{1,2})?))/i,
  JPY: /¥\s*([\d,]+)|(?:JPY\s*([\d,]+))/i,
  AED: /(?:AED\s*([\d,]+(?:\.\d{1,2})?))|(?:Dhs?\s*([\d,]+(?:\.\d{1,2})?))/i,
  THB: /(?:THB\s*([\d,]+(?:\.\d{1,2})?))|(?:฿\s*([\d,]+(?:\.\d{1,2})?))/i,
};

// Rough conversion rates to INR for normalization (1 unit of currency to INR)
const TO_INR: Record<string, number> = {
  INR: 1,
  USD: 83.5,
  EUR: 90.0,
  GBP: 105.0,
  JPY: 0.53,
  AED: 22.7,
  THB: 2.3,
  UNKNOWN: 1,
};

/**
 * Extracts a numeric value from a price string like "$50", "€30-50", "₹500", "Free"
 */
export function parsePriceString(priceStr: string): { amount: number; currency: string } {
  if (!priceStr || typeof priceStr !== 'string') {
    return { amount: 0, currency: 'INR' };
  }

  const lower = priceStr.toLowerCase().trim();

  // Handle free/complimentary
  if (lower === 'free' || lower === 'free entry' || lower === 'no charge' || lower === 'complimentary') {
    return { amount: 0, currency: 'INR' };
  }

  // Handle ranges like "$50 - $100" or "$50-100" — take the midpoint
  const rangeMatch = priceStr.match(/(\d[\d,]*(?:\.\d+)?)\s*[-–to]+\s*(\d[\d,]*(?:\.\d+)?)/);

  // Try each currency pattern
  for (const [currency, pattern] of Object.entries(CURRENCY_PATTERNS)) {
    const match = priceStr.match(pattern);
    if (match) {
      // Find the first non-undefined capture group
      const valueStr = match.slice(1).find(v => v !== undefined) || '0';
      let amount = parseFloat(valueStr.replace(/,/g, ''));

      // If we found a range, use midpoint
      if (rangeMatch) {
        const low = parseFloat(rangeMatch[1].replace(/,/g, ''));
        const high = parseFloat(rangeMatch[2].replace(/,/g, ''));
        amount = (low + high) / 2;
      }

      return { amount: isNaN(amount) ? 0 : amount, currency };
    }
  }

  // Fallback: try to extract any number
  const numMatch = priceStr.match(/([\d,]+(?:\.\d+)?)/);
  if (numMatch) {
    const amount = parseFloat(numMatch[1].replace(/,/g, ''));
    return { amount: isNaN(amount) ? 0 : amount, currency: 'INR' };
  }

  return { amount: 0, currency: 'INR' };
}

/**
 * Normalize a price to INR for consistent totals
 */
function toINR(amount: number, currency: string): number {
  return amount * (TO_INR[currency] || 1);
}

// ─── Budget Estimation Defaults (in INR) ─────────────────

const BUDGET_DEFAULTS: Record<string, { foodPerDay: number; transportPerDay: number }> = {
  cheap: { foodPerDay: 2000, transportPerDay: 1200 },
  low: { foodPerDay: 2000, transportPerDay: 1200 },
  budget: { foodPerDay: 2000, transportPerDay: 1200 },
  moderate: { foodPerDay: 4000, transportPerDay: 2500 },
  medium: { foodPerDay: 4000, transportPerDay: 2500 },
  high: { foodPerDay: 8000, transportPerDay: 4000 },
  luxury: { foodPerDay: 12000, transportPerDay: 6000 },
};

function getBudgetDefaults(budgetLevel: string): { foodPerDay: number; transportPerDay: number } {
  const key = budgetLevel.toLowerCase().trim();
  return BUDGET_DEFAULTS[key] || BUDGET_DEFAULTS.moderate;
}

// ─── Main Calculator ────────────────────────────────────

export function calculateTripBudget(tripData: ValidatedTripInfo): BudgetBreakdown {
  const defaults = getBudgetDefaults(tripData.budget);
  const numDays = tripData.itinerary?.length || 1;
  let detectedCurrency = 'INR';
  let totalConfidence: 'high' | 'medium' | 'low' = 'medium';

  // Calculate per-day budgets
  const perDay: DailyBudget[] = (tripData.itinerary || []).map((day) => {
    const dailyBudget = calculateDayBudget(day, defaults, tripData.hotels);

    return {
      day: day.day,
      dayPlan: day.day_plan,
      hotels: dailyBudget.hotels,
      food: dailyBudget.food,
      transport: dailyBudget.transport,
      activities: dailyBudget.activities,
      total: dailyBudget.hotels + dailyBudget.food + dailyBudget.transport + dailyBudget.activities,
    };
  });

  // Aggregate totals
  const totals = perDay.reduce(
    (acc, day) => ({
      hotels: acc.hotels + day.hotels,
      food: acc.food + day.food,
      transport: acc.transport + day.transport,
      activities: acc.activities + day.activities,
    }),
    { hotels: 0, food: 0, transport: 0, activities: 0 }
  );

  const total = totals.hotels + totals.food + totals.transport + totals.activities;

  // Determine confidence based on how much data was parsed vs defaulted
  const hasRealHotelPrices = tripData.hotels?.some(h => {
    const p = parsePriceString(h.price_per_night);
    return p.amount > 0;
  });
  const hasRealActivityPrices = tripData.itinerary?.some(day =>
    day.activities?.some(a => {
      const p = parsePriceString(a.ticket_pricing);
      return p.amount > 0;
    })
  );

  if (hasRealHotelPrices && hasRealActivityPrices) {
    totalConfidence = 'high';
  } else if (hasRealHotelPrices || hasRealActivityPrices) {
    totalConfidence = 'medium';
  } else {
    totalConfidence = 'low';
  }

  return {
    hotels: Math.round(totals.hotels),
    food: Math.round(totals.food),
    transport: Math.round(totals.transport),
    activities: Math.round(totals.activities),
    total: Math.round(total),
    currency: detectedCurrency,
    perDay,
    confidence: totalConfidence,
  };
}

// ─── Per-Day Calculation ────────────────────────────────

interface DayBudgetInternal {
  hotels: number;
  food: number;
  transport: number;
  activities: number;
  _detectedCurrency?: string;
}

function calculateDayBudget(
  day: ValidatedItinerary,
  defaults: { foodPerDay: number; transportPerDay: number },
  globalHotels: ValidatedHotel[]
): DayBudgetInternal {
  let detectedCurrency: string | undefined;

  // ── Hotel cost for this day ──
  let hotelCost = 0;
  const dayHotels = day.suggested_hotels?.length ? day.suggested_hotels : globalHotels;
  if (dayHotels?.length) {
    // Use the first (cheapest recommended) hotel
    const hotel = dayHotels[0];
    const parsed = parsePriceString(hotel.price_per_night);
    hotelCost = toINR(parsed.amount, parsed.currency);
    if (parsed.currency !== 'INR') detectedCurrency = parsed.currency;
  }

  // ── Activity costs ──
  let activityCost = 0;
  let foodActivities = 0;
  let transportActivities = 0;

  (day.activities || []).forEach((activity) => {
    const parsed = parsePriceString(activity.ticket_pricing);
    const amountINR = toINR(parsed.amount, parsed.currency);
    if (parsed.currency !== 'INR') detectedCurrency = parsed.currency;

    // Categorize by activity type
    const nameLower = (activity.place_name + ' ' + activity.place_details).toLowerCase();

    if (isFood(nameLower)) {
      foodActivities += amountINR;
    } else if (isTransport(nameLower)) {
      transportActivities += amountINR;
    } else {
      activityCost += amountINR;
    }
  });

  // ── Food: use parsed food activities + default if not enough data ──
  const foodCost = foodActivities > 0 ? foodActivities : defaults.foodPerDay;

  // ── Transport: use parsed + default baseline ──
  const transportCost = transportActivities > 0
    ? transportActivities
    : defaults.transportPerDay;

  return {
    hotels: hotelCost,
    food: Math.round(foodCost),
    transport: Math.round(transportCost),
    activities: Math.round(activityCost),
    _detectedCurrency: detectedCurrency,
  };
}

// ─── Activity Type Detection ────────────────────────────

function isFood(text: string): boolean {
  const keywords = [
    'breakfast', 'lunch', 'dinner', 'restaurant', 'cafe', 'café',
    'food', 'eat', 'dining', 'meal', 'brunch', 'street food',
    'bakery', 'bistro', 'tavern', 'pub food', 'supper',
  ];
  return keywords.some(k => text.includes(k));
}

function isTransport(text: string): boolean {
  const keywords = [
    'travel to', 'transfer', 'taxi', 'uber', 'metro', 'bus',
    'train', 'flight', 'ferry', 'drive to', 'transit', 'commute',
    'airport', 'station',
  ];
  return keywords.some(k => text.includes(k));
}

// ─── Format Helpers ─────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
  AED: 'AED ', THB: '฿', UNKNOWN: '₹',
};

export function formatBudgetAmount(amount: number, currency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  // Use Indian Lakh (L) scale for amounts >= 1,00,000
  if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatBudgetAmountFull(amount: number, currency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
}
