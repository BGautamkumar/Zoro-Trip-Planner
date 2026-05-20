"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ChatBox from "@/app/create-new-trip/_components/ChatBox";

interface ChatPanelProps {
  className?: string;
  onGenerationStart?: () => void;
  viewMode?: 'chat' | 'completed';
}

export function ChatPanel({ className, onGenerationStart, viewMode = 'chat' }: ChatPanelProps) {
  return (
    <div className={cn(
      "flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
      // Remove h-full to allow natural height growth
      "min-h-[400px]", // Minimum height but can grow
      viewMode === 'completed' && "max-h-[400px]", // Limit height when completed
      className
    )}>
      {/* Chat Content - Direct content without header */}
      <div className="flex-1 min-h-0">
        <ChatBox 
          onGenerationStart={onGenerationStart}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}

export default ChatPanel;
