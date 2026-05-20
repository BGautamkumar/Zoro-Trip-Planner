"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { WorkspaceMode } from "./WorkspaceTabs";
import { WorkspaceTabs } from "./WorkspaceTabs";
import { WorkspacePanel } from "./WorkspacePanel";
import { useTripDetail } from "@/app/Provider";

interface WorkspaceContainerProps {
  className?: string;
}

export function WorkspaceContainer({ className }: WorkspaceContainerProps) {
  const [activeMode, setActiveMode] = useState<WorkspaceMode>("map");
  const { tripDetailInfo } = useTripDetail();
  const hasTripData = !!tripDetailInfo;
  
  // Prevent repeated auto-switching - only do it once after trip generation
  const hasAutoOpenedItinerary = useRef(false);
  const previousHasTripData = useRef(hasTripData);
  
  // Auto-switch to itinerary ONCE after successful trip generation
  useEffect(() => {
    // Only auto-open if:
    // 1. Trip data just became available (transition from false to true)
    // 2. We haven't auto-opened before
    // 3. User is currently on map view
    const tripJustGenerated = hasTripData && !previousHasTripData.current;
    const shouldAutoOpen = tripJustGenerated && 
                          !hasAutoOpenedItinerary.current && 
                          activeMode === "map";
    
    if (shouldAutoOpen) {
      
      // Small delay to show transition
      const timer = setTimeout(() => {
        setActiveMode("itinerary");
        hasAutoOpenedItinerary.current = true; // Mark as done
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Update previous trip data ref
    previousHasTripData.current = hasTripData;
  }, [hasTripData, activeMode]);
  
  // User-driven tab change handler - respects user control after auto-open
  const handleModeChange = (newMode: WorkspaceMode) => {
    setActiveMode(newMode);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
      className
    )}>
      {/* Workspace Header */}
      <div className="shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Workspace
            </h2>
            {hasTripData && (
              <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Trip Ready
                </span>
              </div>
            )}
          </div>
          
          <WorkspaceTabs
            activeMode={activeMode}
            onModeChange={handleModeChange}
            tripGenerated={hasTripData}
          />
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 min-h-0">
        <WorkspacePanel activeMode={activeMode} />
      </div>
    </div>
  );
}

export default WorkspaceContainer;
