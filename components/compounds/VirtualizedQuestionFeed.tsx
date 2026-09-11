"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { QuestionCard } from "@/components/compounds/QuestionCard";
import type { QuestionWithSubtopicRelations } from "@/types/questions";

interface VirtualizedQuestionFeedProps {
  questions: QuestionWithSubtopicRelations[];
}

export function VirtualizedQuestionFeed({
  questions,
}: VirtualizedQuestionFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    const calculateOffset = () => {
      if (!listRef.current) {
        return;
      }

      const rect = listRef.current.getBoundingClientRect();
      setScrollMargin(rect.top + window.scrollY);
    };

    calculateOffset();
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: questions.length,
    estimateSize: () => 500,
    // Render the first visible cards on the server before the browser is measured.
    initialRect: { width: 0, height: 800 },
    scrollMargin,
    overscan: 5,
  });

  const measureCard = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return;
      }

      queueMicrotask(() => {
        if (node.isConnected) {
          virtualizer.measureElement(node);
        }
      });
    },
    [virtualizer],
  );

  return (
    <div ref={listRef} className="mb-8 flex flex-col">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const question = questions[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={measureCard}
              className="absolute top-0 left-0 w-full pb-6"
              style={{
                transform: `translateY(${virtualItem.start - scrollMargin}px)`,
              }}
            >
              <QuestionCard question={question} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
