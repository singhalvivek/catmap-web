# U002 — Site-wide Editorial Pass

## Goal

U001 rebuilt the home page in an editorial visual language and converted the shared header,
footer and wordmark. The `/cat-prep` page **bodies** were deliberately left alone. The result
is a site where a new masthead and a new footer bracket five surfaces that still carry the old
design: gradient hero bands, teal pill navigation, rounded cards with uniform shadows, emoji
icons, 14px low-contrast body copy, and no focus indicator on any control.

That mismatch is now the most visible thing on the site, and it is visible on every page a
visitor reaches after the home page.

U002 carries the editorial system through those surfaces. It is not a reskin: the measured
state is **860 inline `style={{}}` objects**, **204 `borderRadius` declarations across 18
distinct values** against a square-cornered language, **438 `fontSize` declarations of which
333 are ≤14px** against a 16–17px floor, and **78 distinct hex literals** encoding states the
token layer has no name for. An inline style object cannot express `:hover`, `:focus-visible`,
a media query or `prefers-reduced-motion`, which is why the codebase carries 8 `onMouseEnter`
handlers and 12 `isHovered` state variables that exist only to simulate `:hover` — including
61 `SubtopicChip`s and 28 `PracticeChapterChip`s re-rendering on pointer move. Each of those
deletes itself when the element becomes a class.

## Governing principle

**Functionality is frozen. UI and code are not.**

Decided by the user. Every feature, state, rule and behaviour the site has today it must still
have afterwards — same gates, same scoring, same resume, same empty states, same edge cases.
Within that, the markup, the styling and the structure of the code are all open: U002 is a
refactor as much as a restyle, and improving the codebase is in scope rather than a side
effect to be minimised.

What that licenses:
- Rewriting a component's markup wholesale rather than restyling it in place.
- Extracting shared primitives and deleting the duplicated implementations behind them.
- Replacing inline style objects, hover handlers and `isHovered` state with CSS.
- Splitting oversized components, tightening types, removing magic strings.

What it does not license:
- Removing, gating, or quietly changing any behaviour — including ones that look like bugs.
- Changing a stored value's shape or key, which would discard a user's saved progress.
- Changing what a score is, when a timer fires, or what a sign-in gate gates.

The **Do not touch** section below is therefore about *behaviour*, not about files. Those files
may be reformatted or moved if a phase genuinely needs it, but what they do must be provably
identical afterwards — which is why the test plan ends with a manual end-to-end score
comparison rather than a visual check.

## Three defects U001 shipped, fixed here

Found by surveying for this spec, verified independently before being written down. All three
are mine and all three are cheaper to fix now than after four more surfaces copy them.

1. **`--ink-faint` fails WCAG AA.** `#6b7589` is **4.41:1** on `--paper` and **4.04:1** on
   `--paper-sunk`, short of the 4.5:1 required for normal text — and it is live at 13px in
   `SurfaceList.tsx:65`, 12px in `RoadmapPlate.tsx:170` and in `FaqAccordion.tsx:62`. U001's
   own acceptance criteria claimed "primary copy meets WCAG AA"; `--accent-text` was checked
   and this was not. Retire it to **`#5A6478`** (5.66 / 5.19), which doubles as `--inert-text`.
2. **The `.ed-page > *` rule is a latent z-index trap.** `globals.css:252-255` forces
   `position: relative; z-index: 1` on every direct child of the page wrapper. Tailwind v4
   emits utilities inside `@layer utilities`, so this unlayered rule **beats** them: the moment
   `className="ed-page"` is added to a `/cat-prep` root, `DetailsPanel` (`z-[199]`/`z-[200]`)
   and `SignInModal` (`z-[201]`/`z-[202]`) clamp to `z-index: 1`, behind the sticky header and
   the fixed mobile palette bar. `InfoTooltip` escapes only because its `zIndex: 9999` is an
   inline style. Fix: move the grain onto its own child element and delete the blanket rule.
   **This is a hard prerequisite for Stage B**, not a nicety.
3. **`--measure: 68ch` is dead** (`globals.css:78`, zero references). Added in U001, never used.

### And one factual correction to the U001 spec

`planning/U001-home-page-redesign.md` states that the legacy `@theme` tokens generate Tailwind
utilities the `/cat-prep` pages still use, and that pruning them belongs to U002. **That is
wrong.** Verified counts across `src/**/*.{ts,tsx}`:

| Token | Usages |
|---|---|
| `--trust-navy` | **82** |
| `--trust-blue`, `--hope-teal`, `--warm-gold`, `--calm-bg`, `--calm-border`, `--page-bg`, and all four `--shadow-*` | **0 each** |

The surfaces do not use the utilities; they use raw hex (`#1E3A5F` ×107, `#94A3B8` ×80,
`#E2E8F0` ×70). Only `--trust-navy` is load-bearing. The rest delete on day one with no visual
consequence. The U001 spec is corrected in place.

## Semantic colour scale

The constraint, stated plainly: **no single hex clears AA on both `--paper` (#fcf9f2) and
`--ink` (#101a2b)**. A colour readable on one is readable *because* it sits far from it. U001
already solved this for teal with a pair — `--accent-text` for cream, `--accent-bright` for
dark — and every semantic must follow the same shape or it fails one ground.

Four slots per semantic: `-text` for words on paper, `-bright` for words on ink, `-wash` as a
tint for a filled field, and `-text` doubling as border and as a fill carrying white type.

```
--correct-text  #0F6B3C   --correct-bright  #4ADE80   --correct-wash  #E8F1E4
--wrong-text    #B3261E   --wrong-bright    #FCA5A5   --wrong-wash    #FBEAE4
--caution-text  #8A5200   --caution-bright  #FBBF24   --caution-wash  #FAF0DA
--review-text   #5B2CC2   --review-bright   #C4B5FD   --review-wash   #EDE8F9
--inert-text    #5A6478   --inert-bright    rgba(255,255,255,.62)
--rule-hard     #8c8270   (state-bearing borders only)
```

Measured: every `-text` clears 4.5:1 on `--paper`, on `--paper-sunk` **and on its own wash**,
so a label stays legible whether its row is plain, recessed or tinted; every `-text` also
clears 4.5:1 on white, so each works as a solid fill. Every `-bright` clears 9:1 on `--ink`.
`--rule-hard` clears the 3:1 that WCAG 1.4.11 requires of a boundary conveying state — which
`--rule` (1.47:1) and `--rule-firm` (2.38:1) do not, making them fine as row separators and
unfit as the "unanswered" border on a palette cell where the border *is* the state.

### Three rules the scale imposes

1. **White on `--accent` (#0d8b7f) is 4.19:1 and fails.** Nothing violates it today —
   `.ed-cta` fills with `--ink` at 17.43:1 — but "solid teal button, white text" is the most
   natural primitive to reach for next. An accent fill carries `--ink`, or fills with
   `--accent-text` where white is 6.73:1.
2. **Correctness must never be colour-only.** It is colour-only across the whole site today:
   the option dot shows its letter A–D in all four states and nothing in the accessible name
   changes between correct and wrong. Every correctness state needs a second channel — a tick
   glyph, an inset bar, or text in the accessible name.
3. **The brand accent may never mean "correct."** Teal on cream sits uncomfortably close to a
   success green, and DILR's identity `#0F766E` is nearer still. Reserve `--accent` for
   navigation and emphasis.

Also: `DifficultyBadge` currently reuses the exact green and red of the correct/wrong pair, so
`#D1FAE5` means "correct" on an option and "Easy" on a badge 200px away on the same screen.
Difficulty moves to a non-colour channel.

## Phases

Ordered by visible mismatch per unit of risk, with dependencies respected and the mock engine
deliberately late, when the system is proven. Every phase leaves the site coherent — never
half-converted in a way a user would see.

### Stage A — Foundation (no pixel change, or additive only)

| # | Phase | Risk | Effort |
|---|-------|------|--------|
| 1 | Inert groundwork: delete dead files and the 9 unused legacy tokens, fix the duplicate `--color-page-bg` (`globals.css:37` and `:40`), add 4 missing file headers, correct the stale "CAT Roadmap" string in both OG images | low | 0.5d |
| 2 | Token layer: the semantic scale above, `--rule-hard`, and the three U001 defects | low | 1d |
| 3 | Site-wide focus system | low | 1d |
| 4 | CSS primitive layer, written but not yet consumed | low | 2d |
| 5 | Brand mark and shared micro-chrome | low | 1.5d |
| 5b | Split `RoadmapContent` into four mode bodies; `useState` wrapper becomes a prop. **Zero pixel change** | low | 1d |

**Dead files confirmed with zero importers:** `pyq/PyqProgressBar.tsx`,
`daily-dose/challenge/components/QuestionReviewList.tsx`.

**Phase 3 detail.** `globals.css:175-179` says in its own comment that site-wide focus
"deserves its own spec". This is that spec. `.ed-page` appears on exactly **one** element in
the repo (`src/app/page.tsx:53`), so all 77 prerendered roadmap pages have no focus indicator
on anything except the header auth button and the footer links. Three places go further and
actively remove it — `outline: "none"` at `TITAInput.tsx:47` (the only text input in the mock
test), `QuestionPlayer.tsx:293` (the jumble input) and `DailyEssayPageClient.tsx:444` (the four
essay textareas). Replace the scoped rule with one unlayered
`:where(a, button, summary, input, select, textarea, [tabindex]):focus-visible` block driven by
a `--focus-ring` token that flips to `--accent-bright` on dark grounds. `:where()` contributes
zero specificity, so all 65 buttons under `src/app/cat-prep/` inherit it without being edited.

Three geometry constraints to design around, all present today: `outline-offset: 3px` is
clipped by `overflow: hidden`, which `RoadmapContent.tsx:524` and `DailyChallengeCard.tsx:245`
both set; 32×32 palette cells at 6px gaps collide at 3px offset; and the sticky header plus the
fixed mobile palette bar both clip a ring on an element scrolled under them.

### Stage B — Shells and static pages

| # | Phase | Risk | Effort |
|---|-------|------|--------|
| 6 | `RoadmapContent` shell + `RoadmapNav` — four routes, 77 pages, one edit. **Produces the per-subject colour options to pick from** | medium | 3d |
| 7 | How to Prepare + sitemap page | low | 1.5d |

`RoadmapNav` is the single most visible piece of old design left: the pill row renders on every
roadmap page and mixes three treatments (solid navy active, teal outline for Daily Dose and How
to Prepare, plain outline for the rest). Pure presentation, zero logic.

### Stage C — Surface bodies

| # | Phase | Risk | Effort |
|---|-------|------|--------|
| 8 | Learn body | medium | 3d |
| 9 | Dialog semantics: `DetailsPanel` and `SignInModal` | medium | 2d |
| 10 | Practice index body | low | 1.5d |
| 11 | PYQ index, paper hero and reading view | medium | 2.5d |
| 12 | Daily Dose hub and essay routes | medium | 3d |

### Stage D — Players (highest risk, deliberately last)

| # | Phase | Risk | Effort |
|---|-------|------|--------|
| 13 | Practice players + shared option/palette primitives | high | 4d |
| 14 | Shared test player — converts Daily Dose challenge and PYQ mock chrome together | high | 4d |
| 15 | `PyqMockTestView` markup, below the logic line | high | 3d |

### Stage E — Cleanup

| # | Phase | Risk | Effort |
|---|-------|------|--------|
| 16 | Retire `--trust-navy` (82 usages, ~46 files; #1e3a5f → #101a2b is a visible darkening, not a rename) | low | 1d |
| 17 | OpenGraph cards and favicon — **defer candidate** | low | 1.5d |

## Primitives, in build order

Each must exist before the phase that consumes it.

1. **Semantic status tokens** — before any option, palette, timer, verdict or progress state.
2. **`--rule-hard`** — a third rule weight for boundaries that convey state.
3. **`--focus-ring` + the `:where()` base rule** — before the controls, not after.
4. **`.ed-page` grain restructure** — hard prerequisite for Stage B.
5. **`.ed-btn`** with `data-weight="primary|secondary|quiet|on-dark"`, `data-pending`, and a
   real disabled state. Four weights exist in the wild today, and five sites where "pending" is
   just the label changing to "Loading…" with no spinner and no `aria-busy`.
6. **`.ed-field`** — the TITA number input, the jumble input, the four essay textareas.
7. **`.ed-cell`** — a 32–36px palette cell whose ring *replaces* the border rather than
   offsetting it, since a 2px ring at 3px offset collides at 6px gaps.
8. **`.ed-meter`** — one class carrying `role="progressbar"` and `aria-valuenow`, which no
   progress indicator on the site has today. Four flavours exist now.
9. **`.ed-chip` / `.ed-pill` / `.ed-badge`** — converting these is what deletes the hover
   handlers and `isHovered` state.
10. **`.ed-empty` / `.ed-skeleton` / `.ed-notice`** — five bespoke empty states, four
    hand-sized skeleton flavours, inline errors in three different reds. `animate-pulse` is a
    Tailwind built-in and survived U001's cleanup, so skeletons keep it.
11. **One shared `QuestionPalette` component** with ONE status map, replacing three palettes
    and three copy-pasted legends. A React primitive, not CSS: the three differ only in which
    status maps to which colour, and that mapping lives in TypeScript (`VisitStatus`,
    `PillState`, a local `Status` union). Hand it to CSS as `data-state` and the three unions
    keep drifting. Build it in Phase 13 with its first consumer so it is never dead code.
12. **Promote `PracticeOptionButton`** out of `components/practice/` as THE option primitive,
    and converge `MCQOptions` and `ReviewMCQOptions` onto it rather than restyling three
    implementations into a fourth divergence.

## Behaviour that must not change

Per the **Governing principle**, these files may be reformatted, moved or refactored — but what
they *do* must be provably identical afterwards. They are listed because each is a place where
a plausible-looking edit silently changes a score, a saved draft or a date, with no visible
symptom until a user loses work. Treat every one as requiring a before/after behavioural check,
not a visual one.

- **`src/lib/pyqQueries.ts`** — all 448 lines. Especially `ANSWER_FIELDS` (:31) applied as a
  query-level projection (:147) so a caller cannot leak an answer by forgetting to strip it,
  and grading (:312-404, +3/−1 MCQ, +3/0 TITA) with `DuplicatePyqAttemptError` (:322-325).
- **`src/app/cat-prep/lib/useSectionedTest.ts`** — all 223 lines. The render-phase derived-state
  blocks (:64-106) call `setState` during render guarded by a `prev !== next` comparison;
  inserting a wrapper that suspends can double-fire a section transition. The timing refs
  (:49-56) and `collectTimingSnapshot` (:189-203) are what a careless edit silently corrupts
  into a wrong submitted score.
- **`PyqMockTestView.tsx:36-217`** — state, the three effects and `finalise()`. Restyle from
  :218 down. The autosave dep array (:96-109) is deliberately incomplete and the refs (:64-73)
  are assigned during render on purpose.
- **Every storage key format** — `pyqMockStore.ts`, `sectionedTestStore.ts`,
  `dailyChallengeStore.ts`, `practiceProgressStore.ts`, and the legacy purge at
  `sectionedTestStore.ts:11-30`. The uid-scoping was itself a security fix. Renaming a key
  silently discards every user's saved progress; `ContinuePractice:44-141` and
  `usePracticeMasterySummary:15-51` reverse-engineer these formats by string prefix.
- **`usePracticeProgress.ts:35-45`** — the hydration contract. Reads localStorage during render
  but only once `useIsHydrated()` is true, because every page is prerendered with questions
  unanswered. Any `useState(() => localStorage…)` added during conversion reintroduces the
  mismatch this code exists to avoid.
- **`export const dynamic = "force-dynamic"`** at `essay/page.tsx:10` and `challenge/page.tsx:10`
  — do not remove either to make a page static for a cheaper restyle. Both read `getTodayIST()`
  at render; caching re-freezes the date. P006 records that bug shipping twice.
- **The `useIsHydrated()` gate on hub card dates** — `DailyEssayCard.tsx:43-44` and
  `DailyChallengeCard.tsx:284-285` render `""` on the server deliberately.
- **`MathText.tsx` and `InlineImageText.tsx`** — zero styling by design. **Corollary: never wrap
  question or explanation content in `.reveal-mask` or `.ed-collapse`** — both set
  `overflow: hidden`, which clips MathJax's generated `mjx-container`. The same applies to the
  `containerRef` wiring in `PyqPaperReader.tsx:29-48` (ref stays on the outer div at :234) and
  `QuestionPlayer.tsx:51-73,:200`.
- **`pyqPresentation.ts`, `dateIST.ts`, `essayQueries.ts`, `dailyQuizQueries.ts`,
  `dailyDoseQueries.ts`, `constants/practiceChapters.ts`** — logic and data only.
- **All JSON-LD blocks** — FAQPage, Breadcrumb, LearningResource, Article. SEO-load-bearing.
- **The 70% topic gate** (`DetailsPanel.tsx:69`) — intentional per the user. Same threshold,
  same copy, same lock card; restyled only.

## Acceptance Criteria

### Functionality (the hard gate)
- [ ] **No feature, state, rule or edge case behaves differently after a phase than before it.**
      Every sign-in gate gates the same thing, every score is the same number, every timer
      fires at the same moment, every empty state still appears on the same condition.
- [ ] No storage key, draft shape or stored value changes format. A draft written by the
      pre-change build resumes on the post-change build.
- [ ] The 70% topic gate is intact at the same threshold.
- [ ] Any behaviour that looks like a bug is reported, not silently fixed, unless the phase
      names it explicitly.

### Per phase
- [ ] Each phase ships as its own branch and commit, cut fresh from `staging`.
- [ ] After every phase the site is coherent — no surface half-converted in a way a user sees.
- [ ] `npm run build` keeps all 277 routes at their current rendering mode. **No page becomes
      dynamic, and none loses server rendering, as a side effect of a restyle.**
- [ ] `npm test`, `npm run lint` and `tsc --noEmit` pass. No `eslint-disable`.
- [ ] `npm run shot` before and after; both captures reviewed at 1440 / 768 / 390.

### System
- [ ] No gradients anywhere on `/cat-prep`.
- [ ] Inline `style={{}}` count drops materially from 860; every `:hover`, `:focus-visible`,
      media query and reduced-motion rule lives in CSS, not in an event handler.
- [ ] Zero `onMouseEnter`/`onMouseLeave` handlers that exist only to simulate `:hover`, and
      zero `isHovered` state variables.
- [ ] Body copy ≥16px; no text below 4.5:1 on its actual background (not merely on `--paper`).
- [ ] Every interactive element has a visible `:focus-visible` ring, including the three inputs
      that currently set `outline: none`.
- [ ] Correctness is never conveyed by colour alone.
- [ ] `--trust-navy` is the only legacy token still alive after Phase 1, and gone after 16.

### Accessibility
- [ ] Every progress indicator carries `role="progressbar"` and `aria-valuenow`.
- [ ] The exam timer announces at thresholds via a visually-hidden live region — **not**
      `aria-live="polite"` on a per-second counter.
- [ ] `DetailsPanel` and `SignInModal` get `role="dialog"`, focus trapping and Escape (Phase 9).

## Test Plan

0. **Before any screenshot verification, restart the dev server with `.next` deleted.**
   Turbopack caches `globals.css` and will serve a stale copy across an ordinary restart —
   the chunk hash does not even change. This was hit twice: once in U001, where header
   styles appeared not to apply at all, and once in U002 Phase 2, where a "no visual change"
   check passed against CSS that did not contain the change. A screenshot diff taken against
   a stale stylesheet proves nothing, which matters because every phase below is verified
   exactly that way. `.next` may refuse to delete while the server is running — kill it,
   wait, then delete.
1. **Per phase:** `npm run build`, `npm test`, `npm run lint`, `tsc --noEmit`, then
   `npm run shot` across the touched routes at all three viewports. `npm run shot` pins
   timer-driven UI first (see `settle()` in the script), so two runs of one build are
   byte-identical and any diff is a real change.
2. **Route mode diff:** capture the build's route table before and after each phase and diff
   it. Any `○ → ƒ` transition fails the phase.
3. **Keyboard pass** per converted surface: Tab through every control, confirm a visible ring,
   confirm nothing is reachable-but-invisible or visible-but-unreachable.
4. **MathJax check** after any phase touching Practice, PYQ or Daily Dose: confirm formulas
   still typeset and that no converted wrapper introduced `overflow: hidden` over an
   `mjx-container`.
5. **Storage compatibility** after Stage D: with a draft saved on the pre-change build, load the
   post-change build and confirm resume still works for a PYQ mock, a daily challenge and a
   practice chapter.
6. **The mock engine, manually, end to end** before Phase 15 is called done: start a paper,
   answer across all three sections, mark for review, let a section roll over, submit, and check
   the score against the pre-change build for the same answers. A styling change must not move
   a score by a single mark.
7. **Reduced motion and print** after any phase adding motion.
8. **Contrast audit** at the end of Stage A, re-measured in code rather than by eye.

## Out of Scope

- **The uid-trust problem.** `pyq/[paperSlug]/submit/route.ts:25-28`, `result/route.ts:10`,
  `progress/route.ts:6`, `daily-dose/streak/route.ts:6`, `daily-essay/submissions/route.ts:8`
  and `vote/route.ts:20` all accept a client-supplied `uid` with **no token verification**, so
  every sign-in gate on the site is UX rather than a security boundary. This is a real
  pre-existing problem and needs its own spec. U002 changes none of it — **but U002's copy must
  never describe any of those gates as securing anything.**
- The 70% topic gate's product question (see Open Questions).
- Dark mode. Still in the Daily Challenge Backlog.
- The "Mixtures and Allegations" spelling fix — changes a slug and a prerendered URL.
- Any content, copy or data change not required by a conversion.

## Decisions

All settled. Nothing in U002 is blocked on an answer.

### From the user

1. **Per-subject colour — decide on sight, at build time.** Not settled in advance. Phase 6
   produces two or three rendered options for how QA / DILR / VARC are distinguished, captured
   with `npm run shot` so they can be compared as pixels rather than argued as hex values. The
   candidates to build: (a) keep three identities, retoned to the editorial palette and
   contrast-checked on both grounds; (b) collapse to ink-plus-accent and distinguish subject by
   a non-colour channel — a rule weight, a numeral, or a kicker label; (c) a hybrid where colour
   survives only in the progress ring and nowhere else. Whichever is picked is applied to all
   four consumers at once (`SubjectTab`, `ProgressRing`, `SubtopicChip`, `SUBJECT_META_BY_ABBR`)
   so the identity cannot drift.

2. **Daily Dose and PYQ share one theme — convert once.** Decided by the user. The seven
   components in `daily-dose/challenge/components/` that PYQ already imports
   (`PyqMockTestView.tsx:15-18`, `PyqMockPageClient.tsx:14`, `PyqMockReviewPageClient.tsx:10`,
   `PyqPaperReader.tsx:11`) are converted in place as **the** shared test player, with no
   variant prop and no clone. Phases 14 and 15 therefore change both surfaces together, and the
   manual test plan covers both — a daily challenge *and* a PYQ mock, end to end, on the same
   build.

3. **The 70% topic gate stays.** Decided by the user: it is intentional, not an oversight. It
   is preserved exactly — same threshold, same copy, same lock card — and only restyled.
   Nothing in U002 deletes, loosens or bypasses it.

   One observation recorded without acting on it, because it is a product question and not a
   styling one: progress only persists for signed-in users, so for a signed-out visitor the
   gate has no path to 70% and the locked content is permanently unreachable. That may be
   exactly the intent. If it is not, it needs its own item — U002 changes neither the gate nor
   the sign-in behaviour.

4. **Refactoring is in scope.** See **Governing principle**. U002 is explicitly allowed to
   restructure components and extract primitives rather than restyle in place, so long as
   behaviour is identical.

### Made during specification

**5. Chromeless routes get chrome — but exam surfaces deliberately do not.**
Split by what the surface is for, not by directory.
- **Chrome:** the four practice players, the essay route, the essay archive, and the PYQ paper
  reader. All are indexed, all are places a visitor lands cold, and none has a way back today —
  the essay, archive and challenge routes have no header at all, and the practice players carry
  a bespoke inline breadcrumb with its own gradient (`practice/quant/[topic]/[chapter]/page.tsx:86-89`).
- **No chrome:** the PYQ mock, the mock review, and the daily challenge while running. A
  sign-out button beside a live timer is a hazard, and navigating away mid-test risks the
  draft. Chromeless is deliberate exam UI here, not an oversight — U002 keeps it that way.
- **Not via `cat-prep/layout.tsx`.** A layout at that path nests over the exam routes too, and
  excluding them would need route groups restructuring the tree. Instead a shared `PageChrome`
  component is composed explicitly by the routes that want it: DRY, and the exclusion is
  visible in the code rather than implied by folder shape. It also replaces the players'
  bespoke breadcrumb.

**6. The mock palette gets a non-colour channel.** Decided by consistency: the semantic scale's
own rule 2 says correctness is never colour-only, and the palette is the screen where
legibility *is* the product. Each state carries a distinct mark as well as a tint — plain cell
(not visited), dot (visited, unanswered), tick (answered), corner wedge (marked for review),
inverted `--ink` fill with ring (current) — and the status goes into the accessible name, which
today says only the question number in all five states. Review palette likewise: tick and cross
glyphs, not red and green alone.

**7. Learn does not get scroll reveals, and neither does any other `/cat-prep` surface.**
Checked rather than assumed. Reveals are a narrative device for a page being *read*; these
surfaces are tools being *used*, and content fading in on scroll delays the thing the visitor
came to do. Deciding no also disposes of both complications at once: no cross-boundary import
of `SectionTracker` out of `components/home/`, and no `section_viewed` naming collision
polluting the home funnel. `SectionTracker` stays where it is. Stated explicitly because it is
the tempting mistake: **the PYQ reader never gets reveals** — 39 question blocks on a large
indexed page, each starting at `opacity: 0`.

**8. `RoadmapContent` is split before it is converted, as its own zero-pixel-change phase.**
The evidence settles it: 16 `mode === …` branches, and `const [mode] = useState<Mode>(initialMode)`
at :78 is never set — a per-route constant wearing a state hook. Converting four bodies inside
one 557-line file would put four conditional branches in every styling diff. Splitting first
makes each body phase independently reviewable, and the split itself is behaviour-preserving
and verifiable by build plus screenshots. Lands as **Phase 5b**, between the micro-chrome and
the shell, with the `useState` wrapper replaced by a plain prop.

**9. No separate amber token.** Two reasons. The How to Prepare "coaching is worth it / is not
necessary" opposition is *rhetorical*, not a status — in an editorial language that is carried
by typography and a rule between two columns, which is the same reasoning that removed the
home page's comparison table. And VARC's amber is a *subject identity*, owned by the
per-subject colour decision; if the winning option keeps three identities, amber comes from
that triple rather than from a semantic slot. `--caution` stays reserved for timer-warning and
in-progress, which are the meanings that would otherwise be diluted.

**10. OG cards split: the copy is fixed now, the redesign defers to U003.**
Both `src/app/opengraph-image.tsx:29` and `src/app/cat-prep/opengraph-image.tsx:70` render the
words "CAT Roadmap", which stopped being the site's own language when U001 shipped. That is a
correctness bug, not a redesign, and the string fix lands in **Phase 1**. The visual rebuild
does not: it needs Instrument Serif fetched as an `ArrayBuffer` because `next/font/google`
cannot reach `ImageResponse`, it is a different technique from everything else here, nothing
on-site depends on it, and U002 is already 17 phases. **Deferred to U003.**

