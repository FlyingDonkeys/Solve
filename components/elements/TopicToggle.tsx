// components/elements/TopicToggle.tsx
"use client";

import { Check, X, Plus } from "lucide-react"

export type TopicState = "notSelected" | "selected" | "excluded";

function getStateStyles(state: TopicState): string {
  switch (state) {
    case "selected":
      return "border-accent-foreground/30 bg-accent text-accent-foreground hover:bg-accent/80";
    case "excluded":
      return "border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400";
    case "notSelected":
      return "border-border text-muted-foreground hover:bg-muted hover:text-foreground";
  }
}

interface TopicToggleProps {
  topicName: string;
  state: TopicState;
  onClick: () => void;
}

export function TopicToggle({ topicName, state, onClick }: TopicToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Filter by ${topicName}`}
      aria-pressed={state != "notSelected"}
      data-state={state}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-left text-xs font-medium transition-colors ${getStateStyles(state)}`}
    >
      {state == "selected" ? <Check aria-hidden="true" className="size-3.5 shrink-0" /> 
                           : state == "notSelected" ? <Plus aria-hidden="true" className="size-3.5 shrink-0" />
                                                    : <X aria-hidden="true" className="size-3.5 shrink-0" />
                           
      }
      <span>{topicName}</span>
    </button>
  )
}
