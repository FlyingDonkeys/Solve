import type { SubtopicRow } from "@/types/questions";

const SUBTOPIC_COLOUR_CLASSES = [
  "bg-blue-400/10 text-blue-300 border-blue-400/20",
  "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  "bg-rose-400/10 text-rose-300 border-rose-400/20",
  "bg-amber-400/10 text-amber-300 border-amber-400/20",
  "bg-violet-400/10 text-violet-300 border-violet-400/20",
  "bg-pink-400/10 text-pink-300 border-pink-400/20",
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
  if (!subtopic) return null;

  return (
    <span
      className={`rounded-md border px-2.5 py-1 text-xs font-medium ${getSubtopicColour(subtopic)}`}
    >
      {subtopic?.subtopic_name ?? ""}
    </span>
  );
}
