// rc-solution — GET /api/practice/rcs/[rcNumber]/solution/[qNum] returns answer + explanation
import { NextRequest, NextResponse } from "next/server";
import { fetchRcQuestionSolution } from "@/lib/practiceQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ rcNumber: string; qNum: string }> }
) {
  const { rcNumber, qNum } = await params;

  const rc = parseInt(rcNumber, 10);
  const q = parseInt(qNum, 10);

  if (isNaN(rc) || isNaN(q)) {
    return NextResponse.json({ error: "Invalid rcNumber or qNum" }, { status: 400 });
  }

  try {
    const solution = await fetchRcQuestionSolution(rc, q);
    if (!solution) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(solution);
  } catch (err) {
    console.error("[GET /api/practice/rcs/[rcNumber]/solution/[qNum]]", err);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}
