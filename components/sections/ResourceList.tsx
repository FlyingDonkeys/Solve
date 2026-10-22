import { FolderOpen } from "lucide-react";
import { ResourceCard } from "@/components/compounds/ResourceCard";
import type { PracticeResource } from "@/lib/resources";

export function ResourceList({ resources }: { resources: PracticeResource[] }) {
  return (
    <main className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">H2 Mathematics</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Resources</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">Looking for additional study materials? Look no further.</p>
        </div>
        <span className="meta-badge">{resources.length} {resources.length === 1 ? "resource" : "resources"}</span>
      </header>
      {resources.length > 0 ? (
        <section aria-label="Practice papers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource.path} resource={resource} />)}
        </section>
      ) : (
        <section className="surface-panel px-6 py-14 text-center">
          <FolderOpen aria-hidden="true" className="mx-auto mb-4 size-7 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No resources yet.</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">Check back soon for more resources.</p>
        </section>
      )}
    </main>
  );
}
