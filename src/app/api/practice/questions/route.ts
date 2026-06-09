// questions — GET /api/practice/questions?section=&topic=&chapter= returns questions without answers
import { NextRequest, NextResponse } from "next/server";
import { fetchPracticeQuestions } from "@/lib/practiceQueries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const section = searchParams.get("section");
  const topic = searchParams.get("topic");
  const chapter = searchParams.get("chapter");

  if (!section || !topic || !chapter) {
    return NextResponse.json(
      { error: "Missing required params: section, topic, chapter" },
      { status: 400 }
    );
  }

  try {
    const questions = await fetchPracticeQuestions(section, topic, chapter);
    return NextResponse.json(questions);
  } catch (err) {
    console.error("[GET /api/practice/questions]", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
