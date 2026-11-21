# P007 — PYQ Practice by Topic

## Goal

Past papers are only reachable one paper at a time. Someone who wants to drill Arithmetic,
or Para Summary, from the real exam has to open nine papers and scroll past everything
else. Practice gets a builder: pick a topic, pick any of the last ten exam years, and get
every CAT question on that topic from those years on one page, answerable inline with the
answer and explanation, exactly like the paper reader.

## The data

`cracku_pyq_questions` already carries topic tags — `topics: [{ slug, name }]`, written by
`PYQ-scraper/scrape_cracku_topics.py` from cracku's topic-wise question banks. For the
2017–2025 papers:

| Section | Questions | Tagged |
|---|---|---|
| QA | 612 | 612 |
| VARC | 642 | 642 |
| DILR | 576 | 467 |

Three things about the tags shape the catalog:

- **Umbrella tags are clean supersets.** Every question tagged Percentages, Profit and
  Loss, Time and Work … is also tagged Arithmetic; the same holds for Algebra and its
  subtopics. So "All Arithmetic" is the single `cat-arithmetic-questions` tag.
- **Some cracku topics are duplicates.** `cat-logarithms-questions` and
  `cat-logarithms-surds-indices-questions` tag the same 42 questions; Number Series and
  Progressions and Series the same 44; Time Speed Distance has two slugs. Each pair is one
  catalog topic over both tags.
- **Para Jumbles has no tag.** Cracku files them under the broad Verbal Ability tag with
  Odd One Out, Para Summary and sentence placement. They are separable without guessing:
  a Verbal Ability question that is TITA and not Odd One Out is a para jumble (63, every
  one with a 4- or 5-digit sequence answer); one that is MCQ and not Para Summary is a
  sentence-placement question (27). CAT 2024 had no para jumbles, and the data agrees.

"Last ten years" is 2016–2025, but there is no 2016 paper, so the year picker offers the
nine exam years 2017–2025. It is derived from `PYQ_YEARS_COVERED`, so a 2026 paper joins
it and 2017 drops out without an edit.

## URL shape

`/cat-prep/practice/pyq-by-topic?topic=arithmetic&year=2023&year=2022&year=2020`

A plain GET form: radios named `topic`, checkboxes named `year`. It submits without
JavaScript, and `next/form` makes it a client-side navigation when JavaScript is there.
Every selection is a shareable link. Unknown topics and out-of-range years are ignored, not
errors.

## Pages

All nine years of Reading Comprehension is 438 questions — a 4 MB page in one piece. A set
is split into pages of whole papers, about 80 questions each (`?page=2`), so a typical pick
(one topic, three years) stays on one page and the largest page is ~820 KB. Pages are laid
out from cached per-paper counts, and only the page being read is fetched with its answers.

## Progress

Answers are stored under the paper's own key (`usePracticeProgress(paperSlug)`, keyed by
question number) — the same key the paper reader uses. A question answered here shows as
answered when the full paper is opened, and counts towards the PYQ progress bar, with no
new storage shape.

## Files Affected

- `src/constants/pyqTopics.ts` — **new**. The topic catalog (section, group, tags, the two
  derived VARC rules) and the year window.
- `src/lib/pyqTopicQuery.ts` — **new**. Pure: parse the URL's selection; build the Mongo
  filter; sum per-paper counts into years; lay out pages; build page links.
- `src/lib/pyqQueries.ts` — per-topic per-paper counts in one `$facet` aggregate, cached for
  an hour and limited to papers in `PYQ_PAPERS` so counts and sets agree; fetch one page's
  papers with answers. The solved-question mapping moves into a helper shared with
  `fetchPyqPaperSolutions`.
- `src/app/cat-prep/models/pyq.ts` — `PyqTopicPaper`, `PyqTopicPaperCounts`, `PyqTopicCounts`.
- `src/app/cat-prep/components/PyqQuestionList.tsx` — **new**, extracted from
  `PyqPaperReader`: the question block, inline content and passage grouping.
- `src/app/cat-prep/lib/useMathJax.ts` — **new**, extracted from `PyqPaperReader`.
- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperReader.tsx` — uses the two extractions; no
  change in behaviour or markup.
- `src/app/cat-prep/practice/pyq-by-topic/page.tsx` — **new** route.
- `src/app/cat-prep/practice/pyq-by-topic/PyqTopicPicker.tsx` — **new**. Section tabs,
  topic chips with live counts, year chips with quick picks.
- `src/app/cat-prep/practice/pyq-by-topic/PyqTopicSet.tsx` — **new**. The questions, one
  block per paper, each with its own progress hook.
- `src/app/cat-prep/components/PyqTopicCard.tsx` — **new**. Promo card on the Practice
  surface.
- `src/app/cat-prep/components/RoadmapContent.tsx` — render the card in Practice mode.
- `src/constants/routes.ts` — the new path, and `PYQ_INDEX`.
- `src/app/sitemap.ts`, `src/app/sitemap-page/page.tsx` — list the builder page (base URL
  only; selections are not indexed).
- `src/app/globals.css` — focus ring for chip-styled radios and checkboxes; the picker
  layout.
- `src/__tests__/pyqTopics.test.ts` — **new**.
- `vitest.config.ts` — resolve tsconfig's `@/` alias, so a module under test can import the way
  the app does.

## Acceptance Criteria

- [x] Practice shows a card linking to the builder.
- [x] The builder lists Quant, DILR and VARC topics with question counts for the selected
      years; topics with none in those years are dimmed, and Start stays disabled while the
      selection holds no questions. (Dimmed, not disabled: a disabled radio drops out of the
      tab order and out of the submitted form.)
- [x] The year picker offers 2017–2025, with Last 3, Last 5, All and Clear.
- [x] Arithmetic + 2023, 2022, 2020 lists every Arithmetic question from those papers
      (73), newest paper first, each under its paper's name, with a link to the full paper.
- [x] Para Summary, Para Jumbles, Sentence Placement, Reading Comprehension and Odd One Out
      each return only their own question type; RC and DILR passages show once above their
      questions.
- [x] Check Answer, the verdict and the explanation behave as in the paper reader.
- [x] An answer given here appears in the paper reader for the same question (verified in
      the browser); the reverse holds by the same shared key.
- [x] Reloading keeps answers, signed out.
- [ ] Signed in, answers sync through Firestore. **Blocked outside this change**: the
      Firestore rules deny `users/{uid}/practiceProgress/*` (403 "Missing or insufficient
      permissions"), while `users/{uid}/progress/*` is allowed. Every practice player and the
      paper reader write there, and `practiceProgressStore` swallows the error, so practice
      sync has never worked. Needs this rule in the Firebase console:
      `match /users/{userId}/practiceProgress/{key} { allow read, write: if request.auth != null && request.auth.uid == userId; }`
- [x] Large sets are paged by whole papers; every question appears on exactly one page.
- [x] Unknown topic or years in the URL fall back to the builder, never a 500.
- [x] The paper reader is unchanged: same markup, same `q-<section>-<n>` anchors.
- [x] `tsc`, `eslint`, `vitest` (54 tests), `next build` clean; 51 Playwright checks pass
      against both `next dev` and `next start`.

## Test Plan

- Browser (Playwright): build Arithmetic 2023/2022/2020; answer one MCQ and one TITA;
  check verdicts; reload; open the matching paper and confirm the answer is there.
- Para Summary, Para Jumbles (enter the sequence), RC (passage grouping), a DILR set.
- Quick picks and Clear; Start disabled with no years; counts update as years change.
- Mobile width (390px) and dark theme.
- Signed in with Google: answer, reload in a fresh session, confirm Firestore restores it.
- Edge cases: `?topic=nope`, `?year=1990`, `?year=abc`, topic with no years, a topic and
  year with no questions.

## Out of Scope

- A timed mock for a topic set.
- The 109 untagged DILR questions (25 sets) — a scraper/data task.
- Indexing selection URLs for search.
