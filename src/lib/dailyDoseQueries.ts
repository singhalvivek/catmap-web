// dailyDoseQueries — server-side streak computation for the Daily Dose section.
// A day "counts" toward the streak if the user did the daily essay OR the daily challenge.
import { getDb } from "./mongodb";

export type DailyDoseStreak = {
  streak: number;
  essayDoneToday: boolean;
  challengeDoneToday: boolean;
};

/** Today's date in IST (YYYY-MM-DD) — matches the date keys used across daily features. */
function getTodayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Returns the date `n` days before `dateStr` (YYYY-MM-DD), in UTC-safe arithmetic. */
function shiftDate(dateStr: string, deltaDays: number): string {
  const ms = Date.parse(`${dateStr}T00:00:00Z`) + deltaDays * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Compute the user's current Daily Dose streak plus today's completion flags.
 * Streak = count of consecutive days (ending today, or yesterday if today not yet done)
 * on which the user completed either the essay or the challenge.
 */
export async function getDailyDoseStreak(uid: string): Promise<DailyDoseStreak> {
  const db = await getDb();

  const [quizDates, essayDates] = await Promise.all([
    db.collection("quiz_attempts").distinct("date", { userId: uid }),
    db.collection("essay_submissions").distinct("date", { userId: uid }),
  ]);

  const done = new Set<string>([
    ...(quizDates as string[]),
    ...(essayDates as string[]),
  ]);

  const today = getTodayIST();
  const yesterday = shiftDate(today, -1);

  const essayDoneToday = (essayDates as string[]).includes(today);
  const challengeDoneToday = (quizDates as string[]).includes(today);

  // Anchor the streak at today if done, otherwise at yesterday (today still open).
  let cursor: string;
  if (done.has(today)) {
    cursor = today;
  } else if (done.has(yesterday)) {
    cursor = yesterday;
  } else {
    return { streak: 0, essayDoneToday, challengeDoneToday };
  }

  let streak = 0;
  while (done.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return { streak, essayDoneToday, challengeDoneToday };
}
