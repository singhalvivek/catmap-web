// dateIST — IST (UTC+5:30) date helpers shared by every Daily Dose surface
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Today's date as `YYYY-MM-DD` in IST, so the day turns over when Indian users expect it to. */
export function getTodayIST(): string {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * Formats a `YYYY-MM-DD` date for display, pinned to IST. Derived from the date
 * string rather than the clock, so it always agrees with `getTodayIST()` and
 * renders identically on server and client regardless of the viewer's timezone.
 */
export function formatISTDateLong(date: string): string {
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * A span of time as words: "45s", "3m", "3m 20s", "1h 2m 5s".
 *
 * There were three copies of this, in DailyChallengeCard, ResultView,
 * QuestionReviewCard and SectionSummaryRow, two of them identical and one
 * handling hours. This is the one that handles hours. SectionHeader has a
 * fourth function of the same name that is not this one at all - it renders a
 * running countdown as m:ss, which is a clock rather than a duration, and it
 * stays where it is.
 */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return s === 0 ? `${m}m` : `${m}m ${s}s`;
  return `${s}s`;
}
