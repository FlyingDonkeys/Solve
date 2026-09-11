interface TopicTabProps {
  topicName: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TopicTab({
  topicName,
  isSelected,
  onClick,
}: TopicTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`relative inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
        isSelected
          ? "border-neutral-400 bg-neutral-400 text-black"
          : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
      }`}
    >
      {topicName}
    </button>
  );
}
