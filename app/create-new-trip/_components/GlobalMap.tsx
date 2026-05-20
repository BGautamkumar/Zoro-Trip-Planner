"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTripDetail } from "@/app/Provider";

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // @ts-ignore
  const { tripDetailInfo } = useTripDetail();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

    if (!token) {
      console.error("❌ Mapbox token missing");
      return;
    }

    // ✅ MUST be set BEFORE new Map()
    mapboxgl.accessToken = token;

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 20],
        zoom: 1.5,
      });
    }

    const markers: mapboxgl.Marker[] = [];

    if (tripDetailInfo?.itinerary && mapRef.current) {
      tripDetailInfo.itinerary.forEach((itinerary: any) => {
        itinerary.activities.forEach((activity: any) => {
          const lat = activity?.geo_coordinates?.latitude;
          const lng = activity?.geo_coordinates?.longitude;

          if (typeof lat === "number" && typeof lng === "number") {
            const marker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name)
              )
              .addTo(mapRef.current!);

            markers.push(marker);
          }
        });
      });
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [tripDetailInfo]);

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

export default GlobalMap;
