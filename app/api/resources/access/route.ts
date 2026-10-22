import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/client";
import { RESOURCES_BUCKET, resourceAccessSchema } from "@/lib/resources";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const parsed = resourceAccessSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return json({ error: "Invalid resource request." }, 400);
    const { resource_path, event_type } = parsed.data;

    // The fixed bucket and validated folder restrict what this admin client can sign.
    const { data, error } = await adminClient.storage.from(RESOURCES_BUCKET)
      .createSignedUrl(resource_path, 300, { download: event_type === "download_requested" });
    if (error && error.statusCode !== "404" && error.statusCode !== "400") throw error;
    if (error || !data?.signedUrl) {
      return json({ error: "This resource is unavailable. Please refresh and try again." }, 404);
    }

    const { error: activityError } = await adminClient.from("file_activity").insert({
      user_id: user.id, file_path: resource_path, event_type,
    });
    if (activityError) {
      console.error("Resource activity insert failed:", activityError.code);
      throw activityError;
    }

    return json({ url: data.signedUrl });
  } catch {
    return json({ error: "Unable to access this resource right now. Please try again." }, 500);
  }
}
