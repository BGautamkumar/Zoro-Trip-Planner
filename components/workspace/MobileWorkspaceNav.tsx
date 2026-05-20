"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WorkspaceMode } from "./WorkspaceTabs";
import { Globe2, MapPin, Calendar, Compass, Sparkles } from "lucide-react";

interface MobileWorkspaceNavProps {
  activeMode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  tripGenerated?: boolean;
  className?: string;
}

const mobileTabs = [
  { id: "map" as WorkspaceMode, icon: Globe2, label: "Map" },
  { id: "itinerary" as WorkspaceMode, icon: Calendar, label: "Trip" },
  { id: "explore" as WorkspaceMode, icon: Compass, label: "Explore" },
  { id: "insights" as WorkspaceMode, icon: Sparkles, label: "AI" },
];

export function MobileWorkspaceNav({ 
  activeMode, 
  onModeChange, 
  tripGenerated = false,
  className 
}: MobileWorkspaceNavProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50",
      "md:hidden", // Only show on mobile
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          const isDisabled = tab.id === "itinerary" && !tripGenerated;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onModeChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-[60px]",
                isActive && (
                  "text-primary"
                ),
                !isActive && !isDisabled && (
                  "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                ),
                isDisabled && (
                  "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                )
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">
                {tab.label}
              </span>
              {isDisabled && (
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileWorkspaceNav;
