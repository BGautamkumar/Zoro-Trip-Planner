import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Trip",
  description: "Plan your perfect trip with Zoro's AI assistant. Tell us your destination, budget, and interests — get a personalized day-by-day itinerary in seconds.",
  openGraph: {
    title: "Plan Your Trip — Zoro Trip Planner",
    description: "AI-powered trip planning. Get a personalized itinerary with budget estimates, hotel suggestions, and weather forecasts.",
  },
};

export default function CreateNewTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
