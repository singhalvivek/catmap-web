# G002 — Server-Rendered Full PYQ Paper

## Goal

Put every question, option, answer and explanation of a PYQ paper into the initial server-rendered HTML. Even with the sign-in wall gone (G001), `PyqPaperPlayer` shows one question at a time from client state and fetches solutions on demand, so the indexable HTML holds roughly one question and no solutions. That cannot outrank a Cracku page carrying all 66 questions and full solutions inline.

Approach chosen: keep the interactive player as the primary UI and append a server-rendered **"Full paper with solutions"** section below it. Additive, no regression risk to the solver, and it ships this month.

Measured payload (all 39 papers, 3,916 questions, every one with an answer key and a non-empty explanation): median 187 KB of JSON per paper with answers and explanations, largest 279 KB (`cat-1998`). Roughly 50–70 KB gzipped as HTML — acceptable, and comparable to competitor pages.

**Critical constraint:** the solutions must be fetched and rendered in a *server* component. Passing them through `PyqPaperPlayer`'s props would serialize the same payload a second time into the RSC flight data and double page weight.

## Files Affected

- `src/lib/pyqQueries.ts` — add `fetchPyqPaperSolutions(paperSlug)` returning questions grouped by section with `correctOptionIndex` / `correctAnswer` / `explanation` included. Deliberately separate from `fetchPyqPaper`, whose `ANSWER_FIELDS` projection must keep excluding answers for the player and the mock.
- `src/app/cat-prep/models/pyq.ts` — add the solved-question / solved-paper types.
- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperSolutions.tsx` — **new** server component. Renders every section → comprehension group → question: number, text with inline images, options with the correct one marked, and the explanation inside a collapsed `<details>`.
- `src/app/cat-prep/pyq/[paperSlug]/page.tsx` — fetch solutions and render `<PyqPaperSolutions>` below `<PyqPaperPlayer>`.

## Design Notes

- **Images** — reuse the pure `interleaveImages` helper from `src/lib/interleaveImages.ts` so inline image placement matches the player exactly. All image URLs already point at `cat-pyqs.s3.us-east-1.amazonaws.com`; nothing is hotlinked.
- **Math** — MathJax is loaded globally in `layout.tsx` and typesets the document on startup, so `$$...$$` in server-rendered text is handled without any per-component effect. Server output is a plain React text node, so no manual HTML escaping is needed (unlike the client player, which injects HTML).
- **Comprehensions** — rendered once per consecutive group, not repeated per question.
- **Explanations in `<details>`** — present in the HTML for crawlers, collapsed by default so the page isn't a wall of spoilers.
- **Anchors** — each question gets `id="q-{section}-{n}"` so the section can be deep-linked and internally linked later (September's internal-linking work).

## Acceptance Criteria

- [ ] `curl` of a paper page returns every question's text, every option, and every explanation in the HTML with no JS executed.
- [ ] The answer key rendered server-side matches what `/api/pyq/[paperSlug]/questions/[id]/solution` returns for the same question.
- [ ] `fetchPyqPaper` still excludes answers — verified by checking the flight payload contains no `correctOptionIndex`.
- [ ] The mock test at `/cat-prep/pyq/<slug>/mock` still receives answer-free questions.
- [ ] Comprehension passages appear once per group, not once per question.
- [ ] MathJax renders formulas in the server-rendered section after hydration.
- [ ] `npm run build` completes for all 39 papers without an out-of-memory failure.
- [ ] Largest paper (`cat-1998-question-paper-solved`, 184 questions) renders correctly.

## Test Plan

- Build, then `curl -s <paper-url> | grep -c "Explanation"` → equals the paper's question count.
- Spot-check three papers across eras: `cat-2025-slot-1` (22/24/22), `cat-2018-slot-1` (100 Q), `cat-1998` (184 Q, largest payload).
- Confirm a TITA question renders its numeric answer and an MCQ marks the right option.
- Confirm a DILR/VARC comprehension group shows the passage once above its questions.
- Measure transfer size of the largest paper; flag if gzipped HTML exceeds ~150 KB.
- Edge cases: question with no options (TITA), question with images in options, section with zero questions.

## Out of Scope

- Replacing the one-question-at-a-time player with an all-questions-inline layout (considered and deferred — bigger UI change).
- The 250–400 words of intro copy per paper page (September, Cowork).
- Internal linking between paper → chapter → subtopic (September).
