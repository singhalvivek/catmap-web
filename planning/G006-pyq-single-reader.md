# G006 — One PYQ Reader, No Login

## Goal

Collapse the PYQ paper page to a single view. G002 left two copies of every question on the page: an interactive one-question-at-a-time player on top, and a read-only full paper below it. Answering happened in the player; the questions you could actually read were inert.

Now there is one list. Every question is on the page, in order, and every question is answerable: pick an option, press Check Answer, get correct/incorrect and the explanation — with no account, no modal, no gate anywhere on the page.

This also removes the duplication G002 introduced. The player's props and the server-rendered section were two separate copies of the same paper; now there is one.

## What changes for the reader

- **No tabs.** VARC, DILR and QA render sequentially as sections, all visible. Tabbed sections would have hidden two thirds of the paper behind `display:none`, which is exactly the content this work exists to expose.
- **No question palette.** It existed because only one question was visible at a time. Scrolling replaces it — which also retires the fixed mobile bottom bar, and with it the clearance bug from G002.
- **Sticky section nav** — VARC / DILR / QA as anchor links, so a 184-question paper stays navigable.
- **Answers resolve instantly.** The answer key already sits in the page, so Check Answer no longer waits on a network round trip.
- **The site header is back**, so someone landing here from Google has a logo, navigation, and an optional sign-in — see "Sign-in" below.

## Files Affected

- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperReader.tsx` — **new**, replaces both old components.
- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperPlayer.tsx` — **deleted**.
- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperSolutions.tsx` — **deleted**.
- `src/app/cat-prep/pyq/[paperSlug]/page.tsx` — renders `Header` + `PyqPaperReader`; drops the second query.
- `src/app/api/pyq/[paperSlug]/questions/[id]/solution/route.ts` — **deleted**, dead once the player is gone.
- `src/lib/pyqQueries.ts` — `fetchPyqQuestionSolution` deleted with its only caller. `fetchPyqPaper` stays: the mock still needs the answer-free shape.
- `src/app/cat-prep/models/pyq.ts` — `PyqSolution` deleted with the route.

## Sign-in on this page

The gate is gone and nothing on the page requires an account. The site header still carries an optional "Sign in with Google" button, which is navigation rather than a gate — it is how a returning user syncs progress across devices, and how the mock is reached. Progress is written to `localStorage` for everyone and additionally to Firestore when signed in, exactly as before. If the button should be hidden here too, that is a one-line prop.

## Answer keys in the page source

Every answer and explanation is now in the HTML, so a determined visitor can read the key without pressing Check Answer. This is intended: it is a solved-paper page, it is what competitors publish, and it is the content that has to be indexable. It was already true before this change — the solution endpoint was public and unauthenticated. The timed mock is unaffected: `fetchPyqMockTest` still reads the answer-free shape.

## Acceptance Criteria

- [ ] A logged-out visitor can answer any question, see correct/incorrect, and read the explanation.
- [ ] Each question appears exactly once on the page.
- [ ] All three sections' questions are in the server HTML, none hidden behind a tab.
- [ ] The site header renders, with working sign-in and navigation.
- [ ] Answers persist across reload logged out, and merge into Firestore on sign-in.
- [ ] The mock page still receives answer-free questions and still requires sign-in.
- [ ] Page weight drops materially against G002's 196 KB gzipped worst case.
- [ ] No dead code: player, solutions component, solution route and `fetchPyqQuestionSolution` all removed.
- [ ] `tsc`, `eslint`, `vitest` and `next build` all clean.

## Test Plan

- Private window, answer an MCQ and a TITA; confirm correct/incorrect and explanation.
- Reload; confirm answers survive. Sign in; confirm they survive again.
- `curl` a paper and count questions and explanations against the section counts.
- Confirm no `display:none` wrapper hides DILR or QA.
- Confirm `/api/pyq/<slug>/questions/<id>/solution` now 404s and nothing calls it.
- Largest paper (`cat-1998`, 184 questions) renders and stays usable.
- Edge cases: TITA with no options, question with images in options, a passage group spanning several questions.

## Out of Scope

- The practice pages, which keep their one-at-a-time players.
- The mock, unchanged.
- Intro copy per paper page (September).
