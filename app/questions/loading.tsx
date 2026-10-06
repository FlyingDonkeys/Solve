export default function QuestionsLoading() {
  return (
    <main className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <p role="status" className="sr-only">Loading the question bank…</p>

      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">H2 Mathematics</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The Problems</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Pick a subtopic. Master the subtopic. Work at your own pace.
          </p>
        </div>
      </header>

      <div aria-hidden="true" className="flex flex-col gap-8 motion-safe:animate-pulse">
        <div className="surface-panel flex flex-col gap-5 p-5 sm:p-6">
          <div className="h-4 w-36 rounded bg-muted" />
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {["w-24", "w-32", "w-28", "w-24"].map((width, index) => (
              <div key={index} className={`h-9 rounded-md bg-muted ${width}`} />
            ))}
          </div>
          <div className="h-3 w-full max-w-lg rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            {["w-32", "w-24", "w-40"].map((width, index) => (
              <div key={index} className={`h-9 rounded-full bg-muted ${width}`} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="surface-panel space-y-6 p-5 sm:p-7">
              <div className="h-5 w-2/3 max-w-sm rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-muted" />
                <div className="h-6 w-32 rounded-full bg-muted" />
              </div>
              <div className="space-y-3 py-4">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
              <div className="h-10 w-36 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
