// components/elements/TopicToggle.tsx
"use client";

import { Circle } from "lucide-react"

interface TopicToggleProps {
  topicName: string;
  isActive: boolean;
  onClick: () => void;
}

export function TopicToggle({ topicName, isActive, onClick }: TopicToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Filter by ${topicName}`}
      data-state={isActive ? "on" : "off"}
      className="group/toggle border inline-flex items-center gap-2.5 h-auto py-1.5 px-3 
      rounded-full text-sm font-medium border-neutral-800 hover:bg-neutral-900 data-[state=on]:bg-neutral-800 transition-colors cursor-pointer"
    >
      <Circle className="h-2.5 w-2.5 shrink-0 fill-transparent text-neutral-500 transition-colors 
      group-data-[state=on]/toggle:fill-white group-data-[state=on]/toggle:text-white" 
      />
      <span>{topicName}</span>
    </button>
  )
}
