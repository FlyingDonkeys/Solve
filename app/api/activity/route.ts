import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.rpc("update_activity");
    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to record practice activity:", error);
    return Response.json({ error: "Unable to record activity" }, { status: 500 });
  }
}
