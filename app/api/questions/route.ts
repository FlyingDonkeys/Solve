import { fetchQuestions } from "@/lib/question-data";

export async function GET(request: Request) {
  const offset = Number(new URL(request.url).searchParams.get("offset") ?? 0);

  if (!Number.isSafeInteger(offset) || offset < 0) {
    return Response.json({ error: "Invalid offset" }, { status: 400 });
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
