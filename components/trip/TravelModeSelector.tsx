'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Heart, Users, PartyPopper, Briefcase } from 'lucide-react';

export type TravelMode = 'solo' | 'couple' | 'family' | 'friends' | 'business';

interface TravelModeOption {
  id: TravelMode;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  promptHint: string;
}

const TRAVEL_MODES: TravelModeOption[] = [
  {
    id: 'solo',
    label: 'Solo',
    subtitle: 'Self-discovery & flexibility',
    icon: <User className="w-5 h-5" />,
    gradient: 'from-violet-500 to-purple-600',
    promptHint: 'Solo traveler who values flexibility, unique experiences, and meeting locals. Include solo-friendly activities, safe neighborhoods, coworking cafes, and social hostels.',
  },
  {
    id: 'couple',
    label: 'Couple',
    subtitle: 'Romance & shared moments',
    icon: <Heart className="w-5 h-5" />,
    gradient: 'from-rose-500 to-pink-600',
    promptHint: 'Romantic couple trip. Include romantic restaurants, sunset spots, couples activities, spa experiences, scenic walks, and intimate dining.',
  },
  {
    id: 'family',
    label: 'Family',
    subtitle: 'Kid-friendly & comfortable',
    icon: <Users className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-600',
    promptHint: 'Family with children. Include kid-friendly attractions, family restaurants, parks, museums with interactive exhibits, comfortable hotels with family rooms, and manageable walking distances.',
  },
  {
    id: 'friends',
    label: 'Friends',
    subtitle: 'Adventure & nightlife',
    icon: <PartyPopper className="w-5 h-5" />,
    gradient: 'from-amber-500 to-orange-600',
    promptHint: 'Group of friends seeking adventure and fun. Include group activities, nightlife, adventure sports, group-friendly restaurants, rooftop bars, and memorable group experiences.',
  },
  {
    id: 'business',
    label: 'Business',
    subtitle: 'Efficiency & comfort',
    icon: <Briefcase className="w-5 h-5" />,
    gradient: 'from-slate-500 to-gray-700',
    promptHint: 'Business traveler who needs efficiency. Include business hotels with WiFi, restaurants near business districts, quick sightseeing options, airport transfer tips, and professional dining venues.',
  },
];

interface TravelModeSelectorProps {
  selectedMode: TravelMode | null;
  onSelectMode: (mode: TravelMode) => void;
  compact?: boolean;
}

export function TravelModeSelector({ selectedMode, onSelectMode, compact = false }: TravelModeSelectorProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {!compact && (
        <div className="text-center">
          <h3 className="text-lg font-bold text-deep dark:text-white">
            How are you traveling?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This helps Zoro personalize your itinerary
          </p>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-5 gap-2' : 'grid-cols-2 sm:grid-cols-5 gap-3'}`}>
        {TRAVEL_MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(mode.id)}
              className={`relative flex flex-col items-center ${compact ? 'p-2.5' : 'p-4'} rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-ocean bg-ocean/5 dark:bg-ocean/10 shadow-lg shadow-ocean/15'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="travel-mode-indicator"
                  className="absolute -top-1 -right-1 w-5 h-5 bg-ocean rounded-full flex items-center justify-center shadow-md"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`${compact ? 'w-8 h-8' : 'w-11 h-11'} rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center text-white shadow-sm ${
                isSelected ? 'shadow-md' : ''
              }`}>
                {mode.icon}
              </div>

              {/* Label */}
              <span className={`${compact ? 'text-[10px] mt-1' : 'text-xs mt-2'} font-semibold ${
                isSelected ? 'text-ocean' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {mode.label}
              </span>

              {/* Subtitle — only in non-compact */}
              {!compact && (
                <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">
                  {mode.subtitle}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Get the prompt hint for a travel mode to inject into the AI system prompt
 */
export function getTravelModePromptHint(mode: TravelMode | null): string {
  if (!mode) return '';
  const found = TRAVEL_MODES.find(m => m.id === mode);
  return found?.promptHint || '';
}

export default TravelModeSelector;
