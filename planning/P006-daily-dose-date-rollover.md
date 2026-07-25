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

## Follow-up fixes (post-review)

Code review of the first commit surfaced four bugs in the touched files. Three
were pre-existing (from `50038b6 daily-dose (#31)`); one was a consequence of
this change. All are now fixed, plus a fifth found while fixing them.

1. **`essay/[date]` burned essays on arbitrary URLs.** `generateMetadata` called
   the write-on-miss `fetchOrPickDailyEssay` on the *raw* route param, before
   the format and past-date guards that only ran in the page body. Any URL like
   `/essay/1999-01-01` inserted a `daily_essays` row and permanently retired an
   essay into `used_essays`; enumeration drained the pool. Added a read-only
   `fetchDailyEssay`, extracted the guard into `isViewablePastDate`, and applied
   it in both `generateMetadata` and the page. This route can no longer write.
2. **Same hole in `GET /api/daily-essay`** — validated the date's *format* but
   not that it was today, so a public endpoint could drain the pool. Now only
   today picks; other dates read. Returns 404 (not 503) when a non-today date
   has no stored essay.
3. **Archive page 500'd whenever it had content.** `archive/page.tsx` passed
   `onMouseEnter`/`onMouseLeave` to a `<div>` in a Server Component — a hard
   render error on any request returning ≥1 entry, invisible to typecheck and
   build. Replaced with a Tailwind `hover:` class, keeping it a Server
   Component. Verified: the page now returns 200 with 33 entries.
4. **The pick race, widened by this change** (was filed out-of-scope below, now
   closed). `fetchOrPickDailyEssay` did an unguarded find-then-insert; going
   dynamic moved it from once/hour to once/request. Now a unique index on
   `daily_essays.date` plus a `$setOnInsert` upsert, with duplicate-key fallback
   to re-read. `used_essays` is only written by the request that actually
   inserted, so a lost race no longer burns an essay nobody was served. The
   index is created once per process and non-fatally — a pre-existing duplicate
   must not take the essay pages down.
5. **`DailyChallengeCard` date label.** Rendered `toLocaleDateString` with no
   `timeZone` inside a statically prerendered page, shipping the build day's
   date in the HTML and mismatching on hydration. Now derived from the IST date
   string via `formatISTDateLong`, and gated behind `useSyncExternalStore` so it
   is omitted from the static HTML rather than baked in.

## Corrected: the `essay/[date]` "cached 404" was not real

An earlier revision of this doc filed a bug saying `essay/[date]` caches its own
404 for up to 24h because of `revalidate = 86400`. That was wrong — it was read
out of the source without checking the build classification.

The route has no `generateStaticParams`, so the segment never enters the
static/ISR pipeline and `revalidate` is inert. Measured against a production
build:

| Route | Build mark | `Cache-Control` | `x-nextjs-cache` |
|---|---|---|---|
| `/cat-prep` | ○ Static | `s-maxage=31536000` | `HIT` |
| `/cat-prep/pyq/[slug]` | ● SSG | `s-maxage=31536000` | `HIT` |
| `challenge` (`force-dynamic`) | ƒ | `private, no-cache, no-store` | *(none)* |
| `essay/[date]` (`revalidate=86400`) | ƒ | `private, no-cache, no-store` | *(none)* |

`essay/[date]` is byte-identical to a force-dynamic route: no cache entry is
ever written, so there is no stale 404 to serve. The `revalidate` line has been
removed as dead, misleading config; headers are unchanged afterwards, which
confirms it was doing nothing.

Still available as a real improvement, deliberately not taken here: adding
`generateStaticParams` over past essay dates would prerender ~33 pages and is a
genuine SEO win — but it would *create* the cached-404 boundary problem
described above, so it needs that handled and is not a merge-day change.

## Fixed: `localStorage` keys were not user-scoped

`dc_result_<date>` and `dc_draft_<date>` carried no `uid`, and `getStoredResult`
returns the local hit *before* ever calling the API:

```ts
const local = readLocalResult(keyPrefix, id);
if (local) return local;   // never reaches the API
```

So on a shared browser, user B signing in after user A read A's stored result
and was told they had already completed today's challenge — permanently, not
transiently, and with no way to take it. Drafts were worse: B could resume A's
half-finished attempt and submit it under B's own account.

`pyqMockStore` wraps the same `sectionedTestStore` and had the identical bug
keyed on `paperSlug` rather than a date, so a PYQ mock result leaked between
users indefinitely rather than for one day.

Keys are now `${keyPrefix}_${uid}_draft_${id}` / `..._result_${id}`, scoped in
the shared store so both features are fixed at once. `uid` (not `displayName`)
because display names are neither unique nor stable — two users with the same
name would still collide, and renaming a Google profile would orphan that
user's own saved result.

Known consequence: pre-existing unscoped keys are orphaned. Harmless for
results, which re-fetch from the API and re-cache under the new key, but anyone
mid-attempt at deploy time loses their draft. Scoping also fixes *app*
behaviour, not data-at-rest — A's answers remain in B's browser storage and
readable via devtools. Clearing keys on sign-out would close that, and is not
done here.

## Out of scope — found while investigating, filed not fixed

1. **Essay data is not cached at all now.** Both "today" pages and `essay/[date]`
   hit Mongo on every request. Correct, but if the DB read ever shows up in
   metrics, the fix is `"use cache"` keyed on date — which needs `cacheComponents`
   enabled app-wide.
