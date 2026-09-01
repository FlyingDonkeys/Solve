// components/elements/InteractiveFeed.tsx
"use client";

import { useState, useMemo } from "react";
import { TopicToggle } from "@/components/elements/TopicToggle";
import { SolutionCollapsible } from "@/components/elements/SolutionCollapsible";
import Latex from 'react-latex-next';
import { QuestionWithSubtopicRelations, SubtopicRow } from "@/app/questions/page";

interface QuestionListProps {
  initialQuestions: QuestionWithSubtopicRelations[];
  subtopics: string[];
}

function generateColour(subtopic: SubtopicRow | null): string {
  const relatedTopic = subtopic?.related_topic ?? 0;
  const possibleColourClasses = [
    "bg-blue-900 text-blue-300 border-blue-600",
    "bg-green-900 text-green-300 border-green-600",
    "bg-red-900 text-red-300 border-red-600",
    "bg-yellow-900 text-yellow-300 border-yellow-600",
    "bg-purple-900 text-purple-300 border-purple-600",
    "bg-pink-900 text-pink-300 border-pink-600",
  ];
  return possibleColourClasses[relatedTopic % possibleColourClasses.length];
}

export function QuestionList({ initialQuestions, subtopics }: QuestionListProps) {
  const [activeSubtopics, setActiveSubtopics] = useState<string[]>([]);

  // Instant in-memory filter
  const displayedQuestions = useMemo(() => {
    if (activeSubtopics.length === 0) return initialQuestions;
    return initialQuestions.filter((question) => {
      const questionSubtopics = question.question_subtopic_junction.map(
        (j) => j.Subtopics?.subtopic_name
      );
      return activeSubtopics.every((active) => questionSubtopics.includes(active));
    });
  }, [initialQuestions, activeSubtopics]);

  const toggleFilter = (subtopic: string) => {
    setActiveSubtopics((prev) =>
      prev.includes(subtopic) ? prev.filter((s) => s !== subtopic) : prev.concat([subtopic])
    );
  };

  return (
    <div className="w-3/4 mx-auto mt-8 px-4">      
      {/* Page Header */}
      <header className="grid gap-2 text-center items-center mb-4 md:grid-cols-3">
        <div />
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <p className="text-xl font-semibold text-neutral-400">
          { displayedQuestions.length != 0 ? `Showing ${displayedQuestions.length} questions` : "No questions found"}
        </p>
        <p className="text-sm font-normal text-neutral-600 md:hidden">
          Please use a laptop or tablet for a better viewing experience.
        </p>
      </header>

      {/* Topic and Subtopic Filters Section */}
      <section className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 my-6 py-6 border-t border-b border-neutral-400">
        <div className="md:w-48 shrink-0 flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-wider text-neutral-400">
            Filter by Subtopic
          </h2>
          {activeSubtopics.length > 0 && (
            <button
              onClick={() => setActiveSubtopics([])}
              className="text-sm text-neutral-500 hover:text-neutral-300 underline text-left cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Flexible Tag Cloud */}
        <div className="flex flex-wrap gap-2">
          {subtopics.map((subtopicName) => (
            <TopicToggle
              key={subtopicName}
              topicName={subtopicName}
              isActive={activeSubtopics.includes(subtopicName)}
              onClick={() => toggleFilter(subtopicName)}
            />
          ))}
        </div>
      </section>

      {/* Questions Feed */}
      <section className="flex flex-col gap-8 mb-8">
        {displayedQuestions.map((question) => {
          const formattedDate = new Date(question.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <article
              key={question.id}
              className="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-colors hover:border-gray-400"
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

              {/* Question Title */}
              <h2 className="text-xl font-semibold text-neutral-100 mb-6 leading-snug">
                {question.question_title}
              </h2>

              {/* Question Content */}
              <div className="whitespace-pre-line text-neutral-200 text-base leading-relaxed mb-6">
                <Latex>{question.question_content}</Latex>
              </div>

              {/* Collapsible Solution */}
              {question.question_solution && (
                <SolutionCollapsible
                  triggerText="▶ view solution"
                  contentText={question.question_solution}
                />
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}