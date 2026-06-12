// solution — GET /api/practice/questions/[id]/solution returns correct_answer, explanation, solution_svg
import { NextRequest, NextResponse } from "next/server";
import { fetchPracticeQuestionSolution } from "@/lib/practiceQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const solution = await fetchPracticeQuestionSolution(id);
    if (!solution) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(solution);
  } catch (err) {
    console.error("[GET /api/practice/questions/[id]/solution]", err);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}
