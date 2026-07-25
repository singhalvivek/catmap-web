# P006 — Daily Dose date rollover: stop baking "today" into the ISR cache

## Problem

`/cat-prep/daily-dose/challenge` and `/cat-prep/daily-dose/essay` are ISR pages
(`export const revalidate = 3600`). Each computes today's IST date **at render
time** and passes it into the client component:

```ts
export const revalidate = 3600;

export function getTodayDate(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function DailyChallengePage() {
  const date = getTodayDate();
  const rawTest = await fetchDailyTest(date).catch(() => null);
  return <DailyChallengePageClient test={test} date={date} />;
}
```

Because `date` is part of the cached render, it is frozen for the life of the
cache entry. For up to ~an hour after IST midnight the page still reports
**yesterday's** date, and every downstream decision inherits that:

- A returning user who completed yesterday's challenge lands on the page and
  `getDailyChallengeResult(uid, yesterday)` resolves — they see yesterday's
  `ResultView` and it looks like today's challenge is already done.
- A new visitor is served **yesterday's question set**.
- Same for the essay page: yesterday's essay, and submissions gated on the
  wrong date.

It self-corrects once ISR regenerates, but it is a broken window every single
day at the exact moment the feature is supposed to turn over.

**Not affected:** user scores. Nothing user-specific is server-rendered. Results
and streaks are fetched client-side after auth resolves
(`DailyChallengePageClient` → `getDailyChallengeResult` → `localStorage`, then
`/api/daily-challenge-result`, a dynamic route). The cache only ever held public
data. That part of the design is correct and stays as-is.

## Secondary problem — the same helper, eight times

`new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10)` is
copy-pasted across eight files under three different names (`getTodayDate`,
`getTodayIST`, inline). One of them is exported from a **page module** and
imported by another page:

```ts
// review/page.tsx
import { getTodayDate } from "../page";
```

Importing a non-route export out of a `page.tsx` couples two routes through
Next's routing layer and would silently break if the challenge page ever became
a client component or changed its exports.

## Goal

1. Today's IST date is resolved **per request** on the two "today" pages, so the
   rollover is exact.
2. One shared `getTodayIST()` used everywhere.
3. `review/page.tsx` no longer imports from `challenge/page.tsx`.

## Approach

**Make the two "today" pages dynamic.** Replace `export const revalidate = 3600`
with `export const dynamic = "force-dynamic"`.

Rejected alternatives:

- *Shorter `revalidate`* — any non-zero value keeps the bug, just narrows it.
- *Resolve the date client-side* — adds a loading waterfall and would force the
  test payload to a client fetch, hurting both TTFB and SEO.
- *`unstable_cache` keyed on date* — correct and faster, but `unstable_cache` is
  deprecated in Next 16 in favour of `"use cache"`, and `"use cache"` requires
  turning on `cacheComponents` app-wide. Too large a blast radius for this fix.
  Worth revisiting if the DB read ever shows up in metrics.

**Cost:** one Mongo round-trip per page view instead of one per hour.
`fetchDailyTest` is 2–3 `findOne`/`find` calls against indexed fields on a
pooled connection; `fetchOrPickDailyEssay` is a single `findOne` on the happy
path. The sibling review page (`force-dynamic`) already runs `fetchDailyTest`
per request, so this is a load profile the app is known to handle. SEO is
unaffected — the pages still server-render in full for crawlers.

## Files affected

| File | Change |
|---|---|
| `src/lib/dateIST.ts` | **New.** `getTodayIST()` — single source of truth. Pure, client-safe. |
| `src/app/cat-prep/daily-dose/challenge/page.tsx` | `revalidate` → `force-dynamic`; drop local `getTodayDate`, import shared |
| `src/app/cat-prep/daily-dose/essay/page.tsx` | `revalidate` → `force-dynamic`; drop local `getTodayIST`, import shared |
| `src/app/cat-prep/daily-dose/challenge/review/page.tsx` | Import `getTodayIST` from lib, not from `../page` |
| `src/app/cat-prep/daily-dose/essay/archive/page.tsx` | Drop local copy, import shared |
| `src/app/cat-prep/daily-dose/essay/[date]/page.tsx` | Drop local copy, import shared (no caching change — see Out of scope) |
| `src/app/cat-prep/components/DailyChallengeCard.tsx` | Drop local copy, import shared |
| `src/app/cat-prep/components/DailyEssayCard.tsx` | Drop local copy, import shared |
| `src/app/api/daily-essay/submit/route.ts` | Drop inline copy, import shared |
| `src/lib/dailyDoseQueries.ts` | Drop local copy, import shared |

## Acceptance criteria

- [ ] Neither "today" page exports `revalidate`; both export `dynamic = "force-dynamic"`.
- [ ] Exactly one definition of the IST-today expression in `src/`.
- [ ] No module imports anything from a `page.tsx`.
- [ ] Crossing IST midnight, a reload serves the new day's date on the first request — no stale window.
- [ ] A user with a saved result still sees `ResultView` on revisit (unchanged behaviour).
- [ ] `npm run build` and `npm run lint` clean.

## Test plan

1. `npm run build` — confirm both pages report as dynamic (`ƒ`), not static/ISR (`○`/`●`).
2. Fake the rollover: temporarily change the offset in `getTodayIST` so "today"
   becomes a date with no quiz, reload, confirm `NoChallengeTodayView`; revert,
   reload, confirm today's test returns immediately. No rebuild in between —
   that is the property ISR was breaking.
3. Complete a challenge → reload → `ResultView` with the score. Hard-reload with
   `localStorage` cleared → score still restored via the API.
4. Signed out → sign-in gate. Sign in → result loads.
5. `/cat-prep/daily-dose/essay/<yesterday>` still renders; `<today>` still 404s.

## Out of scope — found while investigating, filed not fixed

1. **`essay/[date]` caches its own 404.** The page is `revalidate = 86400` and
   calls `notFound()` when `date >= today`. Today's date is therefore cached as
   a 404 for up to 24h, so the URL can stay 404 well into the day it becomes
   valid. Fixing properly means either making the page dynamic (costing the
   static caching that these past-essay pages *should* have for SEO) or
   switching to a read-only `fetchDailyEssay` and rethinking the view-only gate.
   Needs a design decision.
2. **`fetchOrPickDailyEssay` write race.** It picks and inserts an essay on the
   first request for a date. Under `force-dynamic` concurrent first-hits after
   midnight can both miss the `findOne` and insert twice, burning two essays.
   The race already exists with ISR regeneration; this widens it. Fix is a
   unique index on `daily_essays.date` plus an upsert — a schema change.
3. **`localStorage` result key is not user-scoped.** `dc_result_<date>` has no
   `uid` (`sectionedTestStore.ts`), so on a shared browser a second user sees
   the first user's score until the API call corrects it.
