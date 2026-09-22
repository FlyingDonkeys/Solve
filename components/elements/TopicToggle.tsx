// components/elements/TopicToggle.tsx
"use client";

import { Check, Plus } from "lucide-react"

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
      aria-pressed={isActive}
      data-state={isActive ? "on" : "off"}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=on]:border-accent-foreground/30 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      {isActive ? <Check aria-hidden="true" className="size-3.5 shrink-0" /> : <Plus aria-hidden="true" className="size-3.5 shrink-0" />}
      <span>{topicName}</span>
    </button>
  )
}
