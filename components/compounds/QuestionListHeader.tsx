interface QuestionListHeaderProps {
  questionCount: number;
}

export function QuestionListHeader({
  questionCount,
}: QuestionListHeaderProps) {
  return (
    <header className="mb-4 grid items-center gap-2 text-center md:grid-cols-3">
      <div />
      <h1 className="text-3xl font-bold">Problems</h1>
      <p className="text-xl font-semibold text-neutral-400">
        {questionCount > 0
          ? `Showing ${questionCount} problems`
          : "No problems found"}
      </p>
      <p className="text-sm font-normal text-neutral-600 md:hidden">
        Please use a laptop or tablet for a better viewing experience.
      </p>
    </header>
  );
}
