# G008 — VARC Verbal Practice Pages

## Goal

150 CAT practice questions sit in MongoDB with no page serving them. `percentyl_practice_questions` holds three VARC chapters — Para Jumbles, Para Summary and Odd One Out, 50 questions each — and the only practice question route is `/cat-prep/practice/quant/[topic]/[chapter]`, which filters on `section: "Quant"`.

Worse than invisible: `PracticeTopicRow.tsx:36` already builds `/cat-prep/practice/varc/${topicSlug}/${chapterSlug}` for these chapters, so all three chips on the roadmap lead a real user to a 404. Same class of defect as the three quant chapters fixed in G007, found the same way.

This builds the route, fixes the links, and lists the pages. Unlike the daily essay archive, this content genuinely deserves indexing: it is CAT practice material on CAT-intent queries, and "para jumbles for CAT" is something aspirants actually search.

## URL shape

`/cat-prep/practice/varc/[chapter]` — `para-jumbles`, `para-summary`, `odd-one-out`.

One segment, not the quant route's two. The constants nest these under a topic named "Verbal Ability & Reading Comprehension" (slug `varc`), which would have produced `/practice/varc/varc/para-jumbles`. The topic carries no meaning here — it holds every VARC chapter — so it is dropped from the URL.

`reading-comprehensions` also matches this segment, since the existing RC route lives one level deeper at `varc/reading-comprehensions/[rcNumber]`. That case redirects to `/1` rather than 404ing.

## The data, and what it forces

| Chapter | Questions | Type | Answer field |
|---|---|---|---|
| Para Summary | 50 | `mcq` | `correct_answer` — A–D |
| Odd One Out | 50 | `mcq` | `correct_answer` — A–D on 40, **null on 10** |
| Para Jumbles | 50 | `jumble` | `correct_text` — a 4-digit sequence, e.g. `2413`; `correct_answer` is null on all 50 |

Two consequences for the player, which today only understands A–D:

**Jumble questions are not multiple choice.** The four options hold the sentences; the answer is the order they go in. They render as a numbered list with a sequence input, which is how CAT actually asks them.

**Ten Odd One Out questions have no answer key at all** — both `correct_answer` and `correct_text` are null. Checking one must say so and move on, not hang on a disabled button. A sentinel marks the question checked without matching any real answer, mirroring `NO_ANSWER_SENTINEL` in the PYQ reader.

## Files Affected

- `src/app/cat-prep/practice/varc/[chapter]/page.tsx` — **new**. Metadata, JSON-LD, `generateStaticParams`, and the RC redirect.
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/QuestionPlayer.tsx` — teach it the `jumble` type and the missing-answer case. Extended rather than copied: the palette, navigation, progress, MathJax and solution fetching are all identical, and only the answer widget differs.
- `src/app/cat-prep/components/PracticeTopicRow.tsx` — point the three chips at the route that now exists.
- `src/app/sitemap.ts` — three entries.

## Acceptance Criteria

- [ ] `/cat-prep/practice/varc/{para-jumbles,para-summary,odd-one-out}` each return 200 and render 50 questions.
- [ ] Para Summary and Odd One Out behave exactly like a quant chapter: pick A–D, check, see the explanation.
- [ ] Para Jumbles shows four numbered sentences and accepts a sequence; `2413` marks correct, anything else incorrect with the right sequence shown.
- [ ] The 10 answer-less Odd One Out questions report that the answer is unavailable rather than leaving the button dead.
- [ ] Quant chapter pages are unchanged — same behaviour, same markup.
- [ ] The three roadmap chips navigate instead of 404ing.
- [ ] `/cat-prep/practice/varc/reading-comprehensions` redirects to `/1`.
- [ ] Sitemap gains exactly 3 URLs, all returning 200.
- [ ] Titles contain "CAT" and stay under 60 characters.
- [ ] `tsc`, `eslint`, `vitest`, `next build` clean.

## Test Plan

- Answer an MCQ on Para Summary; confirm correct/incorrect and explanation.
- Answer Para Jumbles q1 with `2413`, then with `1234`; confirm both verdicts read correctly.
- Open Odd One Out q2 (no key) and check it; confirm the message and that navigation still works.
- Reload mid-chapter; confirm answers persist, logged out.
- Walk the whole sitemap for 200s, as in G007.
- Spot-check a quant chapter for regressions.
- Edge cases: sequence input given letters, 3 digits, or 5; a chapter slug that does not exist.

## Out of Scope

- Reading Comprehension, which already has its own route and player.
- The DILR and Quant chapters, which are already served and already listed — nothing about them changes here.
- Intro copy per chapter page (September).
- Backfilling the 10 missing answer keys, which is a data task.
