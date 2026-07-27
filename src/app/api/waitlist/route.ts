// waitlist — POST /api/waitlist stores a homepage email signup in the waitlist collection
import { NextRequest, NextResponse } from "next/server";
import { saveWaitlistEntry } from "@/lib/waitlistQueries";
import { isValidEmail, normaliseEmail, MAX_EXAM_LENGTH } from "@/lib/waitlistValidation";

type RequestBody = { email?: unknown; exam?: unknown };

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.email !== "string" || typeof body.exam !== "string") {
    return NextResponse.json({ error: "Missing required fields: email, exam" }, { status: 400 });
  }

  const email = normaliseEmail(body.email);
  const exam = body.exam.trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!exam || exam.length > MAX_EXAM_LENGTH) {
    return NextResponse.json({ error: "Select which exam you're preparing for" }, { status: 400 });
  }

  try {
    const { created } = await saveWaitlistEntry({ email, exam, source: "landing_waitlist" });
    return NextResponse.json({ created });
  } catch (err) {
    console.error("[POST /api/waitlist]", err);
    return NextResponse.json({ error: "Could not save your email. Please try again." }, { status: 500 });
  }
}
