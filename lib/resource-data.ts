import "server-only";

import { adminClient } from "@/lib/supabase/client";
import { RESOURCES_BUCKET, RESOURCES_FOLDER } from "@/lib/resources";
import { PracticeResource } from '../types/resources';

// All signed-in users can access PDFs under this folder, as with the question bank.
export async function fetchPracticeResources(): Promise<PracticeResource[]> {
  const resources: PracticeResource[] = [];

  const { data: resourceData, error } = await adminClient
    .from("resources")
    .select(`
      resource_id,
      resource_difficulty,
      resource_type
    `)
    .order("resource_difficulty", { ascending: true })
  
  if (error) {
      throw new Error(`Resource fetch failed: ${error.message}`);
  }

  const { data: files, error: storageError } = await adminClient.storage
    .from(RESOURCES_BUCKET)
    .list(RESOURCES_FOLDER, { limit: 1000 })
  
  if (storageError) {
    throw new Error(`Files fetch failed: ${storageError.message}`)
  }
  
  for (const resource of resourceData) {
    const file = files.find((file) => file.id == resource.resource_id)
    
    if (!file) {
      throw new Error(`Failed to fetch the file with object id ${resource.resource_id}`)
    }
    resources.push({
      path: `${RESOURCES_FOLDER}/${file.name}`,
      name: file.name,
      resource_type: resource.resource_type,
      resource_difficulty: resource.resource_difficulty
    })
  }

  return resources
}
