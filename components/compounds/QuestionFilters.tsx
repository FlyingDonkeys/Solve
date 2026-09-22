import { TopicTab } from "@/components/elements/TopicTab";
import { TopicToggle } from "@/components/elements/TopicToggle";
import type { TopicGroup } from "@/types/questions";

interface QuestionFiltersProps {
  topicGroups: TopicGroup[];
  selectedTopic: string;
  activeSubtopics: string[];
  onSelectTopic: (topicName: string) => void;
  onToggleSubtopic: (subtopicName: string) => void;
  onResetSubtopics: () => void;
}

export function QuestionFilters({
  topicGroups,
  selectedTopic,
  activeSubtopics,
  onSelectTopic,
  onToggleSubtopic,
  onResetSubtopics,
}: QuestionFiltersProps) {
  const visibleSubtopics = selectedTopic
    ? (topicGroups.find((group) => group.topic_name === selectedTopic)
        ?.subtopics ?? [])
    : topicGroups.flatMap((group) => group.subtopics);

  return (
    <section aria-labelledby="filter-heading" className="surface-panel flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="filter-heading" className="text-sm font-semibold">
          Focus your practice
        </h2>
        {activeSubtopics.length > 0 && (
          <button
            type="button"
            onClick={onResetSubtopics}
            className="min-h-9 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Clear filters ({activeSubtopics.length})
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div role="group" aria-label="Topic groups" className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
          {topicGroups.map((group) => (
            <TopicTab
              key={group.topic_name}
              topicName={group.topic_name}
              isSelected={selectedTopic === group.topic_name}
              onClick={() => onSelectTopic(group.topic_name)}
            />
          ))}
        </div>

        <p className="text-xs leading-5 text-muted-foreground">Choose one or more subtopics to filter the questions. With none selected, all problems are shown.</p>
        <div role="group" aria-label="Subtopic filters" className="flex flex-wrap content-start gap-2">
          {visibleSubtopics.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              No subtopics available for this topic.
            </span>
          ) : (
            visibleSubtopics.map((subtopicName) => (
              <TopicToggle
                key={subtopicName}
                topicName={subtopicName}
                isActive={activeSubtopics.includes(subtopicName)}
                onClick={() => onToggleSubtopic(subtopicName)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
