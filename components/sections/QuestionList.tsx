"use client";

import { useEffect, useMemo, useState } from "react";
import "katex/dist/katex.min.css";

import { QuestionFilters } from "@/components/compounds/QuestionFilters";
import { QuestionListHeader } from "@/components/compounds/QuestionListHeader";
import { VirtualizedQuestionFeed } from "@/components/compounds/VirtualizedQuestionFeed";
import { filterQuestionsBySubtopic, QUESTION_BATCH_SIZE } from "@/lib/questions";
import type {
  QuestionWithSubtopicRelations,
  TopicGroup,
} from "@/types/questions";

interface QuestionListProps {
  initialQuestions: QuestionWithSubtopicRelations[];
  topicGroups: TopicGroup[];
}

export function QuestionList({ initialQuestions, topicGroups }: QuestionListProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [hasMore, setHasMore] = useState(
    initialQuestions.length === QUESTION_BATCH_SIZE,
  );
  const [loadError, setLoadError] = useState(false);
  const [activeSubtopics, setActiveSubtopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(
    topicGroups[0]?.topic_name ?? "",
  );

  useEffect(() => {
    if (!hasMore) return;

    const controller = new AbortController();

    async function loadNextBatch() {
      try {
        const response = await fetch(`/api/questions?offset=${questions.length}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Question fetch failed");

        const batch: QuestionWithSubtopicRelations[] = await response.json();
        if (controller.signal.aborted) return;

        setQuestions((previous) => [...previous, ...batch]);
        setHasMore(batch.length === QUESTION_BATCH_SIZE);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      }
    }

    // Appending a successful batch triggers the next fetch after rendering.
    void loadNextBatch();
    return () => controller.abort();
  }, [questions.length, hasMore]);

  const displayedQuestions = useMemo(
    () => filterQuestionsBySubtopic(questions, activeSubtopics),
    [questions, activeSubtopics],
  );

  const toggleFilter = (subtopic: string) => {
    setActiveSubtopics((prev) =>
      prev.includes(subtopic)
        ? prev.filter((currentSubtopic) => currentSubtopic !== subtopic)
        : [...prev, subtopic],
    );
  };

  const selectTopic = (topicName: string) => {
    setSelectedTopic(topicName);
    setActiveSubtopics([]);
  };

  return (
    <div className="mx-auto mt-8 w-3/4 px-4">
      <QuestionListHeader questionCount={displayedQuestions.length} />
      <QuestionFilters
        topicGroups={topicGroups}
        selectedTopic={selectedTopic}
        activeSubtopics={activeSubtopics}
        onSelectTopic={selectTopic}
        onToggleSubtopic={toggleFilter}
        onResetSubtopics={() => setActiveSubtopics([])}
      />
      {hasMore && (
        <p role="status" className="mb-4 text-sm text-neutral-400">
          {loadError
            ? "Could not load more problems. Refresh the page to try again."
            : "Loading more problems. Counts and filters reflect problems loaded so far."}
        </p>
      )}
      <VirtualizedQuestionFeed questions={displayedQuestions} />
    </div>
  );
}
