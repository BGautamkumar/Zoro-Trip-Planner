"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WorkspaceMode } from "./WorkspaceTabs";
import GlobalMap from "@/app/create-new-trip/_components/GlobalMap";
import Itinerary from "@/app/create-new-trip/_components/Itinerary";
import { useTripDetail } from "@/app/Provider";
import { ValidatedTripInfo } from "@/lib/ai-data-validator";

interface WorkspacePanelProps {
  activeMode: WorkspaceMode;
  className?: string;
}

// Loading state components
const MapLoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-gray-500 dark:text-gray-400">Preparing your map...</p>
    </div>
  </div>
);

const ItineraryLoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-gray-500 dark:text-gray-400">Creating your itinerary...</p>
    </div>
  </div>
);

const ExploreState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-20 h-20 mx-auto bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Explore Destinations</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Discover amazing places and get AI-powered recommendations for your next adventure.
        </p>
      </div>
    </div>
  </div>
);

const InsightsState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-20 h-20 mx-auto bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized recommendations and travel tips based on your preferences.
        </p>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-20 h-20 mx-auto bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Your Journey</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Chat with our AI to plan your perfect trip. Your workspace will appear here as we create your itinerary.
        </p>
      </div>
    </div>
  </div>
);

export function WorkspacePanel({ activeMode, className }: WorkspacePanelProps) {
  const { tripDetailInfo } = useTripDetail();
  const hasTripData = !!tripDetailInfo;

  const renderContent = () => {
    // Always show map - even before trip generation
    if (activeMode === "map") {
      return <GlobalMap />;
    }

    // For other modes, check if trip data is available
    if (!hasTripData) {
      return <EmptyState />;
    }

    // After trip generation - show appropriate workspace
    switch (activeMode) {
      case "itinerary":
        return <Itinerary />;
      
      case "explore":
        return <ExploreState />;
      
      case "insights":
        return <InsightsState />;
      
      default:
        return <GlobalMap />;
    }
  };

  return (
    <div className={cn(
      "h-full w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
      className
    )}>
      <div className="h-full overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default WorkspacePanel;
