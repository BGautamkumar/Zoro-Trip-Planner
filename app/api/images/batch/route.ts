import { NextRequest, NextResponse } from "next/server";

// Persistent cache for the lifetime of this serverless instance
const photoCache = new Map<string, string>();

const PLACEHOLDER = '/placeholder.jpg';
const FETCH_TIMEOUT_MS = 6000;

/**
 * Fetch a single place photo URL from Google Places API
 */
async function fetchPlacePhoto(placeName: string): Promise<string> {
  const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_PLACE_API_KEY;

  if (!apiKey) {
    return buildUnsplashFallback(placeName);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const result = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
      },
      body: JSON.stringify({ textQuery: placeName }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!result.ok) {
      console.warn(`Google Places API error for "${placeName}": ${result.status}`);
      return buildUnsplashFallback(placeName);
    }

    const data = await result.json();
    const placeRefName = data?.places?.[0]?.photos?.[0]?.name;

    if (!placeRefName) {
      return buildUnsplashFallback(placeName);
    }

    const mediaKey = process.env.GOOGLE_PLACE_API_KEY || process.env.GOOGLE_API_KEY || '';
    return `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=800&maxWidthPx=1200&key=${mediaKey}`;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      console.warn(`Timeout fetching photo for "${placeName}"`);
    } else {
      console.error(`Error fetching photo for "${placeName}":`, err.message);
    }
    return buildUnsplashFallback(placeName);
  }
}

/**
 * Build an Unsplash fallback image URL
 */
function buildUnsplashFallback(_placeName: string): string {
  return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop&q=80`;
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const { places } = await req.json();

    if (!Array.isArray(places) || places.length === 0) {
      return NextResponse.json({ error: 'places must be a non-empty array' }, { status: 400 });
    }

    // Cap at 50 places per request
    const placeList = places.slice(0, 50) as string[];
    const result: Record<string, string> = {};

    // Separate cached from uncached
    const uncached: string[] = [];
    placeList.forEach(name => {
      if (photoCache.has(name)) {
        result[name] = photoCache.get(name)!;
      } else {
        uncached.push(name);
      }
    });

    // ✅ OPTIMIZATION: Fetch ALL uncached places in parallel (not in sequential batches)
    // Previously: 77 places / 5 concurrency = 16 serial rounds × ~800ms = ~13s
    // Now: all 77 run simultaneously = ~800ms (bound by slowest single request)
    if (uncached.length > 0) {
      const settled = await Promise.allSettled(
        uncached.map(async (placeName) => {
          const url = await fetchPlacePhoto(placeName);
          photoCache.set(placeName, url);
          return { name: placeName, url };
        })
      );

      settled.forEach((res) => {
        if (res.status === 'fulfilled') {
          result[res.value.name] = res.value.url;
        }
      });
    }

    console.log(`[images/batch] ${placeList.length} places (${uncached.length} fetched) in ${Date.now() - t0}ms`);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Batch image API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
