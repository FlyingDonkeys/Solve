import type { PracticeResource } from "@/types/resources";
import { ResourceGroup } from "../compounds/ResourceGroup";

export function ResourceList({ resources }: { resources: PracticeResource[] }) {
  const practicePapers = resources.filter(
    resource => resource.resource_type === "Practice Papers"
  );

  const notes = resources.filter(
    resource => resource.resource_type === "Notes"
  );

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
      <ResourceGroup groupName="Practice Papers" resources={practicePapers}/>
      <ResourceGroup groupName="Notes" resources={notes} />
    </main>
  );
}
