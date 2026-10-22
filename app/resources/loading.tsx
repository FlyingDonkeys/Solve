export default function ResourcesLoading() {
  return (
    <main className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <p role="status" className="sr-only">Loading practice papers…</p>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">H2 Mathematics</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Resources</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">Looking for additional study materials? Look no further.</p>
        </div>
      </header>

      <div aria-hidden="true" className="grid gap-4 motion-safe:animate-pulse sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="surface-panel space-y-6 p-6">
            <div className="size-10 rounded-lg bg-muted" />
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-11 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
