"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Globe2, MapPin, Calendar, Compass, Sparkles } from "lucide-react";

export type WorkspaceMode = "map" | "itinerary" | "explore" | "insights";

interface WorkspaceTab {
  id: WorkspaceMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const workspaceTabs: WorkspaceTab[] = [
  {
    id: "map",
    label: "Map",
    icon: Globe2,
    description: "Interactive travel map"
  },
  {
    id: "itinerary", 
    label: "Itinerary",
    icon: Calendar,
    description: "Daily trip plan"
  },
  {
    id: "explore",
    label: "Explore", 
    icon: Compass,
    description: "Discover destinations"
  },
  {
    id: "insights",
    label: "Insights",
    icon: Sparkles,
    description: "AI recommendations"
  }
];

interface WorkspaceTabsProps {
  activeMode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  tripGenerated?: boolean;
  className?: string;
}

export function WorkspaceTabs({ 
  activeMode, 
  onModeChange, 
  tripGenerated = false,
  className 
}: WorkspaceTabsProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700",
      className
    )}>
      {workspaceTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeMode === tab.id;
        const isDisabled = tab.id === "itinerary" && !tripGenerated;
        
        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onModeChange(tab.id)}
            disabled={isDisabled}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-gray-700/50",
              isActive && (
                "bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-primary"
              ),
              !isActive && !isDisabled && (
                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              ),
              isDisabled && (
                "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
              )
            )}
            title={tab.description}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {isDisabled && (
              <span className="text-xs text-gray-400 ml-1">(Soon)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default WorkspaceTabs;
