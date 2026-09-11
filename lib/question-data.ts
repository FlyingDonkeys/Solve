import "server-only";

import { adminClient } from "@/lib/supabase/client";
import { QUESTION_BATCH_SIZE } from "@/lib/questions";
import type { QuestionWithSubtopicRelations } from "@/types/questions";

export async function fetchQuestions(
  offset = 0,
): Promise<QuestionWithSubtopicRelations[]> {
  const { data, error } = await adminClient
    .from("questions")
    .select(`
      *,
      question_subtopic_junction (
        subtopic_id,
        Subtopics: subtopics (*)
      )
    `)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .range(offset, offset + QUESTION_BATCH_SIZE - 1);

  if (error) {
    throw new Error(`Question fetch failed: ${error.message}`);
  }

  return (data as QuestionWithSubtopicRelations[]) ?? [];
}
