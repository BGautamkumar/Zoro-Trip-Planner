'use client';

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Utensils,
  Bus,
  Lightbulb,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";

import { useTripDetail } from "@/app/Provider";
import { validateAITripData, ValidatedTripInfo, ValidatedItinerary } from "@/lib/ai-data-validator";
import { useImageBatch } from "@/hooks/useImageBatch";
import { calculateTripBudget, formatBudgetAmount } from "@/lib/trip-budget-calculator";
import { WeatherWidget } from "@/components/trip/WeatherWidget";

// ── Day Card Component ──────────────────────────────────

interface DayCardProps {
  day: ValidatedItinerary;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  getImage: (name: string) => string;
  currency: string;
  destination: string;
  totalDays: number;
}

function DayCard({ day, index, isExpanded, onToggle, getImage, currency, destination, totalDays }: DayCardProps) {
  const activityCount = day.activities?.length || 0;

  // Calculate day cost
  const dayCost = (day.activities || []).reduce((sum, a) => {
    const match = a.ticket_pricing?.match(/([\d,]+(?:\.\d+)?)/);
    return sum + (match ? parseFloat(match[1].replace(/,/g, '')) : 0);
  }, 0);

  return (
    <div className="relative">
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-4 w-0.5 h-4 bg-gradient-to-b from-ocean/30 to-ocean/10" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        {/* Day Header — Always visible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            {/* Day number badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep to-ocean flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              {day.day}
            </div>
            <div>
              <h3 className="font-bold text-deep dark:text-white text-lg">
                Day {day.day}
                {day.day_plan && (
                  <span className="text-gray-400 font-normal text-sm ml-2">— {day.day_plan}</span>
                )}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activityCount} activities
                </span>
                {day.best_time_to_visit_day && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {day.best_time_to_visit_day}
                  </span>
                )}
                {dayCost > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <IndianRupee className="w-3 h-3" />
                    ~{formatBudgetAmount(dayCost, currency)}
                  </span>
                )}
                <WeatherWidget
                  destination={destination}
                  days={totalDays}
                  dayIndex={day.day - 1}
                  compact
                />
              </div>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isExpanded ? 'bg-ocean/10 text-ocean' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
          }`}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {/* Day Content — Expandable */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-5">
                {/* Must-try food & transport tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {day.must_try_food && day.must_try_food?.length > 0 && (
                    <div className="flex items-start gap-2.5 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                      <Utensils className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-0.5">Must Try Food</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {(day.must_try_food || []).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {day.local_transport && (
                    <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <Bus className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-0.5">Local Transport</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {day.local_transport}
                        </p>
                      </div>
                    </div>
                  )}

                  {day.travel_tips && day.travel_tips?.length > 0 && (
                    <div className="flex items-start gap-2.5 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl sm:col-span-2">
                      <Lightbulb className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5">Travel Tips</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {(day.travel_tips || []).join(' • ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activities grid */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Activities & Places
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(day.activities || []).map((activity, idx) => {
                      const imageKey = activity.place_address
                        ? `${activity.place_name}:${activity.place_address}`
                        : activity.place_name;
                      return (
                        <PlaceCardItem
                          key={activity.place_name ?? idx}
                          activity={activity}
                          photoUrl={getImage(imageKey)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Day hotels */}
                {day.suggested_hotels && day.suggested_hotels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Recommended Hotels for Day {day.day}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.suggested_hotels.map((hotel, idx) => (
                        <HotelCardItem
                          key={hotel.hotel_name ?? idx}
                          hotel={hotel}
                          photoUrl={getImage(hotel.hotel_name)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Main Itinerary Component ─────────────────────────────

function Itinerary() {
  const tripContext = useTripDetail();
  const tripDetailInfo = tripContext?.tripDetailInfo;

  const tripData = useMemo<ValidatedTripInfo | null>(() => {
    if (!tripDetailInfo) return null;
    return validateAITripData(tripDetailInfo);
  }, [tripDetailInfo]);

  // Batch image loading
  const { getImage, isLoading: imagesLoading } = useImageBatch(tripData);

  // Budget calculation
  const budget = useMemo(() => {
    if (!tripData) return null;
    return calculateTripBudget(tripData);
  }, [tripData]);

  // Expand state: first day expanded by default
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dayNum)) {
        next.delete(dayNum);
      } else {
        next.add(dayNum);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allDays = new Set((tripData?.itinerary || []).map(d => d.day));
    setExpandedDays(allDays);
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  if (!tripData) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl">
        <Image
          src="/newtravel.jpg"
          alt="travel"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="flex gap-2 items-center text-2xl sm:text-3xl text-white font-bold">
            <ArrowLeft />
            Getting to know you to build the perfect trip...
          </h2>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Answer Zoro&apos;s questions and your personalized itinerary will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[85vh] overflow-x-hidden space-y-6">
      {/* Trip Summary Header */}
      <div className="bg-gradient-to-r from-deep to-ocean rounded-2xl p-6 text-white shadow-xl shadow-ocean/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {tripData.destination}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {tripData.duration} • {tripData.group_size} • {tripData.budget} budget
              {tripData.origin && ` • From ${tripData.origin}`}
            </p>
          </div>
          {budget && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-white/70 uppercase tracking-wider">Est. Total</p>
              <p className="text-2xl font-bold">{formatBudgetAmount(budget.total, budget.currency)}</p>
            </div>
          )}
        </div>

        {/* Budget mini-breakdown */}
        {budget && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Hotels', value: budget.hotels, icon: '🏨' },
              { label: 'Food', value: budget.food, icon: '🍽️' },
              { label: 'Transport', value: budget.transport, icon: '🚗' },
              { label: 'Activities', value: budget.activities, icon: '🎯' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs text-white/70 mt-1">{item.label}</p>
                <p className="text-sm font-bold">{formatBudgetAmount(item.value, budget.currency)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Weather forecast */}
        <div className="mt-4">
          <WeatherWidget
            destination={tripData.destination}
            days={tripData.itinerary?.length || 5}
            showAll
          />
        </div>
      </div>

      {/* Hotels Section */}
      {tripData.hotels && tripData.hotels.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-deep dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🏨</span>
            Recommended Hotels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tripData.hotels.map((hotel, index) => (
              <HotelCardItem
                key={hotel.hotel_name ?? index}
                hotel={hotel}
                photoUrl={getImage(hotel.hotel_name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Itinerary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-deep dark:text-white flex items-center gap-2">
            <span className="text-xl">📅</span>
            Day-by-Day Itinerary
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-ocean hover:text-ocean-dark font-medium transition-colors"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {(tripData.itinerary || []).map((day, index) => (
            <DayCard
              key={day.day}
              day={day}
              index={index}
              isExpanded={expandedDays.has(day.day)}
              onToggle={() => toggleDay(day.day)}
              getImage={getImage}
              currency={budget?.currency || 'INR'}
              destination={tripData.destination}
              totalDays={tripData.itinerary?.length || 5}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
