import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { fetchPracticeResources } from "@/lib/resource-data";
import { RequireLogin } from "@/components/RequireLogin";
import { ErrorPage } from "@/components/ErrorPage";
import { ResourceList } from "@/components/sections/ResourceList";

export const metadata: Metadata = {
  title: "Resources | Solve",
  description: "Browse and download H2 Mathematics practice papers.",
};

export default async function ResourcesPage({ searchParams }: PageProps<"/resources">) {
  if ((await searchParams).auth_error === "1") return <ErrorPage />;
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return <RequireLogin path="/resources" reason="Sign in to browse practice papers, view them online, and download a copy to work through at your own pace." />;
  }

  const resources = await fetchPracticeResources();
  return <ResourceList resources={resources} />;
}
