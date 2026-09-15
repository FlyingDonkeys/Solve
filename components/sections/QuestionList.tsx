"use client";

import { useEffect, useMemo, useState } from "react";
import "katex/dist/katex.min.css";

import { QuestionFilters } from "@/components/compounds/QuestionFilters";
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
      <header className="mb-4 grid items-center gap-2 text-center md:grid-cols-3">
        <div />
        <h1 className="text-3xl font-bold">Problems</h1>
        <p className="text-sm font-normal text-neutral-600 md:hidden">
          Please use a laptop or tablet for a better viewing experience.
        </p>
      </header>
      <QuestionFilters
        topicGroups={topicGroups}
        selectedTopic={selectedTopic}
        activeSubtopics={activeSubtopics}
        onSelectTopic={selectTopic}
        onToggleSubtopic={toggleFilter}
        onResetSubtopics={() => setActiveSubtopics([])}
      />
      <VirtualizedQuestionFeed questions={displayedQuestions} />
    </div>
  );
}
