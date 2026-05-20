"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";

import { useTripDetail } from "@/app/Provider";
import { validateAITripData } from "@/lib/ai-data-validator";
import { ValidatedTripInfo } from "@/lib/ai-data-validator";

function Itinerary() {
  const tripContext = useTripDetail();
  const tripDetailInfo = tripContext?.tripDetailInfo;

  const [tripData, setTripData] = useState<ValidatedTripInfo | null>(null);

  useEffect(() => {
    if (tripDetailInfo) {
      // Validate and sanitize data before using
      const validatedData = validateAITripData(tripDetailInfo);
      setTripData(validatedData);
    }
  }, [tripDetailInfo]);

  if (!tripData) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl">
        <Image
          src="/newtravel.jpg"
          alt="travel"
          fill
          className="object-cover"
        />
        <h2 className="flex gap-2 items-center text-3xl text-white absolute left-20 bottom-6 z-10">
          <ArrowLeft />
          Getting to know you to build perfect trip here...
        </h2>
      </div>
    );
  }

  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tripData.hotels || []).map((hotel, index) => (
            <HotelCardItem
              key={hotel.hotel_name ?? index}
              hotel={hotel}
            />
          ))}
        </div>
      ),
    },
    ...(tripData.itinerary || []).map((day) => ({
      title: `Day ${day.day}`,
      content: (
        <div>
          <p>Best Time: {day.best_time_to_visit_day}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(day.activities || []).map((activity, index) => (
              <PlaceCardItem
                key={activity.place_name ?? index}
                activity={activity}
              />
            ))}
          </div>
        </div>
      ),
    })),
  ];

  return (
    <div className="relative w-full min-h-[85vh] overflow-x-hidden">
      <Timeline data={data} tripData={tripData} />
    </div>
  );
}

export default Itinerary;
