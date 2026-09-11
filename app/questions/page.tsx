// app/questions/page.tsx
import { adminClient } from "@/lib/supabase/client";
import { QuestionList } from "@/components/sections/QuestionList";
import { fetchQuestions } from "@/lib/question-data";
import type { TopicGroup } from "@/types/questions";

export const dynamic = 'force-dynamic';

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
  const [questions, topicGroups] = await Promise.all([
    fetchQuestions(),
    fetchTopicGroups(),
  ]);

  return (
    <QuestionList initialQuestions={questions} topicGroups={topicGroups} />
  );
}
