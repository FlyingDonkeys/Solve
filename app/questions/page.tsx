// app/questions/page.tsx
import { adminClient } from "@/lib/supabase/client";
import { QuestionList } from "@/components/sections/QuestionList";
import { fetchQuestions } from "@/lib/question-data";
import type { TopicGroup } from "@/types/questions";
import { createClient } from "@/lib/supabase/server";
import { ErrorPage } from "@/components/ErrorPage";
import { RequireLogin } from "@/components/RequireLogin";


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

  if (error) throw new Error(`Topic fetch failed: ${error.message}`);
  if (!data) return [];

  return data.map((t) => ({
    topic_name: t.topic_name,
    subtopics: (t.subtopics ?? []).map((s) => s.subtopic_name),
  }));
}

export default async function QuestionsPage({ searchParams }: PageProps<"/questions">) {
  const { auth_error } = await searchParams;
  if (auth_error === "1") {
    return <ErrorPage />;
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <RequireLogin reason="Sign in to explore the question bank, practise by subtopic, and check your working with step-by-step solutions." path="/questions" />
    )
  }

  const [questions, topicGroups] = await Promise.all([
    fetchQuestions(),
    fetchTopicGroups(),
  ]);

  return (
    <QuestionList initialQuestions={questions} topicGroups={topicGroups} />
  );
}
