import { adminClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types"
import { SolutionCollapsible } from "@/components/elements/SolutionCollapsible";

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// Source of truth in database types
type QuestionRow = Database['public']['Tables']['questions']['Row'];
type SubtopicRow = Database['public']['Tables']['subtopics']['Row'];

export type QuestionWithSubtopicRelations = QuestionRow & {
  question_subtopic_junction: {
    subtopic_id: number | null;
    Subtopics: SubtopicRow | null;
  }[];
};

async function fetchQuestions(): Promise<QuestionWithSubtopicRelations[]> {
  const { data, error } = await adminClient
    .from('questions')
    .select(`
      *,
      question_subtopic_junction (
        subtopic_id,
        Subtopics: subtopics (
          *
        )
      )
    `)
    .order('created_at');

  if (error) {
    throw new Error(`Question fetch failed: ${error.message}`);
  }

  return data ?? [];
}

function generateColour(subtopicName: string): string {
  const possibleColourClasses = [
    "bg-blue-900 text-blue-300 border-blue-600",
    "bg-green-900 text-green-300 border-green-600",
    "bg-red-900 text-red-300 border-red-600",
    "bg-yellow-900 text-yellow-300 border-yellow-600",
    "bg-purple-900 text-purple-300 border-purple-600",
    "bg-pink-900 text-pink-300 border-pink-600",
  ]

  // The decision is purely arbitrary lol, the site looks too plain without any colours.
  // Might use a more reasoned approach next time
  return possibleColourClasses[subtopicName.length % possibleColourClasses.length];
}

export default async function QuestionsPage() {
  const questions = await fetchQuestions();
  
  return (
    <div className="max-w-3/4 mx-auto mt-8">
      {/* Page Header */}
      <header className="grid grid-cols-3 items-center mb-8">
        <div />
        <h1 className="text-4xl font-bold text-center">
          Question Bank
        </h1>
        <p className="text-xl font-semibold text-neutral-400 text-right">
          Showing {questions.length} total questions
        </p>
      </header>

      {/* Questions Feed */}
      <section className="flex flex-col gap-8 mb-8">
        {questions.map((question) => {
          const formattedDate = new Date(question.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <article
              key={question.id}
              className="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-colors hover:border-gray-400"
            >
              {/* TODO: Add question topic and subtopic tags into the question's meta header! */}
              {/* Meta Header */}
              <div className="flex flex-wrap flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-4">
                    <span className="inline-flex items-center rounded-md bg-neutral-800 px-2.5 py-1 text-sm  font-medium text-neutral-200 border border-neutral-700">
                      {question.subject}
                    </span>
                    {question.year_of_question && (
                      <span className="inline-flex items-center rounded-md bg-neutral-700 px-2.5 py-1 text-sm font-medium text-neutral-400 border border-neutral-600">
                        {question.year_of_question}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-neutral-500 font-mono">
                    Added {formattedDate}
                  </span>
                </div>

                <div className="flex flex-wrap items-center mb-4 gap-4">
                  {question.question_subtopic_junction?.map((junction) => {
                    const subtopicName = junction?.Subtopics?.subtopic_name ?? "";
                    return (
                      <span
                        key={junction.subtopic_id}
                        className={`rounded-md px-2.5 py-1 text-sm font-medium border ${generateColour(subtopicName)}`}
                      >
                        {subtopicName}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Question Title */}
              <h2 className="text-3xl font-semibold text-neutral-100 mb-6 leading-snug">
                {question.question_title}
              </h2>

              {/* Question Content */}
              <div className="whitespace-pre-line text-neutral-200 text-lg leading-relaxed mb-6">
                <Latex>{question.question_content}</Latex>
              </div>

              {/* Collapsible Solution */}
              {question.question_solution && (
                <SolutionCollapsible triggerText="▶ view solution" contentText={question.question_solution} />
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
