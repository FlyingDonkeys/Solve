import type { SubtopicRow } from "@/types/questions";

const SUBTOPIC_COLOUR_CLASSES = [
  "bg-blue-900 text-blue-300 border-blue-600",
  "bg-green-900 text-green-300 border-green-600",
  "bg-red-900 text-red-300 border-red-600",
  "bg-yellow-900 text-yellow-300 border-yellow-600",
  "bg-purple-900 text-purple-300 border-purple-600",
  "bg-pink-900 text-pink-300 border-pink-600",
] as const;

interface QuestionSubtopicBadgeProps {
  subtopic: SubtopicRow | null;
}

function hashString(value: string): number {
  return (
    [...value].reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) | 0,
      0,
    ) >>> 0
  );
}

function getSubtopicColour(subtopic: SubtopicRow | null): string {
  const topicName = subtopic?.related_topic_name ?? "";
  return SUBTOPIC_COLOUR_CLASSES[
    hashString(topicName) % SUBTOPIC_COLOUR_CLASSES.length
  ];
}

export function QuestionSubtopicBadge({
  subtopic,
}: QuestionSubtopicBadgeProps) {
  return (
    <span
      className={`rounded-md border px-2.5 py-1 text-xs font-medium ${getSubtopicColour(subtopic)}`}
    >
      {subtopic?.subtopic_name ?? ""}
    </span>
  );
}
