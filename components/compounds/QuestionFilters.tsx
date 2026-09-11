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
    <section className="my-4 flex flex-col gap-4 border-b border-neutral-800 py-4 md:flex-row md:items-start md:gap-8">
      <div className="flex shrink-0 flex-col gap-1 md:w-48">
        <h2 className="text-xl font-semibold tracking-wider text-neutral-400">
          Filter Topics
        </h2>
        {activeSubtopics.length > 0 && (
          <button
            type="button"
            onClick={onResetSubtopics}
            className="cursor-pointer text-left text-xs text-neutral-500 underline hover:text-neutral-300"
          >
            Reset Filters ({activeSubtopics.length})
          </button>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-900 pb-2">
          {topicGroups.map((group) => (
            <TopicTab
              key={group.topic_name}
              topicName={group.topic_name}
              isSelected={selectedTopic === group.topic_name}
              onClick={() => onSelectTopic(group.topic_name)}
            />
          ))}
        </div>

        <div className="flex min-h-[200px] flex-wrap content-start gap-2 pt-1 md:min-h-[81px]">
          {visibleSubtopics.length === 0 ? (
            <span className="text-xs italic text-neutral-600">
              No subtopics found
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
