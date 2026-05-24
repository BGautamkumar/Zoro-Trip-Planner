'use client';

import React, { useEffect, useState } from 'react';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface WeatherDay {
  date: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  rain_chance: number;
}

interface WeatherWidgetProps {
  destination: string;
  days: number;
  /** Which day index to show (0-based) */
  dayIndex?: number;
  /** Show all days in a row */
  showAll?: boolean;
  compact?: boolean;
}

// Module-level cache
const weatherDataCache = new Map<string, WeatherDay[]>();

export function WeatherWidget({ destination, days, dayIndex, showAll = false, compact = false }: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    if (!destination) return;

    const cacheKey = `${destination}_${days}`;
    const cached = weatherDataCache.get(cacheKey);
    if (cached) {
      setForecast(cached);
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?destination=${encodeURIComponent(destination)}&days=${days}`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        setForecast(data.forecast || []);
        setSource(data.source || '');
        weatherDataCache.set(cacheKey, data.forecast || []);
      } catch {
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination, days]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (forecast.length === 0) return null;

  // Single day display (for day cards)
  if (dayIndex !== undefined && !showAll) {
    const day = forecast[dayIndex];
    if (!day) return null;

    if (compact) {
      return (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-base">{day.icon}</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {day.temp_min}°–{day.temp_max}°C
          </span>
          {day.rain_chance > 30 && (
            <span className="flex items-center gap-0.5 text-blue-500">
              <Droplets className="w-3 h-3" />
              {day.rain_chance}%
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 p-2.5 bg-sky-50 dark:bg-sky-900/10 rounded-xl">
        <span className="text-2xl">{day.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {day.condition}
            </span>
            <span className="text-xs text-gray-500">
              {day.temp_min}° – {day.temp_max}°C
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
            <span className="flex items-center gap-0.5">
              <Droplets className="w-3 h-3 text-blue-400" />
              {day.rain_chance}% rain
            </span>
            <span className="flex items-center gap-0.5">
              <Wind className="w-3 h-3 text-gray-400" />
              {day.wind_speed} km/h
            </span>
          </div>
        </div>
      </div>
    );
  }

  // All days display (for trip overview)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Thermometer className="w-4 h-4 text-ocean" />
          Weather Forecast
        </h4>
        {source === 'estimated' && (
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            Estimated
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
        {forecast.slice(0, days).map((day, i) => (
          <div
            key={day.date}
            className="flex flex-col items-center p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-sm transition-shadow"
          >
            <span className="text-[10px] font-medium text-gray-400 uppercase">
              {new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}
            </span>
            <span className="text-xl my-1">{day.icon}</span>
            <div className="text-center">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {day.temp_max}°
              </span>
              <span className="text-[10px] text-gray-400 ml-0.5">
                {day.temp_min}°
              </span>
            </div>
            {day.rain_chance > 20 && (
              <span className="text-[10px] text-blue-500 flex items-center gap-0.5 mt-0.5">
                <Droplets className="w-2.5 h-2.5" />
                {day.rain_chance}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherWidget;
