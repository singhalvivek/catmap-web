// submit-attempt — POST /api/submit-attempt; grades answers server-side and saves to MongoDB
import { NextRequest, NextResponse } from "next/server";
import { gradeAndSaveAttempt, DuplicateAttemptError } from "@/lib/dailyQuizQueries";

type RequestBody = {
  date: string;
  uid: string;
  responses: Record<string, number | null>;
  timings: Record<string, number>;
  totalTimeSeconds: number;
};

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { date, uid, responses, timings, totalTimeSeconds } = body;

  if (!date || !uid || typeof responses !== "object" || typeof totalTimeSeconds !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await gradeAndSaveAttempt({ date, uid, responses, timings, totalTimeSeconds });
    // Return result; completedAt is a Date — serialise explicitly
    return NextResponse.json({
      ...result,
      completedAt: result.completedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof DuplicateAttemptError) {
      return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }
    console.error("[POST /api/submit-attempt]", err);
    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 });
  }
}
