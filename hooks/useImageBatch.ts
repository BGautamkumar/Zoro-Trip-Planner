/**
 * useImageBatch — Batch image fetcher for trip locations
 * 
 * Instead of N individual API calls from each PlaceCardItem/HotelCardItem,
 * this hook collects all place names and fetches images in one batch request.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ValidatedTripInfo } from '@/lib/ai-data-validator';

export type ImageMap = Record<string, string>;

interface UseImageBatchReturn {
  images: ImageMap;
  isLoading: boolean;
  error: string | null;
  getImage: (placeName: string) => string;
  refetchImage: (placeName: string) => void;
}

// Module-level cache survives component remounts (but not page navigations)
const imageCache: ImageMap = {};

/**
 * Extract all unique place names from a trip that need images
 */
function extractPlaceNames(tripData: ValidatedTripInfo): string[] {
  const names = new Set<string>();

  // Hotels
  (tripData.hotels || []).forEach(hotel => {
    if (hotel.hotel_name && hotel.hotel_name !== 'Unknown Hotel') {
      names.add(hotel.hotel_name);
    }
  });

  // Activities from each day
  (tripData.itinerary || []).forEach(day => {
    (day.activities || []).forEach(activity => {
      if (activity.place_name && activity.place_name !== 'Unknown Place') {
        const key = activity.place_address
          ? `${activity.place_name}:${activity.place_address}`
          : activity.place_name;
        names.add(key);
      }
    });

    // Day-level hotels
    (day.suggested_hotels || []).forEach(hotel => {
      if (hotel.hotel_name && hotel.hotel_name !== 'Unknown Hotel') {
        names.add(hotel.hotel_name);
      }
    });
  });

  return Array.from(names);
}

export function useImageBatch(tripData: ValidatedTripInfo | null): UseImageBatchReturn {
  const [images, setImages] = useState<ImageMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const fetchBatch = useCallback(async (placeNames: string[]) => {
    // Filter out already-cached names
    const uncached = placeNames.filter(name => !imageCache[name] && !fetchedRef.current.has(name));

    if (uncached.length === 0) {
      // All cached — just update state from cache
      const cached: ImageMap = {};
      placeNames.forEach(name => {
        if (imageCache[name]) cached[name] = imageCache[name];
      });
      setImages(prev => ({ ...prev, ...cached }));
      return;
    }

    // Mark as being fetched
    uncached.forEach(name => fetchedRef.current.add(name));

    setIsLoading(true);
    setError(null);

    // Cancel previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/images/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ places: uncached }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Image batch fetch failed: ${response.status}`);
      }

      const data: ImageMap = await response.json();

      // Update module cache + state
      Object.entries(data).forEach(([name, url]) => {
        imageCache[name] = url;
      });

      // Also load from existing cache
      placeNames.forEach(name => {
        if (imageCache[name] && !data[name]) {
          data[name] = imageCache[name];
        }
      });

      setImages(prev => ({ ...prev, ...data }));
    } catch (err: any) {
      if (err.name === 'AbortError') return; // Expected on cleanup
      console.error('Image batch fetch error:', err);
      setError(err.message || 'Failed to load images');

      // Set fallback for failed images
      const fallbacks: ImageMap = {};
      uncached.forEach(name => {
        fallbacks[name] = '/placeholder.jpg';
      });
      setImages(prev => ({ ...prev, ...fallbacks }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch images when trip data changes
  useEffect(() => {
    if (!tripData) return;

    const placeNames = extractPlaceNames(tripData);
    if (placeNames.length === 0) return;

    fetchBatch(placeNames);

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [tripData, fetchBatch]);

  const getImage = useCallback((placeName: string): string => {
    return images[placeName] || imageCache[placeName] || '/placeholder.jpg';
  }, [images]);

  const refetchImage = useCallback((placeName: string) => {
    delete imageCache[placeName];
    fetchedRef.current.delete(placeName);
    fetchBatch([placeName]);
  }, [fetchBatch]);

  return { images, isLoading, error, getImage, refetchImage };
}
