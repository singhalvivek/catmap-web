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
