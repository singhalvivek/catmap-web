// daily-essay/submit — POST /api/daily-essay/submit; saves a user's essay responses
import { NextRequest, NextResponse } from "next/server";
import { saveEssaySubmission, DuplicateEssaySubmissionError } from "@/lib/essayQueries";
import { getTodayIST } from "@/lib/dateIST";

type RequestBody = {
  date: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  answers: Record<string, string>;
};

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { date, userId, displayName, answers } = body;
  if (!date || !userId || !displayName || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Submissions only allowed for today (IST)
  if (date !== getTodayIST()) {
    return NextResponse.json({ error: "Submissions are only open for today's essay" }, { status: 403 });
  }

  try {
    const id = await saveEssaySubmission({
      date,
      userId,
      displayName,
      photoUrl: body.photoUrl ?? null,
      answers,
    });
    return NextResponse.json({ id });
  } catch (err) {
    if (err instanceof DuplicateEssaySubmissionError) {
      return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }
    console.error("[POST /api/daily-essay/submit]", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
