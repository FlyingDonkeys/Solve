// app/questions/page.tsx
import { adminClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { QuestionList } from "@/components/sections/QuestionList";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
export type SubtopicRow = Database["public"]["Tables"]["subtopics"]["Row"];

export type QuestionWithSubtopicRelations = QuestionRow & {
  question_subtopic_junction: {
    subtopic_id: number | null;
    Subtopics: SubtopicRow | null;
  }[];
};

export interface TopicGroup {
  topic_name: string;
  subtopics: string[];
}

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

async function fetchTopicGroups(): Promise<TopicGroup[]> {
  const { data, error } = await adminClient
    .from("topics")
    .select(`
      topic_name,
      subtopics (
        subtopic_name
      )
    `)
    .order("topic_name", { ascending: true });

  if (error || !data) return [];

  return data.map((t) => ({
    topic_name: t.topic_name,
    subtopics: (t.subtopics ?? []).map((s) => s.subtopic_name),
  }));
}

export default async function QuestionsPage() {
  const questions = await fetchQuestions();
  const topicGroups = await fetchTopicGroups();

  return (
    <QuestionList initialQuestions={questions} topicGroups={topicGroups} />
  );
}
