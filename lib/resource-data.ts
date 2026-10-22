import "server-only";

import { adminClient } from "@/lib/supabase/client";
import { RESOURCES_BUCKET, RESOURCES_FOLDER, type PracticeResource } from "@/lib/resources";

// All signed-in users can access PDFs under this folder, as with the question bank.
export async function fetchPracticeResources(): Promise<PracticeResource[]> {
  const resources: PracticeResource[] = [];
  const limit = 1000;

  // Supabase paginates listings; fetch another batch only if the folder needs it.
  for (let offset = 0; ; offset += limit) {
    const { data, error } = await adminClient.storage.from(RESOURCES_BUCKET).list(RESOURCES_FOLDER, {
      limit, offset, sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;

    resources.push(...data
      .filter((resource) => resource.id && /\.pdf$/i.test(resource.name))
      .map((resource) => ({
        path: `${RESOURCES_FOLDER}/${resource.name}`,
        name: resource.name,
        size: resource.metadata?.size ?? null,
      })));

    if (data.length < limit) return resources;
  }
}
