# P001 — Practice Questions (Quant, DILR, VARC)

## Goal

Add a Practice mode alongside the existing Learn mode on the roadmap page.
The subject header element already in `RoadmapContent.tsx` becomes a split
pill — clicking the left half keeps Learn (current behaviour), clicking the
right half switches to Practice. Below the header the topic accordion adapts
to show practice chapters and a link into the question player.

No new page is needed for the index. The question player lives at a new nested
route under `/cat-prep/practice/`.

---

## Files Affected

### New files
| Path | Purpose |
|------|---------|
| `src/app/cat-prep/components/SubjectModeToggle.tsx` | Split "Learn / Practice" pill that replaces the plain subject header |
| `src/app/cat-prep/components/PracticeTopicRow.tsx` | Accordion row for a practice topic; shows chapters as chips |
| `src/app/cat-prep/components/PracticeChapterChip.tsx` | Chip linking to `/cat-prep/practice/…` |
| `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx` | MCQ / jumble question player |
| `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` | DILR set player (split panel) |
| `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx` | RC player (split panel) |
| `src/app/cat-prep/practice/quant/[topic]/[chapter]/QuestionPlayer.tsx` | Client component — MCQ state machine |
| `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/DilrPlayer.tsx` | Client component — DILR split panel |
| `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/RcPlayer.tsx` | Client component — RC split panel |
| `src/lib/practiceQueries.ts` | Server-side MongoDB query functions for all three collections |
| `src/app/api/practice/questions/route.ts` | `GET ?section=&topic=&chapter=` |
| `src/app/api/practice/questions/[id]/solution/route.ts` | `GET` — returns `correct_answer`, `explanation`, `solution_svg` |
| `src/app/api/practice/dilr/route.ts` | `GET ?chapter=` |
| `src/app/api/practice/dilr/[setNumber]/route.ts` | `GET ?chapter=` — single DILR set (no answers) |
| `src/app/api/practice/dilr/[setNumber]/solution/route.ts` | `GET ?chapter=` — `solution_text`, `solution_svg`, per-question answers |
| `src/app/api/practice/rcs/[rcNumber]/route.ts` | `GET` — single RC passage (no answers) |
| `src/app/api/practice/rcs/[rcNumber]/solution/[qNum]/route.ts` | `GET` — single question answer + explanation |
| `src/app/cat-prep/models/practice.ts` | TypeScript types for all three collections |

### Modified files
| Path | Change |
|------|--------|
| `src/app/cat-prep/components/RoadmapContent.tsx` | Replace the plain subject header `<div>` with `<SubjectModeToggle>`, add `mode` state (`"learn" \| "practice"`), render `PracticeTopicRow` list when `mode === "practice"` |

---

## Acceptance Criteria

### Subject header
- [ ] The existing subject header element is replaced by `SubjectModeToggle`.
- [ ] Left pill: "Learn" — shows `N topics · M subtopics` (identical to current).
- [ ] Right pill: "Practice" — shows `N topics · Q questions`.
- [ ] Active pill has a filled background (`meta.color`); inactive is outlined.
- [ ] Switching pills does **not** navigate — it toggles state on the same page.
- [ ] Colours, border-radius, and font weights stay identical to the existing element.

### Practice topic list (roadmap page)
- [ ] When `mode === "practice"`, the `TopicRow` accordion list is replaced by `PracticeTopicRow` rows.
- [ ] Each row matches the same accordion visual as `TopicRow` (same border, same expand/collapse icon).
- [ ] Expanded state reveals `PracticeChapterChip` chips — one per chapter.
- [ ] Each chip links to the correct question-player URL (see URL patterns below).
- [ ] DILR and VARC rows show chapters from the static lookup (no DB call on the roadmap page).
- [ ] Quant chapter chip label = chapter name. DILR chip label = chapter name. VARC chip label = passage/chapter name.

### API — questions
- [ ] `GET /api/practice/questions?section=Quant&topic=Arithmetics&chapter=Averages` returns all 20 questions sorted by `question_number`, **without** `correct_answer` or `explanation`.
- [ ] `GET /api/practice/questions/[id]/solution` returns `{ correct_answer, explanation, solution_svg }` only.
- [ ] Missing `section`/`topic`/`chapter` → 400.
- [ ] Missing `id` or not found → 404.

### API — DILR
- [ ] `GET /api/practice/dilr?chapter=Arrangements` returns all sets, without per-question `correct_answer`.
- [ ] `GET /api/practice/dilr/[setNumber]?chapter=Arrangements` returns single set (passage + questions stripped of answers).
- [ ] `GET /api/practice/dilr/[setNumber]/solution?chapter=Arrangements` returns `{ solution_text, solution_svg, answers: { [number]: correct_answer } }`.

### API — RCs
- [ ] `GET /api/practice/rcs/[rcNumber]` returns passage + questions stripped of answers.
- [ ] `GET /api/practice/rcs/[rcNumber]/solution/[qNum]` returns `{ correct_answer, explanation }`.

### MCQ question player (`/cat-prep/practice/quant/[topic]/[chapter]`)
- [ ] Pill navigation 1–20 at top; active pill highlighted.
- [ ] URL updates to `?q=[question_number]` on pill click (shallow push).
- [ ] Question text + options rendered; LaTeX via MathJax (loaded once in layout).
- [ ] Selecting an option shows a ring/outline on it.
- [ ] "Check Solution" fetches `/solution`, reveals correct (green) / wrong (red) option and explanation.
- [ ] If `solution_svg` present, injected as raw `innerHTML` below explanation.
- [ ] `\n` in explanation → `white-space: pre-line`.
- [ ] Para Jumble questions (`question_type === "jumble"`) render identically to MCQ (treat options as ordering choices).
- [ ] Difficulty badge shown next to question number (Easy=green, Medium=amber, Hard=red).

### DILR player (`/cat-prep/practice/dilr/[chapter]/[setNumber]`)
- [ ] Split panel: passage + `question_svg` on left, questions on right.
- [ ] On mobile (< 768 px): tabs "Passage" / "Questions".
- [ ] Pills `[1] [2] [3] [4]` navigate between the 4 questions.
- [ ] "View Full Solution" fetches `/solution`, shows `solution_text` + `solution_svg` for all four questions at once.
- [ ] Level badge shown (Hard=red, Medium=amber, Medium-Hard=orange).
- [ ] Prev / Next set navigation at bottom.

### RC player (`/cat-prep/practice/varc/reading-comprehensions/[rcNumber]`)
- [ ] Same split-panel layout as DILR.
- [ ] Passage paragraphs rendered individually; paragraph number label shown.
- [ ] `para_summaries` shown as tooltip on hover over paragraph number (if array is non-empty).
- [ ] "Check Answer" per question; fetches per-question solution endpoint.
- [ ] Explanation rendered line-by-line (split on `\n`).
- [ ] Correct = green, wrong selected = red.
- [ ] Level badge shown.
- [ ] Prev / Next RC navigation at bottom.

---

## URL Patterns

```
/cat-prep/practice/quant/[topic]/[chapter]?q=[question_number]
/cat-prep/practice/dilr/[chapter]/[setNumber]
/cat-prep/practice/varc/reading-comprehensions/[rcNumber]
```

`[topic]` and `[chapter]` are kebab-case slugs derived from the MongoDB `topic` / `chapter` fields (e.g. `arithmetics`, `averages`).

---

## Static Practice Chapter Map (used client-side for the roadmap index)

Quant chapters come from the MongoDB collection at build time or on first API call.
DILR and VARC are fixed and can be hard-coded as a constant in `src/constants/practiceChapters.ts`:

```
DILR:  Arrangements (10 sets), Bar Graphs (10 sets)
VARC:  Reading Comprehensions (50), Odd One Out (50), Para Jumbles (50), Para Summary (50)
```

Question counts for Quant (`20 per chapter`) are also hard-codable.

---

## Test Plan

1. Toggle the subject header between Learn and Practice — confirm the topic list swaps and the toggle pill styling matches existing design tokens.
2. Open a Quant chapter (e.g. Averages). Confirm 20 question pills render, LaTeX is typeset, and `correct_answer` is absent from the initial network response.
3. Select a wrong option → click Check Solution → confirm red/green highlight and explanation appear; `solution_svg` renders inline if present.
4. Open a DILR set (Arrangements/1). Confirm split panel; on mobile confirm tab switch. Click View Full Solution.
5. Open an RC (rc_number=1). Hover a paragraph number — confirm tooltip. Answer a question — confirm per-question reveal.
6. Navigate prev/next sets and RCs via bottom nav.
7. Run TypeScript compiler (`tsc --noEmit`) — zero errors.
8. No `correct_answer` or `explanation` present in initial page HTML (view-source check).

---

## Out of Scope (this PR)

- User progress tracking for practice questions (separate ticket).
- Search or filter across chapters.
- Bookmarking / flagging questions.
- Timer per question (daily challenge already has this; practice is untimed for now).
