"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTripDetail } from "@/app/Provider";

function GlobalMapInner() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const { tripDetailInfo } = useTripDetail();

  // Initialize map once
  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      const token = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

      if (!token || cancelled) return;
      mapboxgl.accessToken = token;

      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [0, 20],
          zoom: 1.5,
        });
        // Signal that the map instance is ready for markers
        setMapReady(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, []);

  // Update markers when trip data changes OR when map becomes ready
  useEffect(() => {
    if (!tripDetailInfo?.itinerary || !mapRef.current || !mapReady) return;

    let cancelled = false;

    const updateMarkers = async () => {
      const mapboxgl = (await import('mapbox-gl')).default;

      if (cancelled) return;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoords = false;

      tripDetailInfo.itinerary.forEach((itinerary: any) => {
        (itinerary.activities || []).forEach((activity: any) => {
          const lat = activity?.geo_coordinates?.latitude;
          const lng = activity?.geo_coordinates?.longitude;

          if (typeof lat === "number" && typeof lng === "number" && (lat !== 0 || lng !== 0)) {
            const marker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name)
              )
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([lng, lat]);
            hasValidCoords = true;
          }
        });
      });

      // Auto-zoom to fit all markers
      if (hasValidCoords && mapRef.current) {
        mapRef.current.fitBounds(bounds, {
          padding: 60,
          maxZoom: 14,
          duration: 1000,
        });
      }
    };

    updateMarkers();

    return () => {
      cancelled = true;
    };
  }, [tripDetailInfo, mapReady]);

  return (
    <div className="w-full h-full min-h-[400px]">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}

const GlobalMap = memo(GlobalMapInner);

export default GlobalMap;
