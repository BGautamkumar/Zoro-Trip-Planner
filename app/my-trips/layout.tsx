import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Trips",
  description: "View and manage all your AI-generated trip itineraries. Access past trips, share with friends, and plan new adventures.",
  openGraph: {
    title: "My Trips — Zoro Trip Planner",
    description: "All your AI-planned trips in one place. Manage, share, and relive your travel plans.",
  },
};

export default function MyTripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
