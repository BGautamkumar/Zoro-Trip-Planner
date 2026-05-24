import { NextRequest, NextResponse } from 'next/server';

// In-memory cache — survives within a single serverless instance
const weatherCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

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

interface WeatherResponse {
  destination: string;
  forecast: WeatherDay[];
  source: string;
}

/**
 * Generate mock weather data based on destination
 * Used as fallback when no API key is configured
 */
function generateEstimatedWeather(destination: string, days: number): WeatherDay[] {
  // Seed-based pseudo-random for consistent results per destination
  let seed = 0;
  for (let i = 0; i < destination.length; i++) {
    seed = ((seed << 5) - seed + destination.charCodeAt(i)) | 0;
  }
  const random = (min: number, max: number) => {
    seed = (seed * 16807) % 2147483647;
    return min + (seed % (max - min + 1));
  };

  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️'];

  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const condIdx = random(0, conditions.length - 1);
    const baseTemp = random(18, 32);
    return {
      date: date.toISOString().split('T')[0],
      temp_min: baseTemp - random(3, 7),
      temp_max: baseTemp + random(2, 5),
      condition: conditions[condIdx],
      icon: icons[condIdx],
      humidity: random(40, 85),
      wind_speed: random(5, 25),
      rain_chance: condIdx === 3 ? random(60, 90) : random(0, 30),
    };
  });
}

/**
 * Fetch weather from OpenWeatherMap (if API key available)
 */
async function fetchOpenWeatherMap(destination: string, days: number): Promise<WeatherDay[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return [];

  try {
    // First geocode the destination
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${apiKey}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const geoData = await geoRes.json();
    if (!geoData?.length) return [];

    const { lat, lon } = geoData[0];

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const forecastData = await forecastRes.json();
    if (!forecastData?.list) return [];

    // Group by day and extract daily summaries
    const dailyMap = new Map<string, any[]>();
    forecastData.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date)!.push(item);
    });

    const conditionIcons: Record<string, string> = {
      'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
      'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌫️',
    };

    const result: WeatherDay[] = [];
    let count = 0;
    for (const [date, entries] of dailyMap) {
      if (count >= days) break;
      const temps = entries.map((e: any) => e.main.temp);
      const mainWeather = entries[Math.floor(entries.length / 2)]?.weather?.[0];
      const rainEntries = entries.filter((e: any) => e.pop > 0);

      result.push({
        date,
        temp_min: Math.round(Math.min(...temps)),
        temp_max: Math.round(Math.max(...temps)),
        condition: mainWeather?.main || 'Clear',
        icon: conditionIcons[mainWeather?.main] || '🌤️',
        humidity: Math.round(entries.reduce((sum: number, e: any) => sum + e.main.humidity, 0) / entries.length),
        wind_speed: Math.round(entries.reduce((sum: number, e: any) => sum + e.wind.speed, 0) / entries.length),
        rain_chance: rainEntries.length > 0
          ? Math.round(rainEntries.reduce((sum: number, e: any) => sum + e.pop * 100, 0) / rainEntries.length)
          : 0,
      });
      count++;
    }

    return result;
  } catch (err) {
    console.warn('OpenWeatherMap fetch failed:', err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination');
  const daysParam = searchParams.get('days');

  if (!destination) {
    return NextResponse.json({ error: 'destination parameter required' }, { status: 400 });
  }

  const days = Math.min(parseInt(daysParam || '5', 10), 14);
  const cacheKey = `${destination.toLowerCase()}_${days}`;

  // Check cache
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json(cached.data);
  }

  // Try real API first
  let forecast = await fetchOpenWeatherMap(destination, days);
  let source = 'openweathermap';

  // Fallback to estimated weather
  if (forecast.length === 0) {
    forecast = generateEstimatedWeather(destination, days);
    source = 'estimated';
  }

  const response: WeatherResponse = {
    destination,
    forecast,
    source,
  };

  // Cache the result
  weatherCache.set(cacheKey, { data: response, expiry: Date.now() + CACHE_TTL_MS });

  return NextResponse.json(response);
}
