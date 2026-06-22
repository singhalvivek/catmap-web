// daily-essay/vote — POST /api/daily-essay/vote; upvote/downvote/remove a submission
import { NextRequest, NextResponse } from "next/server";
import { saveEssayVote, SelfVoteError } from "@/lib/essayQueries";

type RequestBody = {
  submissionId: string;
  questionId: string;
  voterId: string;
  value: 1 | -1 | 0;
};

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { submissionId, questionId, voterId, value } = body;
  if (!submissionId || !questionId || !voterId || ![1, -1, 0].includes(value)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    await saveEssayVote({ submissionId, questionId, voterId, value });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SelfVoteError) {
      return NextResponse.json({ error: "Cannot vote on your own submission" }, { status: 403 });
    }
    console.error("[POST /api/daily-essay/vote]", err);
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}
