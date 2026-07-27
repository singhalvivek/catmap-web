# G007 — SEO Coverage and Keyword Targeting

## Goal

Two separate problems, both measured against the live production sitemap.

**Coverage.** 55 content pages exist and are not in the sitemap. Google cannot index a page it has never been told about and cannot reach by a link. The largest block is the daily essay archive — 37 pages of genuinely unique long-form content, already carrying `Article` schema and canonicals, and completely invisible.

**Keywords.** The pages that *are* listed often target phrases nobody searches. The PYQ paper pages are the clearest case: the URL slug is `cat-2025-slot-1-question-paper-solved`, matching real search behaviour, but the title reads `CAT 2025 — Slot 1 — CAT Previous Year Paper`, which says "CAT" twice and never uses "question paper with solutions". The RC practice pages are worse — `Reading Comprehension 12 — VARC Practice` does not contain the word "CAT" at all.

## Measured baseline

Production sitemap, fetched 2026-07-27: **194 URLs.** (The "73 pages" figure in the tracker is stale.)

| Bucket | In sitemap | Exists | Gap |
|---|---|---|---|
| Roadmap subtopics | 63 | 63 | — |
| RC practice passages | 50 | 50 | — |
| PYQ papers | 39 | 39 | — |
| Quant practice chapters | 22 | 25 | **3** |
| Roadmap topics + hubs | 15 | 15 | — |
| DILR practice sets | 2 | 20 | **18** |
| Daily essay archive | 0 | 37 | **37** |
| Essay archive hub | 0 | 1 | **1** |

Three of the 25 quant chapters in MongoDB are absent from the sitemap. Separately, `percentyl_practice_questions` holds VARC chapters — Para Jumbles, Para Summary, Odd One Out — that no route serves at all; those are a content decision, not a sitemap bug, and are out of scope here.

## Files Affected

- `src/app/sitemap.ts` — add essay archive entries and the archive hub; enumerate every DILR set rather than assuming one per chapter; give entries real `lastModified` dates.
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` — `generateStaticParams` hardcodes `setNumber: "1"`, so 18 of 20 sets render on demand. Enumerate them from the database.
- `src/app/cat-prep/daily-dose/essay/[date]/page.tsx` — add `generateStaticParams` for past essays so archive pages are prerendered rather than served `no-store`.
- `src/lib/essayQueries.ts` — expose the past-essay date list the sitemap and static params both need.
- `src/lib/practiceQueries.ts` — expose the DILR set numbers per chapter.
- `src/constants/pyqPapers.ts` — a title helper alongside the existing display label.
- `src/app/cat-prep/pyq/[paperSlug]/page.tsx` — retargeted title and description.
- `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx` — add "CAT" to the title.
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` — same.

## Keyword changes

| Page | Before | After |
|---|---|---|
| PYQ paper | `CAT 2025 — Slot 1 — CAT Previous Year Paper` | `CAT 2025 Slot 1 Question Paper with Solutions` |
| PYQ paper, no slot | `CAT 2005 — CAT Previous Year Paper` | `CAT 2005 Question Paper with Solutions` |
| RC passage | `Reading Comprehension 12 — VARC Practice` | `CAT Reading Comprehension Practice: Passage 12` |
| DILR set | `Bar Graphs Set 3 — DILR Practice` | `CAT DILR Practice: Bar Graphs Set 3` |

The display label (`pyqPaperLabel`) stays as it is — it is a UI heading, not a title tag, and the em dash reads better on screen. Only the `<title>` changes.

## `lastModified`

Every one of the 194 entries currently gets `new Date()` at build time, so each deploy claims all 194 pages changed simultaneously. That is a weak signal at best and a discounted one at worst. Entries now carry a real date where one exists — the essay's own date for archive pages — and a stable per-deploy date only where nothing better is available.

## Acceptance Criteria

- [ ] Sitemap contains an entry for all 37 past essays and the archive hub.
- [ ] Sitemap contains all 20 DILR sets, not 2.
- [ ] Sitemap URL count rises from 194 to roughly 250.
- [ ] Every sitemap URL returns 200 — no entry points at a page that 404s.
- [ ] `next build` prerenders all 20 DILR sets and the past essay pages.
- [ ] PYQ, RC and DILR titles contain "CAT" and the phrase a searcher would type.
- [ ] Every title stays under 60 characters so Google does not truncate it.
- [ ] Essay archive pages carry a `lastModified` matching the essay date.
- [ ] `tsc`, `eslint`, `vitest`, `next build` clean.

## Test Plan

- Build, fetch `/sitemap.xml`, count URLs per bucket and diff against the table above.
- Spot-check every new URL type returns 200 and not 404.
- Confirm no duplicate `<loc>` entries.
- Check rendered `<title>` on a PYQ paper, an RC passage and a DILR set.
- Confirm today's essay is *not* in the sitemap — that route rejects non-past dates and would 404.
- Edge cases: an essay date that exists but whose essay was deleted; a DILR chapter with zero sets.

## Out of Scope

- Anything requiring Google Search Console access — sitemap re-submission and indexing requests are manual and remain yours.
- Intro copy per paper/chapter page (September, Cowork brief).
- Internal linking between paper → chapter → subtopic (September).
- Routing the orphaned VARC practice chapters, which is a content decision.
