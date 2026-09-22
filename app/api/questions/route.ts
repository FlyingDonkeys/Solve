import { fetchQuestions } from "@/lib/question-data";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const offset = Number(new URL(request.url).searchParams.get("offset") ?? 0);

  if (!Number.isSafeInteger(offset) || offset < 0) {
    return Response.json({ error: "Invalid offset" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    return Response.json(await fetchQuestions(offset));
  } catch (error) {
    console.error("Question batch fetch failed:", error);
    return Response.json(
      { error: "Unable to load more problems" },
      { status: 500 },
    );
  }
}
