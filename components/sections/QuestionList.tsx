"use client";

import {useState, useMemo, useRef, useEffect} from "react";
import { TopicToggle } from "@/components/elements/TopicToggle";
import { SolutionCollapsible } from "@/components/elements/SolutionCollapsible";
import Latex from 'react-latex-next';
import "katex/dist/katex.min.css";
import {QuestionWithSubtopicRelations, SubtopicRow, TopicGroup} from "@/app/questions/page";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

interface QuestionListProps {
  initialQuestions: QuestionWithSubtopicRelations[];
  topicGroups: TopicGroup[];
}

function generateColour(subtopic: SubtopicRow | null): string {
  const relatedTopic = subtopic?.related_topic_name ?? "";

  // Helper function that maps a string to a unique id
  const getUniqueId = (str: string) => ([...str].reduce((hash, char) =>
    (hash * 31 + char.charCodeAt(0)) | 0, 0) >>> 0);
  const possibleColourClasses = [
    "bg-blue-900 text-blue-300 border-blue-600",
    "bg-green-900 text-green-300 border-green-600",
    "bg-red-900 text-red-300 border-red-600",
    "bg-yellow-900 text-yellow-300 border-yellow-600",
    "bg-purple-900 text-purple-300 border-purple-600",
    "bg-pink-900 text-pink-300 border-pink-600",
  ];
  return possibleColourClasses[getUniqueId(relatedTopic) % possibleColourClasses.length];
}

export function QuestionList({ initialQuestions, topicGroups }: QuestionListProps) {
  const [activeSubtopics, setActiveSubtopics] = useState<string[]>([]);
  // Default to first topic, as we want to avoid the ALL state
  const [selectedTopic, setSelectedTopic] = useState<string>(topicGroups[0].topic_name);

  // Derive subtopics belonging to the selected main topic
  const visibleSubtopics = useMemo(() => {
    if (!selectedTopic) {
      return topicGroups.flatMap((g) => g.subtopics);
    }
    return topicGroups.find((g) => g.topic_name === selectedTopic)?.subtopics ?? [];
  }, [topicGroups, selectedTopic]);

  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    const calculateOffset = () => {
      if (listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        setScrollMargin(rect.top + window.scrollY);
      }
    };

    calculateOffset();
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  // Instant in-memory filter
  const displayedQuestions = useMemo(() => {
    if (activeSubtopics.length === 0) return initialQuestions;
    return initialQuestions.filter((question) => {
      const questionSubtopics = question.question_subtopic_junction.map(
        (j) => j.Subtopics?.subtopic_name
      );
      return activeSubtopics.some((active) => questionSubtopics.includes(active));
    });
  }, [initialQuestions, activeSubtopics]);

  const toggleFilter = (subtopic: string) => {
    setActiveSubtopics((prev) =>
      prev.includes(subtopic) ? prev.filter((s) => s !== subtopic) : prev.concat([subtopic])
    );
  };

  const measureCard = (node: HTMLElement | null) => {
    if (node) {
      queueMicrotask(() => {
        // Ensure the card is still mounted before measuring
        if (node.isConnected) {
          virtualizer.measureElement(node);
        }
      });
    }
  };

  const virtualizer = useWindowVirtualizer({
    count: displayedQuestions.length,
    estimateSize: () => 500,
    scrollMargin
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="w-3/4 mx-auto mt-8 px-4">      
      {/* Page Header */}
      <header className="grid gap-2 text-center items-center mb-4 md:grid-cols-3">
        <div />
        <h1 className="text-3xl font-bold">Problems</h1>
        <p className="text-xl font-semibold text-neutral-400">
          { displayedQuestions.length != 0 ? `Showing ${displayedQuestions.length} problems` : "No problems found"}
        </p>
        <p className="text-sm font-normal text-neutral-600 md:hidden">
          Please use a laptop or tablet for a better viewing experience.
        </p>
      </header>

      {/* Topic and Subtopic Filters Section */}
      <section className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 my-4 py-4 border-b border-neutral-800">
        <div className="md:w-48 shrink-0 flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-wider text-neutral-400">
            Filter Topics
          </h2>
          {activeSubtopics.length > 0 && (
            <button
              onClick={() => setActiveSubtopics([])}
              className="text-xs text-neutral-500 hover:text-neutral-300 underline text-left cursor-pointer"
            >
              Reset Filters ({activeSubtopics.length})
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Tier 1: Main Topic Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-neutral-900">
            {topicGroups.map((group) => {
              const isSelected = selectedTopic === group.topic_name;

              return (
                <button
                  key={group.topic_name}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(group.topic_name)
                    setActiveSubtopics([])
                  }}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                    isSelected 
                      ? "bg-neutral-400 text-black border-neutral-400"
                      : "bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <span>{group.topic_name}</span>
                </button>
              );
            })}
          </div>

          {/* Tier 2: Subtopics Cloud */}
          <div className="flex flex-wrap gap-2 pt-1 min-h-[200px] md:min-h-[81px] content-start">
            {visibleSubtopics.length === 0 ? (
              <span className="text-xs text-neutral-600 italic">No subtopics found</span>
            ) : (
              visibleSubtopics.map((subtopicName) => (
                <TopicToggle
                  key={subtopicName}
                  topicName={subtopicName}
                  isActive={activeSubtopics.includes(subtopicName)}
                  onClick={() => toggleFilter(subtopicName)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Questions Feed */}
      <div
        ref={listRef}
        className="flex flex-col mb-8"
      >
        <div
          className="relative"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              transform: `translateY(${(virtualItems[0]?.start ?? 0) - scrollMargin}px)`
            }}
          >
            {virtualItems.map((virtualItem) => {
              const question = displayedQuestions[virtualItem.index];

              const formattedDate = new Date(question.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <article
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={measureCard}
                  className="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-6 my-6 shadow-sm transition-colors hover:border-gray-400"
                >
                  {/* Meta Header */}
                  <div className="flex flex-wrap flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex flex-wrap items-center gap-x-4">
                        <p className="inline-flex items-center rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 border border-neutral-700">
                          {question.subject}
                        </p>
                        {question.year_of_question && (
                          <p className="inline-flex items-center rounded-md bg-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-400 border border-neutral-600">
                            {question.year_of_question}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 font-mono">
                        Added {formattedDate}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center mb-4 gap-4">
                      {question.question_subtopic_junction?.map((junction) => {
                        const subtopic = junction?.Subtopics;
                        const subtopicName = subtopic?.subtopic_name ?? "";
                        return (
                          <span
                            key={junction.subtopic_id}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium border ${generateColour(subtopic)}`}
                          >
                            {subtopicName}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="whitespace-pre-line text-neutral-200 text-base leading-relaxed mb-6">
                    <Latex>{question.question_content}</Latex>
                  </div>

                  {/* Collapsible Solution */}
                  {question.question_solution && (
                    <SolutionCollapsible
                      contentText={question.question_solution}
                    />
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}