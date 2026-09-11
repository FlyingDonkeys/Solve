import type { Database } from "@/types/database.types";

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
