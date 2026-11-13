import type { QuestionWithSubtopicRelations } from "@/types/questions";

export const QUESTION_BATCH_SIZE = 50;

export function filterQuestionsBySubtopic(
  questions: QuestionWithSubtopicRelations[],
  selectedSubtopics: string[],
  excludedSubtopics: string[]
): QuestionWithSubtopicRelations[] {
  
  return questions.filter((question) => {
    let matchesSelected = selectedSubtopics.length === 0;

    for (const link of question.question_subtopic_junction) {
      const name = link.Subtopics?.subtopic_name;
      if (!name) continue;

      // Reject any question with an excluded subtopic.
      if (excludedSubtopics.includes(name)) {
        return false;
      }

      if (selectedSubtopics.includes(name)) {
        matchesSelected = true;
      }
    }

    return matchesSelected;
  });
}
