# P005 — Mode-Aware Progress Bars (Learn / Practice / PYQ)

## Goal

The roadmap hero progress bar currently always shows Learn-mode subtopic
completion (`X/53 subtopics`), regardless of which pill (Learn/Practice) is
active. Make it contextual:

- **Learn** — unchanged: `X/53 subtopics` from `ProgressContext` (Learn
  completion marks).
- **Practice** — `X/93 subtopics practiced`, where a "subtopic" is whatever
  the existing practice storage-key granularity already is (a Quant chapter,
  a DILR set, an RC passage), and one counts as done once **every** question
  in it has been attempted — 20/20 for a Quant chapter, 4/4 for a DILR set or
  RC passage (both confirmed to always have exactly 4 questions per
  `percentyl_frontend_guide.md`'s collection table). 93 = 23 Quant chapters +
  20 DILR sets (2 chapters × 10 sets) + 50 RC passages. "Odd One Out"/"Para
  Jumbles"/"Para Summary" are excluded — they're listed in
  `practiceChapters.ts` but have no built player yet (`PracticeTopicRow`'s
  `chapterHref` points them at a route that doesn't exist), so they'd be
  permanently stuck at 0 and cap the bar below 100% forever.
- **PYQ** (`/cat-prep/pyq` index page, which has no bar today) —
  `X/20 PYQ solved`, a flat target regardless of how many papers exist.
  Counts answered questions from **both** the browse player and mock-test
  attempts, taking `max(browseAnswered, mockAnswered)` per paper before
  summing (so attempting the same paper both ways doesn't double-count).

"Solved"/"practiced" means **attempted**, not necessarily correct — matches
what `usePracticeProgress`'s `answers` map already tracks.

Each bar gets a small "i" info button (no existing tooltip component in the
codebase — building one) explaining what the number means, e.g. for PYQ:
"Solving ~20 official CAT questions is generally enough hands-on exposure to
prepare for the format — this counts questions from both Practice and Mock
Test mode."

## Data Sources & New Aggregation

No aggregation across many storage keys exists today — `usePracticeProgress`
only ever reads one key at a time. `ContinuePractice.tsx` is the closest
precedent: it scans `localStorage` directly (prefix `sn_practice__`) rather
than querying Firestore, to list in-progress chapters. This spec follows the
same precedent for the Practice bar and the browse half of the PYQ bar —
client-only, localStorage-scan, no new Firestore collection query (cross-device
parity is intentionally left for later, consistent with `ContinuePractice`'s
own existing trade-off).

The mock half of the PYQ bar is new: mock attempts live in MongoDB
(`pyq_attempts`), not localStorage, so a small API route is needed.

### New files

| Path | Purpose |
|------|---------|
| `src/app/cat-prep/components/InfoTooltip.tsx` | Small "i" button; click-to-toggle popover (not hover-only, for mobile) |
| `src/app/cat-prep/components/ModeProgressBar.tsx` | Shared bar UI: label, `current/total`, `InfoTooltip` |
| `src/app/cat-prep/lib/usePracticeMasterySummary.ts` | Client hook — scans `localStorage`, returns `{done, total}` for Practice subtopics |
| `src/app/cat-prep/lib/usePyqSolvedSummary.ts` | Client hook — scans `localStorage` for PYQ browse progress, fetches `/api/pyq/progress` for mock progress, merges, returns `{solved, target: 20}` |
| `src/app/api/pyq/progress/route.ts` | `GET ?uid=` → `Record<paperSlug, number>` of mock-answered-question counts, from `pyq_attempts` |
| `src/app/cat-prep/pyq/PyqProgressBar.tsx` | Client wrapper rendering `ModeProgressBar` on the PYQ index page (needs `auth.currentUser`, so can't be the server `page.tsx` itself) |

### Modified files

| Path | Change |
|------|--------|
| `src/lib/pyqQueries.ts` | Add `getPyqMockAnsweredCounts(uid)` — queries `pyq_attempts` by `userId`, sums `responses` with non-null `given` per paper |
| `src/app/cat-prep/components/RoadmapContent.tsx` | Replace the always-Learn bar with a mode-aware one: Learn keeps current behavior, Practice renders `ModeProgressBar` fed by `usePracticeMasterySummary` |
| `src/app/cat-prep/pyq/page.tsx` | Render `<PyqProgressBar />` below the header |
| `src/constants/practiceChapters.ts` | No data change — just read from, to enumerate the 93 trackable subtopics (Quant chapters directly; DILR/RC via their known fixed set/passage counts) |

## Acceptance Criteria

- [ ] On `/cat-prep`, switching to the Practice pill changes the bar to `X/93 subtopics practiced`; switching back to Learn restores `X/53 subtopics`.
- [ ] A Quant chapter counts once all 20 of its questions are attempted; a DILR set or RC passage counts once all 4 are attempted — partial attempts don't count.
- [ ] "Odd One Out"/"Para Jumbles"/"Para Summary" are excluded from the Practice denominator.
- [ ] `/cat-prep/pyq` shows `X/20 PYQ solved`, summing browse + mock answers per paper via `max()`, not a plain sum (no double-counting the same paper attempted both ways).
- [ ] Clicking the "i" button shows an explanation; clicking elsewhere closes it; works on mobile (not hover-dependent).
- [ ] `/api/pyq/progress?uid=` returns `{}` for a user with no mock attempts, not an error.
- [ ] `tsc --noEmit` and lint clean.

## Out of Scope

- Cross-device parity for the Practice/PYQ-browse bars (matches `ContinuePractice`'s existing localStorage-only precedent).
- Any change to how Learn-mode progress is tracked.
