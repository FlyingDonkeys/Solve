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
    <article className="surface-panel min-w-0 p-5 sm:p-7">
      <div className="flex flex-col flex-wrap gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="meta-badge">
              {question.subject}
            </p>
            {question.year_of_question && (
              <p className="meta-badge">
                {question.year_of_question}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Added {formattedDate}
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {question.question_subtopic_junction.map((junction) => (
            <QuestionSubtopicBadge
              key={junction.subtopic_id}
              subtopic={junction.Subtopics}
            />
          ))}
        </div>
      </div>

      <div className="math-content mb-6 whitespace-pre-line">
        <Latex>{question.question_content}</Latex>
      </div>

      {question.question_solution && (
        <SolutionCollapsible contentText={question.question_solution} />
      )}
    </article>
  );
}
