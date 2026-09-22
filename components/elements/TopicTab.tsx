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
      className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
        isSelected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {topicName}
    </button>
  );
}
