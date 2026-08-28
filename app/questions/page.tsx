// app/questions/page.tsx
import { adminClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { QuestionList } from "@/components/sections/QuestionList";
import "katex/dist/katex.min.css";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
export type SubtopicRow = Database["public"]["Tables"]["subtopics"]["Row"];

export type QuestionWithSubtopicRelations = QuestionRow & {
  question_subtopic_junction: {
    subtopic_id: number | null;
    Subtopics: SubtopicRow | null;
  }[];
};

export const dynamic = 'force-dynamic';

async function fetchQuestions(): Promise<QuestionWithSubtopicRelations[]> {
  const { data, error } = await adminClient
    .from("questions")
    .select(`
      *,
      question_subtopic_junction (
        subtopic_id,
        Subtopics: subtopics (*)
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Question fetch failed: ${error.message}`);
  }

  return (data as QuestionWithSubtopicRelations[]) ?? [];
}

// Pass questions array directly to avoid querying Supabase twice
function extractUniqueSubtopics(questions: QuestionWithSubtopicRelations[]): string[] {
  const subtopicNames = questions.flatMap((question) =>
    question.question_subtopic_junction.map((junction) => junction.Subtopics?.subtopic_name ?? "")
  );
  return [...new Set(subtopicNames)].filter(Boolean);
}

export default async function QuestionsPage() {
  const questions = await fetchQuestions();
  const subtopics = extractUniqueSubtopics(questions);

  return (
    <QuestionList initialQuestions={questions} subtopics={subtopics} />
  );
}
