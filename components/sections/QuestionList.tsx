"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, SearchX } from "lucide-react";
import { updateActivity } from "@/lib/activity";
import { buttonVariants } from "@/components/ui/button";
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
  const [retryCount, setRetryCount] = useState(0);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [excludedSubtopics, setExcludedSubtopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(topicGroups[0].topic_name);

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
    loadNextBatch();
    return () => controller.abort();
  }, [questions.length, hasMore, retryCount]);

  const displayedQuestions = useMemo(
    () => filterQuestionsBySubtopic(questions, selectedSubtopics, excludedSubtopics),
    [questions, selectedSubtopics, excludedSubtopics],
  );

  const toggleFilter = (subtopic: string) => {
    if (selectedSubtopics.includes(subtopic)) {
      setSelectedSubtopics(prev => prev.filter(t => t != subtopic))
      setExcludedSubtopics(prev => [...prev, subtopic])
    } else if (excludedSubtopics.includes(subtopic)) {
      setExcludedSubtopics(prev => prev.filter(t => t != subtopic))
    } else {
      setSelectedSubtopics(prev => [...prev, subtopic])
    }
    updateActivity();
  };

  const selectTopic = (topicName: string) => {
    if (topicName === selectedTopic) return;
    setSelectedTopic(topicName);
    setSelectedSubtopics([]);
    setExcludedSubtopics([])
    void updateActivity();
  };

  return (
    <main className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <p className="eyebrow mb-3">H2 Mathematics</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The Problems</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">Pick a subtopic. Master the subtopic. Work at your own pace.</p>
        </div>
      </header>
      <QuestionFilters
        topicGroups={topicGroups}
        selectedTopic={selectedTopic}
        selectedSubtopics={selectedSubtopics}
        excludedSubtopics={excludedSubtopics}
        onSelectTopic={selectTopic}
        onToggleSubtopic={toggleFilter}
      />
      {loadError && (
        <div role="alert" className="surface-panel mb-6 flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
          <p className="text-muted-foreground">Couldn’t load more problems. You can still practise with those already loaded.</p>
          <button type="button" onClick={() => { setLoadError(false); setRetryCount((count) => count + 1); }} className={buttonVariants({ variant: "outline" })}>
            <RotateCcw aria-hidden="true" className="size-4" />Try again
          </button>
        </div>
      )}
      {displayedQuestions.length > 0 ? <VirtualizedQuestionFeed questions={displayedQuestions} /> : (
        <section className="surface-panel px-6 py-14 text-center">
          <SearchX aria-hidden="true" className="mx-auto mb-4 size-7 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{hasMore && !loadError ? "Looking for problems…" : selectedSubtopics.length > 0 ? "No matching problems yet" : "No problems available"}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{hasMore && !loadError ? "More problems are on their way. Your filters will apply as they arrive." : selectedSubtopics.length > 0 ? "Try another subtopic or clear your filters to explore more problems." : "Check back soon for more practice."}</p>
        </section>
      )}
    </main>
  );
}
