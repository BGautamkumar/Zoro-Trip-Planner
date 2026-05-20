"use client";

import React, { useEffect, useState } from "react";
import { useTripDetail } from "../Provider";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { WorkspaceContainer } from "@/components/workspace/WorkspaceContainer";
import { MobileWorkspaceNav } from "@/components/workspace/MobileWorkspaceNav";
import { WorkspaceMode } from "@/components/workspace/WorkspaceTabs";
import { MessageSquareText, Cpu, Map } from "lucide-react";

type ExperienceStage = 'chat' | 'generating' | 'exploring';

function CreateNewTrip() {
  // @ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<WorkspaceMode>("map");
  const [isMobileView, setIsMobileView] = useState(false);
  const [experienceStage, setExperienceStage] = useState<ExperienceStage>('chat');

  useEffect(() => {
    setTripDetailInfo(null);
    setExperienceStage('chat');
    
    // Detect mobile view
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Transition to generating stage when user starts final trip generation
  useEffect(() => {
    if (tripDetailInfo) {
      setExperienceStage('exploring');
    }
  }, [tripDetailInfo]);

  const stages = [
    { key: 'chat', label: 'Plan Trip', icon: <MessageSquareText className="h-4 w-4" /> },
    { key: 'generating', label: 'Generate', icon: <Cpu className="h-4 w-4" /> },
    { key: 'exploring', label: 'Explore', icon: <Map className="h-4 w-4" /> },
  ];

  const stageOrder = ['chat', 'generating', 'exploring'];
  const currentIndex = stageOrder.indexOf(experienceStage);

  const renderMainContent = () => {
    switch (experienceStage) {
      case 'chat':
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Full-width chat during question phase */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm">
                <ChatPanel onGenerationStart={() => setExperienceStage('generating')} />
              </div>
            </div>
          </div>
        );
      
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 max-w-md animate-reveal-up">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-ocean/20 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-2 border-4 border-t-ocean border-r-ocean border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-deep to-ocean animate-pulse-glow" />
                </div>
              </div>
              
              <div className="h-16 relative overflow-hidden flex items-center justify-center">
                <h2 className="text-2xl font-bold text-deep dark:text-white absolute animate-[reveal-up_2s_infinite]">
                  Crafting your adventure...
                </h2>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm animate-reveal-up stagger-1">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 rounded-full bg-ocean/20 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-ocean" />
                  </div>
                  <span>Zoro AI is optimizing your itinerary</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'exploring':
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT PANEL - Chat (Minimized) */}
            <div className="w-full lg:w-1/2 lg:max-w-xl">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm">
                <ChatPanel viewMode="completed" />
              </div>
            </div>

            {/* RIGHT PANEL - Workspace (Full Focus) */}
            <div className="w-full lg:flex-1">
              <div className="lg:sticky lg:top-6">
                <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
                  <WorkspaceContainer />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-ocean/3 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-screen-2xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        {/* Stage Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {stages.map((stage, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = stage.key === experienceStage;
              return (
                <React.Fragment key={stage.key}>
                  {/* Connector line */}
                  {index > 0 && (
                    <div className={`w-16 md:w-24 h-[2px] transition-all duration-500 ${
                      isActive
                        ? 'bg-linear-to-r from-deep to-ocean'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}

                  {/* Step */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-linear-to-br from-deep to-ocean text-white shadow-lg shadow-ocean/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    } ${isCurrent ? 'ring-2 ring-ocean/30 ring-offset-2 ring-offset-white dark:ring-offset-gray-950' : ''}`}>
                      {stage.icon}
                    </div>
                    <span className={`hidden sm:block text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-deep dark:text-white' : 'text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {renderMainContent()}
      </div>
      
      {/* Mobile Navigation - Only show in exploring stage */}
      {experienceStage === 'exploring' && (
        <MobileWorkspaceNav
          activeMode={activeWorkspaceMode}
          onModeChange={setActiveWorkspaceMode}
          tripGenerated={!!tripDetailInfo}
        />
      )}
    </div>
  );
}

export default CreateNewTrip;
