// dateIST — IST (UTC+5:30) date helpers shared by every Daily Dose surface
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Today's date as `YYYY-MM-DD` in IST, so the day turns over when Indian users expect it to. */
export function getTodayIST(): string {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
