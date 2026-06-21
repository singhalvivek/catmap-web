# P004 — PYQ Section (Browse + Mock Test)

## Goal

Add a third entry point next to Learn/Practice on the roadmap page: **PYQ**.
Unlike Learn/Practice (which toggle content inline on `/cat-prep`), PYQ
navigates to a dedicated `/cat-prep/pyq` page listing every scraped CAT
previous-year paper (1990–2025). From there a student can either browse a
paper interactively (answer-then-reveal, practice-style) or attempt it as a
timed, 3-section mock test that mirrors the real exam.

Data source: `cracku_pyq_questions` / `cracku_pyq_comprehensions` in the
`StudyNaksha` MongoDB database — scraped from cracku.in by
`PYQ-scraper/scrape_cracku.py`. Verified present: 3,916 questions / 511
comprehensions across 39 papers, sections strictly `VARC`/`DILR`/`QA`, types
strictly `mcq`/`tita`. This is distinct from the `percentyl_*` collections
used by the existing Practice mode.

Confirmed decisions:
- Browse mode = interactive practice player (answer first, then reveal
  correct answer + explanation) — not a static answer-key page.
- Mock mode = real exam format: 3 sequential timed sections
  (VARC → DILR → QA), no jumping back once a section starts.
- Retakes = one attempt only per paper's mock test (same rule as Daily
  Challenge's `quiz_attempts`).

Two existing architectures cover most of this — extend/generalize them
(DRY) rather than forking copies:
- **Daily Challenge** (`src/app/cat-prep/daily-challenge/`) — multi-section,
  timed, server-graded test flow. `DailyTest`/`TestSection` already support
  an array of sections; `ResultView`/`SectionBreakdownCard` already loop over
  `result.sections`. Gap: nothing enforces sequential/locked section
  progression (works today only because it ships exactly 1 section).
- **Practice** (`PracticeOptionButton`, `PracticePalette`,
  `usePracticeProgress`) — the interactive reveal-on-demand player.

---

## Files Affected

### New files — data layer

| Path | Purpose |
|------|---------|
| `src/app/cat-prep/models/pyq.ts` | `PyqQuestion`, `PyqComprehension`, `PyqBlock`, `PyqSection`, `PyqPaper`, `PyqSolution`, `PyqPaperSummary` types |
| `src/lib/pyqQueries.ts` | Server-side MongoDB query functions (list below) |
| `src/constants/pyqPapers.ts` | Static `(slug, examYear, examSlot, label)[]` transcribed from `scrape_cracku.py`'s `PAPERS` list — used for index ordering without a DB round trip |
| `src/app/api/pyq/papers/route.ts` | `GET` → `PyqPaperSummary[]` (per-section question counts via aggregation) |
| `src/app/api/pyq/[paperSlug]/route.ts` | `GET` → `PyqPaper`, answers stripped |
| `src/app/api/pyq/[paperSlug]/questions/[id]/solution/route.ts` | `GET` → `PyqSolution` only |

### New files — browse player

| Path | Purpose |
|------|---------|
| `src/app/cat-prep/pyq/page.tsx` | Papers index, grouped by year |
| `src/app/cat-prep/components/PyqPapersList.tsx` / `PyqPaperRow.tsx` | Index UI — year groups, slot badges, "Practice" / "Take Mock Test" CTAs |
| `src/app/cat-prep/pyq/[paperSlug]/page.tsx` | Server page — fetches `PyqPaper` |
| `src/app/cat-prep/pyq/[paperSlug]/PyqPaperPlayer.tsx` | Client player — section tabs (VARC/DILR/QA), standalone questions via `PracticeOptionButton`/`TITAInput`, comprehension blocks as split-panel (passage + grouped questions, mobile tab fallback) |

### New files — mock test

| Path | Purpose |
|------|---------|
| `src/app/cat-prep/lib/useSectionedTest.ts` | Moved from `useDailyChallengeTest.ts`, renamed. Logic unchanged — it turned out to already be forward-only (no `goToPrevSection` exists), so PYQ's "no jumping back" requirement needed no new guard |
| `src/app/cat-prep/lib/sectionedTestStore.ts` | Generic localStorage draft/result helpers, parameterized by a `keyPrefix` string |
| `src/app/cat-prep/lib/pyqMockStore.ts` | Thin wrapper over `sectionedTestStore` with prefix `pyq_mock` |
| `src/app/api/pyq/[paperSlug]/mock/route.ts` | `GET` → `DailyTest`-shaped mock (3 timed sections), answers stripped |
| `src/app/api/pyq/[paperSlug]/submit/route.ts` | `POST` → grade + save to `pyq_attempts`; 409 on duplicate |
| `src/app/api/pyq/[paperSlug]/result/route.ts` | `GET ?uid=` → stored result or null |
| `src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx` | Server page — fetches the mock test + static paper label |
| `src/app/cat-prep/pyq/[paperSlug]/mock/PyqMockPageClient.tsx` | Auth gate / resume-draft / completed-result states, parallel to `DailyChallengePageClient.tsx` but keyed by `paperSlug` |
| `src/app/cat-prep/pyq/[paperSlug]/mock/PyqMockTestView.tsx` | Test-taking shell, parallel to `TestView.tsx` — reuses `useSectionedTest`, `SectionHeader`, `QuestionPalette`, `QuestionRenderer`, `ResultView` as-is |

Daily Challenge's own orchestrator files (`TestView.tsx`, `DailyChallengePageClient.tsx`, `daily-challenge/page.tsx`) are **not modified** — risk to the live feature was judged not worth the dedup of ~150 lines of submit/draft "glue" logic that's inherently feature-specific anyway (different endpoints, copy, analytics taxonomy). What's shared instead is the parts that actually carry risk/complexity: the timer/section state machine (`useSectionedTest`), the localStorage persistence (`sectionedTestStore`), and every presentational component (`SectionHeader`, `QuestionPalette`, `QuestionRenderer`, `MCQOptions`, `TITAInput`, `ComprehensionBlock`, `ResultView`, `SectionBreakdownCard`, `QuestionReviewList`).

### Modified files

| Path | Change |
|------|--------|
| `src/app/cat-prep/daily-challenge/lib/useDailyChallengeTest.ts` | Thin re-export of `useSectionedTest` under the old name — zero behavior change (verified: hook body is identical other than the rename) |
| `src/app/cat-prep/lib/dailyChallengeStore.ts` | Thin wrapper around `sectionedTestStore` with prefix `dc` — produces identical localStorage keys and API URLs to before |
| `src/app/cat-prep/daily-challenge/components/ResultView.tsx` | New optional props (`title`, `backHref`, `backLabel`, `analyticsEvent`) defaulting to the previous hardcoded values; existing call sites pass none of them, so Daily Challenge behavior is unchanged |
| `src/app/cat-prep/daily-challenge/components/SectionHeader.tsx` | New optional `backHref` prop, defaults to `/cat-prep` (previous hardcoded value) |
| `src/app/cat-prep/daily-challenge/components/TITAInput.tsx` | New optional `disabled` prop (used by the PYQ browse player), defaults to `undefined`/falsy — existing call site unaffected |
| `src/app/cat-prep/components/PyqPaperRow.tsx` | "Take Mock Test" now links to `/cat-prep/pyq/[paperSlug]/mock` (was a disabled "coming soon" button) |
| `src/app/cat-prep/components/RoadmapContent.tsx` | **Not yet done** — Phase 4, still pending |

### `pyqQueries.ts` functions

- `fetchPyqPapersIndex()` — aggregates `cracku_pyq_questions` grouped by `paperSlug` × `section` for counts.
- `fetchPyqPaper(paperSlug)` — full paper as flat `sections[].questions[]`, each question carrying its `comprehension` inline (mirrors `dailyChallenge`'s `Question.comprehension` shape) — kept flat so the same data feeds both the browse player and the Phase 3 mock-test transform without one undoing the other's grouping; answers excluded via MongoDB projection, not just omitted when mapping. Grouping consecutive same-comprehension questions into a single split-panel block is the browse player's job (Phase 2, presentation-only).
- `fetchPyqQuestionSolution(paperSlug, questionId)` — `{ correctOptionIndex | correctAnswer, explanation }` only.
- `fetchPyqMockTest(paperSlug)` — calls `fetchPyqPaper` and reshapes its flat sections into the `DailyTest` shape (one uniform `timeLimitSeconds` per section from `PYQ_MOCK_SECTION_TIME_SECONDS`, no per-question timer); answers stripped.
- `gradeAndSavePyqMockAttempt({ paperSlug, uid, responses, timings, totalTimeSeconds })` — same grading as `gradeAndSaveAttempt` (+3/-1 MCQ, +3/0 TITA), graded per-section then summed; saves to new `pyq_attempts` collection; throws `DuplicatePyqAttemptError` on resubmission. Note: like the existing `quiz_attempts` collection, the duplicate check is an app-level `findOne`, not a DB unique index — a pre-existing, symmetric race-condition risk (two simultaneous submits), not something this PR introduced or fixed.
- `getStoredPyqMockResult(uid, paperSlug)` — cross-device fallback read.

---

## Env Vars (new, `.env.local`)

```
PYQ_MOCK_SECTION_TIME_SECONDS=2400   # 40 min/section default, matches current CAT format
```

## URL Patterns

```
/cat-prep/pyq
/cat-prep/pyq/[paperSlug]
/cat-prep/pyq/[paperSlug]/mock
```

---

## Acceptance Criteria

### Data layer
- [x] `GET /api/pyq/papers` returns all 39 papers with accurate per-section counts.
- [x] `GET /api/pyq/[paperSlug]` returns sections in VARC → DILR → QA order, no `correctAnswer`/`correctOptionIndex`/`explanation` anywhere in the payload (enforced via MongoDB projection, not just response mapping).
- [x] Each question's `comprehension` field is populated when its source doc has a `comprehensionId`, in `questionNumber` order.
- [x] `GET /api/pyq/[paperSlug]/questions/[id]/solution` returns the answer + explanation for exactly one question.

### Browse player
- [x] Section tabs switch between VARC/DILR/QA without losing answered/revealed state in the other sections.
- [x] Standalone MCQ renders via `PracticeOptionButton`; standalone TITA renders via `TITAInput`.
- [x] Consecutive questions sharing the same `comprehension.id` within a section render grouped as a split panel (passage left, grouped questions right) — grouping computed client-side from the flat question list; mobile collapses to tabs.
- [x] Checking an answer reveals correct/wrong highlighting + explanation, fetched on demand (never present in initial HTML — view-source check).
- [x] Progress persists per paper via `usePracticeProgress(storageKey = paperSlug)`.
- [x] MathJax renders cracku's `$$...$$` inline LaTeX (found via manual testing — cracku's delimiter differs from percentyl's single `$`; both are now configured globally, double-dollar checked first).

### Mock test
- [x] Sections advance forward-only — no UI path or hook-level path back to a prior section once advanced (confirmed: the hook has no `goToPrevSection` at all).
- [x] Each section has its own countdown from `PYQ_MOCK_SECTION_TIME_SECONDS`; time-out auto-advances to the next section (or submits, on the last section) — shared logic from `useSectionedTest`, same as Daily Challenge.
- [x] Submitting grades server-side (+3/-1 MCQ, +3/0 TITA) and stores to `pyq_attempts`.
- [x] Re-visiting `/cat-prep/pyq/[paperSlug]/mock` after submission shows the stored result, not a fresh attempt (409 + result fallback, mirroring Daily Challenge).
- [x] `ResultView` shows 3 `SectionBreakdownCard`s with correct/wrong/unattempted counts and per-question review (reused as-is).
- [ ] Manually click through a full attempt (sign in → answer → submit → result) in a real browser — verified via dev-server curl (pages render, APIs strip answers, 404/400 paths correct) and static tracing of the grading math, but not yet click-tested end-to-end since this environment has no browser driver.

### Regression
- [x] Daily Challenge end-to-end flow behaves identically after the `useSectionedTest`/`sectionedTestStore` generalization — verified by diffing the moved hook body (only change: one added comment) and confirming both untouched call sites (`TestView.tsx`, `DailyChallengePageClient.tsx`) pass no new props, plus a live `/cat-prep/daily-challenge` 200 check.

### Entry point
- [x] A "PYQ" pill/link appears next to Learn/Practice in the roadmap hero and navigates to `/cat-prep/pyq` (no inline toggle). Added directly inside `RoadmapNav.tsx` (single call site) as a third pill rendered as `next/link` rather than a mode-toggle button, with a `pyq_entry_clicked` analytics event.

---

## Test Plan

1. `tsc --noEmit` — zero errors.
2. Hit each new API route directly and confirm response shape + that no answer field leaks before solving/submitting.
3. Browse a paper with both an RC passage and a DILR set plus standalone MCQ/TITA questions — confirm grouping and reveal-on-demand.
4. Take a mock test end-to-end, including letting a section time out to confirm auto-advance, and confirm the results screen and one-attempt lock.
5. Re-run the existing Daily Challenge flow to confirm no regression from the shared-hook/store generalization.

---

## Phasing (separate PRs)

1. ✅ Data layer — model, queries, constants, 3 read-only API routes.
2. ✅ Browse player — index page + per-paper interactive player (plus a MathJax fix once raw `$$...$$` LaTeX was spotted not rendering).
3. ✅ Mock test — hook/store generalization (Daily Challenge unaffected), mock API routes, mock page.
4. ✅ Wire the RoadmapNav entry point.

## Out of Scope (this spec)

- Bulk "completed" status across all 39 papers on the index page (v1 checks localStorage per-paper lazily, same simplification Daily Challenge uses).
- Percentile estimation — only raw score (matches Daily Challenge).
- Admin curation tooling for PYQ papers (no admin workflow requested; data is static once scraped).
- Historical per-year section timing accuracy — uses one configurable default for all years.
