import type { QuestionWithSubtopicRelations } from "@/types/questions";

export const QUESTION_BATCH_SIZE = 50;

export function filterQuestionsBySubtopic(
  questions: QuestionWithSubtopicRelations[],
  activeSubtopics: string[],
): QuestionWithSubtopicRelations[] {
  if (activeSubtopics.length === 0) {
    return questions;
  }

  const activeSubtopicSet = new Set(activeSubtopics);

  return questions.filter((question) =>
    question.question_subtopic_junction.some((junction) => {
      const subtopicName = junction.Subtopics?.subtopic_name;
      return subtopicName ? activeSubtopicSet.has(subtopicName) : false;
    }),
  );
}
