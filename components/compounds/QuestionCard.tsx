import Latex from "react-latex-next";

import { QuestionSubtopicBadge } from "@/components/elements/QuestionSubtopicBadge";
import { SolutionCollapsible } from "@/components/elements/SolutionCollapsible";
import type { QuestionWithSubtopicRelations } from "@/types/questions";

interface QuestionCardProps {
  question: QuestionWithSubtopicRelations;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const formattedDate = new Date(question.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article className="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-colors hover:border-gray-400">
      <div className="flex flex-col flex-wrap gap-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-4">
            <p className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200">
              {question.subject}
            </p>
            {question.year_of_question && (
              <p className="inline-flex items-center rounded-md border border-neutral-600 bg-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-400">
                {question.year_of_question}
              </p>
            )}
          </div>
          <p className="font-mono text-xs text-neutral-400">
            Added {formattedDate}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          {question.question_subtopic_junction.map((junction) => (
            <QuestionSubtopicBadge
              key={junction.subtopic_id}
              subtopic={junction.Subtopics}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 whitespace-pre-line text-base leading-relaxed text-neutral-200">
        <Latex>{question.question_content}</Latex>
      </div>

      {question.question_solution && (
        <SolutionCollapsible contentText={question.question_solution} />
      )}
    </article>
  );
}
