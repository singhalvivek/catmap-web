# U001 — Home Page Redesign (CAT-only, editorial, surface-first)

## Goal

The home page sells the least defensible 20% of the product and hides the rest. It markets
a curated list of YouTube videos — something a competitor could copy in a weekend — while
never mentioning Practice (870 questions across 28 chapters), PYQ (39 papers, 1990–2025,
with a working sectional timed mock engine), Daily Dose, or the How to Prepare guide. A
first-time visitor concludes in five seconds that StudyNaksha is a link directory, and
most never reach the parts that took real work. `report/product-review.md` §1 identified
this in July 2026; nothing has shipped against it.

Compounding that, the page reads as machine-generated. Not because of its colours — the
navy/teal palette is fine — but because it is assembled from four repetitions of one
template (eyebrow label → clamp()-sized heading with a single word in teal → an
`auto-fit, minmax(260px, 1fr)` grid of visually identical 16px-radius cards), decorated
with the specific flourishes that signal AI output: a pill badge with a pulsing dot and
middot separators, a three-up stat row padded with non-statistics ("3 CAT Sections",
"100% Free"), `₹`/`?`/`▶` characters standing in for icons, and three unrelated navy→teal
gradients. Every block is centred, so nothing has hierarchy. There is not one image of the
actual product anywhere in 1,006 lines.

Finally, the page positions StudyNaksha as a multi-exam platform it is not. There is one
roadmap. The waitlist offers GMAT/GRE/UPSC, two FAQs imply a catalogue, and the site-wide
metadata says "CAT and other competitive exam preparation".

This spec rebuilds `/` as a CAT-only, surface-first page in an editorial visual language:
real type hierarchy and hairline rules instead of uniform cards, honest derived counts
instead of invented ones, and the product shown rather than described.

## Design Direction

Decided with the user before writing this spec: **show all five surfaces**, **editorial /
print visual language**, **spec before build**.

### Principles

1. **Show, do not describe.** The hero carries a live render of the real roadmap tree (see
   "Product preview" below), not prose about it.
2. **Rules, not boxes.** Hairline `border-top` separators and whitespace replace the
   rounded-card grids. A rule-separated list reads like a table of contents — which is
   exactly what a syllabus product is.
3. **Hierarchy through type, not shadows.** One serif display face for headlines and
   figures; Plus Jakarta Sans retained for UI and body. Today every card shares one radius,
   one border and one shadow, so nothing leads.
4. **Asymmetry.** Left-aligned, 12-column grid. `text-align: center` on every section is
   itself a template tell.
5. **One accent, used sparingly.** Teal for links, active states and figures. Navy becomes
   ink for text, not a background slab. No gradients anywhere.
6. **Honest numbers only.** Every figure derives from the data at build time. No invented
   metrics, and no social proof we do not have (`report/product-review.md` §3f).

### Typography

Add one Google font via `next/font/google` for display use — **Instrument Serif** (high
contrast, distinctive, true italic). This is a font subset through the existing `next/font`
integration rather than an npm dependency, but it is called out here for approval under the
CLAUDE.md "no new dependencies without discussing" rule. Alternative if Instrument Serif
reads too fashion-forward: **Newsreader**.

- Display (h1, section h2, large figures): Instrument Serif, tight leading, normal tracking.
  Drop the `letter-spacing: -1.5px` — negative tracking at 60px is a sans-serif habit.
- Body: Plus Jakarta Sans at **16–17px**, ink `#1E3A5F` at full strength for primary copy and
  `#475569` for secondary. Current body is 14px `#64748B` throughout, which is both too small
  and too low-contrast.
- Measure capped at roughly 68ch.

### Product preview

The hero needs to show the roadmap. Two options, in order of preference:

1. **Live mini-tree (preferred).** Render the first subject's real nodes from `data.json`
   using the same markup idiom as the roadmap, in a non-interactive container. It is always
   current, responsive, needs no asset pipeline, costs no image weight, and cannot go stale.
2. **Screenshots** for what cannot be recreated cheaply — specifically the PYQ mock palette.
   These must be captured by the user and committed to `public/`; this spec does not fabricate
   them. If no screenshot is available at build time, that surface row ships without one
   rather than with a placeholder.

### Section order (replacing the current eight)

| # | Section | Purpose |
|---|---------|---------|
| 1 | Hero | One claim, one primary action, live mini-tree |
| 2 | What is inside | The five surfaces, rule-separated, with real counts and direct links |
| 3 | The figures | 61 / 39 / 870 / 110 set as editorial display numerals |
| 4 | Why it works | The distraction-free argument, reduced from two sections to one short passage |
| 5 | Start here | Three concrete entry points by situation, not three abstract steps |
| 6 | FAQ | Retained, trimmed to CAT-only questions |
| 7 | Footer | The shared `Footer` component, which the home page currently lacks entirely |

Deleted: the pill badge, the stat triangle, the "Sound familiar?" problem cards, the
comparison table, the "How it works" 01/02/03 cards, every gradient, the bottom CTA slab
(its job moves to section 5), and **the waitlist block** (see below).

### No waitlist

Decided by the user: the waitlist does not appear on the new home page. It only ever existed
to collect interest in *other* exams, which is the framing this spec removes — an email
capture asking "which course?" when there is one course is the multi-exam positioning in
miniature. Removing it also closes `planning/L101` (replace the dropdown with a text box),
which no longer has a subject.

Consequence to decide separately, flagged rather than acted on: `/api/waitlist`,
`src/lib/waitlistQueries.ts` and `src/lib/waitlistValidation.ts` become unreferenced once the
block is gone. That is working infrastructure shipped under `G003` last month, and the
CLAUDE.md no-dead-code rule argues for deleting it while "no waitlist **for now**" argues for
keeping it. This spec keeps the API route and libs in place and does not call them. The
`waitlistValidation` unit tests in `src/__tests__/` continue to pass either way. Deleting the
route is a one-line follow-up whenever the user confirms it is not coming back.

### Side-by-side preview

Decided by the user: both versions must be viewable at once rather than the new one replacing
the old on sight.

- The new page is built at **`/home-preview`** and the current `/` is left **completely
  untouched** until the new version is approved.
- Both are then open in two browser tabs at `localhost:3000/` and
  `localhost:3000/home-preview` for direct comparison.
- The preview route carries `robots: { index: false, follow: false }` in its metadata and is
  **excluded from `sitemap.ts`**, so it cannot be indexed or compete with `/` for the
  keywords `/` targets.
- `LandingPageClient.tsx` is **not** deleted during this phase, contrary to what the Files
  Affected table below originally said — it stays until the swap.
- **The swap is a separate, explicit step** after approval: the new composition moves into
  `src/app/page.tsx`, `LandingPageClient.tsx` is deleted, and `/home-preview` is removed.
  Nothing ships to `/` without the user seeing it first.

### On the comparison table

Removed, per the user's instinct and three supporting reasons: arguing cost when the product
is free answers a question nobody asked; the `Live classes & mentors: No` row volunteers a
reason not to use StudyNaksha, rendered in red; and `Community-improved: Yes` is an unbacked
claim whose actual mechanism is a WhatsApp link (`report/product-review.md` §3g).

## Files Affected

Split into **Phase A (preview)** — everything needed to see the new page beside the old one —
and **Phase B (swap)**, which only happens after the user approves what they see.

### Phase A — build the preview

### New
- `src/app/home-preview/page.tsx` — the composing **Server Component** for the new design.
  Derives counts from `data.json`, `resources.json`, `constants/pyqPapers.ts` and
  `constants/practiceChapters.ts`. Carries `robots: { index: false, follow: false }`.
- `src/app/components/home/Hero.tsx` — server component; headline, primary action, mini-tree.
- `src/app/components/home/RoadmapPreview.tsx` — server component; live mini-tree from `data.json`.
- `src/app/components/home/SurfaceList.tsx` — server component; the five surfaces, rule-separated.
- `src/app/components/home/Figures.tsx` — server component; derived display numerals.
- `src/app/components/home/StartHere.tsx` — server component; three entry points.
- `src/app/components/home/FaqAccordion.tsx` — **client**; with the waitlist gone, the only
  interactive block on the page. Replaces the inline accordion.
- `src/app/components/home/SectionTracker.tsx` — **client**; owns the `IntersectionObserver`
  and scroll-depth analytics currently inlined in the page body, so the content sections can
  stay on the server.
- `src/app/lib/homeCounts.ts` — single source for every derived figure, so no count is
  duplicated or hardcoded in JSX.
- `src/constants/homeSurfaces.ts` — the five surfaces as data (label, href, blurb, count key),
  removing magic strings and matching the existing `RoadmapNav` / `practiceChapters` pattern.

### Edited
- `src/app/globals.css` — **add** editorial tokens (display font variable, ink/rule/measure
  tokens, a `focus-visible` ring) under a clearly commented block. Additive only in Phase A:
  `.btn-primary`, `.btn-secondary` and `.card-hover` stay, because `/` still renders the old
  page. Their removal, if the rebuild leaves them unused, belongs to Phase B — grep the
  roadmap surfaces first, they may still depend on them.
- `src/app/layout.tsx` — register the display font. Metadata de-pluralisation moves to
  Phase B: changing the site-wide title and description while the old `/` is still live would
  make the current page's copy contradict its own `<title>`.
- `src/app/sitemap.ts` — confirm `/home-preview` is absent. The sitemap enumerates known
  routes rather than globbing, so this should need no edit; verify rather than assume.

### Phase B — the swap (only after approval)
- `src/app/page.tsx` — becomes the new composition, inlining what `/home-preview` proved out.
- `src/app/home-preview/` — **deleted**.
- `src/app/LandingPageClient.tsx` — **deleted**. 1,006 lines of `"use client"` for content
  that is 85% static.
- `src/app/layout.tsx` — de-pluralise metadata. Default title "Ace your Exams with Interactive
  Roadmaps" becomes CAT-specific, and all four occurrences of "CAT and other competitive exam
  preparation" become CAT-only.
- `src/app/data.ts` — delete the dead `COURSES` export (nothing imports it; `LandingPageClient`
  defines its own). Remove or rewrite the two catalogue-implying FAQs: `which-courses`
  ("Which roadmaps are available?") and `what-is-studynaksha` ("…for competitive exams").
- `src/app/cat-prep/components/Footer.tsx` — four fixes: the Community column is three dead
  `<span>`s styled to look like links (give them real hrefs or drop the column); "Browse All"
  points at `/` while labelled as a catalogue; "Structured roadmaps for competitive exam
  preparation" becomes CAT-only; `© 2025` becomes the current year, derived not hardcoded.
- `src/app/globals.css` — remove now-unused utility classes.

### Deliberately untouched
`RoadmapContent.tsx` and the Learn / Practice / PYQ / Daily Dose surfaces. The editorial
tokens introduced here are intended as the basis for a later site-wide pass, which gets its
own spec (U002).

## Derived Counts (verified 2026-10-18)

| Figure | Value | Source |
|--------|-------|--------|
| Subtopics | 61 | `data.json`, `type === "SUBTOPIC"` |
| Subtopics with lessons | 60 | subtopic ids present in `ALL_RESOURCES` |
| Topics | 11 | `data.json`, `type === "TOPIC"` |
| Sections | 3 | `type === "SUBJECT" && parent_id !== null` |
| Lesson links | 329 | `ALL_RESOURCES`, summing `items.length` for series |
| PYQ papers | 39 | `constants/pyqPapers.ts`, years 1990–2025 |
| Practice chapters | 28 | `constants/practiceChapters.ts` |
| Practice questions | 870+ | sum of `questionCount` in `practiceChapters.ts` |

Five corrections to this table, all found while verifying rather than assuming:

1. **Sections is 3 only with the `parent_id` guard.** `data.json`'s root (id 1, "CAT
   Preparation") is *itself* typed `SUBJECT`, so a bare type filter returns **4**.
2. **"110 curated resources" undercounts the product by 3×.** `resources.json` holds 110
   standalone entries, but the roadmap renders `ALL_RESOURCES`, which also merges 35
   instructor series from `videoSeries.json` containing **219 further videos**. A visitor can
   open **329** links. The page uses 329.
3. **Resource coverage is 60 of 61, not 52 and not 61.** Counting `resources.json` alone gives
   52; the remaining 8 are covered by instructor series. Exactly one subtopic is genuinely
   empty — node 59, "Similar Structure and Arguments". So the page may say "61 subtopics, 60
   with lessons attached" and must not say "every subtopic".
4. **870 is asserted, not measured.** `questionCount` is a hand-maintained literal and
   `check:content` only asserts each chapter matches more than zero Mongo documents. The
   quant route and `sitemap-page` already render it as `870+`; the home page matches them.
5. **1990–2025 spans 36 years but covers 24.** 1992–1995 and 2009–2016 are absent. "39 papers,
   1990 to 2025" is honest; "every CAT paper since 1990" would be false, and the FAQ names the
   gaps outright.

`report/product-review.md` says "40 papers"; the constants file holds 39. RC passage and DILR
set counts live in MongoDB and are deliberately omitted rather than guessed — note that
`usePracticeMasterySummary.ts` appears to derive them via `questionCount / 4`, which is
arithmetic on an assumed divisor, not a count, and must not reach the page.

## Phase A — as built

Shipped on `feat/u001-home-page-redesign`. `npm run build` passes, `/home-preview` prerenders
as a static Server Component, `tsc --noEmit` is clean, `npm test` is 31/31, and the new files
lint clean (the 8 pre-existing `react/no-unescaped-entities` errors elsewhere are untouched).

**New files**

| File | Kind | Role |
|------|------|------|
| `src/app/home-preview/page.tsx` | server | Composes the page; `noindex`; own description |
| `src/app/components/home/HomeHeader.tsx` | server | Masthead linking into three surfaces |
| `src/app/components/home/Hero.tsx` | server | Claim, one action, the roadmap beside it |
| `src/app/components/home/RoadmapPreview.tsx` | server | Live mini-tree from `data.json` |
| `src/app/components/home/SurfaceList.tsx` | server | The five surfaces, rule-separated |
| `src/app/components/home/Figures.tsx` | server | Four derived numerals |
| `src/app/components/home/WhyItWorks.tsx` | server | The distraction-free passage |
| `src/app/components/home/StartHere.tsx` | server | Three entry points by situation |
| `src/app/components/home/SectionHeading.tsx` | server | Shared heading block (DRY) |
| `src/app/components/home/FaqAccordion.tsx` | **client** | The only interactive block |
| `src/app/components/home/SectionTracker.tsx` | **client** | Observes `[data-section]`, renders null |
| `src/app/lib/homeCounts.ts` | — | Every figure, derived |
| `src/constants/homeSurfaces.ts` | — | The five surfaces as data |
| `src/constants/homeFaqs.ts` | — | Reconciled FAQ set |

**Three deliberate deviations from this spec**

1. **The shared `Footer` was fixed in Phase A, not Phase B.** Building a second, correct
   footer for the preview would have duplicated a component, which the DRY rule forbids, and
   showing the broken one in a quality review would have been misleading. Fixed: three dead
   `<span>`s became two real links (GitHub, `/sitemap-page`), the Platform column now lists
   all five surfaces, the multi-exam blurb is CAT-only, and `© 2025` is now derived.
   **This also changes the footer on the five `/cat-prep` pages** — strictly improvements, but
   it is a live change and is called out rather than buried.
2. **Focus rings are scoped to `.ed-page`, not global.** Applying them site-wide would have
   been a real accessibility change riding along silently on a preview route. The rest of the
   site still has no focus styling; that deserves its own spec.
3. **Instrument Serif is registered with `preload: false`.** The CSS variable has to resolve
   site-wide from `layout.tsx`, but only the preview paints display type, so no other page
   should pay to fetch the font. Flip to `true` at the swap.

**Known gap carried into Phase B:** the `websiteSchema` JSON-LD in `layout.tsx` still says
"community-driven guidance for CAT and other competitive exam preparation". It renders on
every page, including the live `/`, so it is a site-wide metadata change, not a home-page one.
The preview's own `<title>`, description, OG and Twitter metadata are clean.

**Visual iteration (second pass, after the first version was judged too plain)**

The first build stripped the AI tells and the visual energy with them: no colour, washed-out
12px labels, grey body copy, a flat rectangle for the primary action, and a thin-bordered box
around the one thing on the page that shows the product. Restraint is not the same as
editorial. Corrected by using teal structurally rather than decoratively:

- Masthead carries a 3px ink rule over a teal rule — the newspaper double-rule.
- Primary action is solid ink with a hard offset teal shadow that shifts on hover.
- The roadmap plate gets a 2px ink border, a solid ink header bar and a 7px offset teal
  shadow, making the product the most physically present object in the hero.
- The figures band inverts to solid ink with the numerals set large in bright teal, giving
  the page a dark anchor it completely lacked.
- Kickers (small-caps teal labels with a trailing rule) replace the washed-out eyebrows.
- Body copy raised to 16–17px at a darker ink; headline ends on *last paper* in italic serif.

**Tooling: Playwright added as a devDependency.** `scripts/screenshot.mjs` captures `/` and
`/home-preview` at 1440 / 768 / 390 via `npm run shot`, reporting page height and flagging
horizontal overflow. Output goes to `.screenshots/`, git-ignored. This exists because the
first two versions were designed without ever seeing them render; three defects were found
within minutes of the first capture and were not findable from the HTML:

1. The hero headline at 76px overflowed its ~600px column, orphaning "paper." onto a third
   line. Capped at 50px with `text-wrap: balance` and "last paper" held together.
2. The hero was unbalanced — the left column ended ~150px above the plate. Fixed with a
   footnote line and a shorter plate.
3. Section padding of 144px between every section made the page read as empty. Tightened,
   and the two long-form sections became heading-left / content-right splits so they stop
   leaving half the page blank.

**Phase B — the swap, as shipped**

- `/home-preview` moved into `src/app/page.tsx` and the preview route deleted. The page keeps
  the analytics id `landing` from the old page, so the GA4 funnel stays continuous rather
  than reading as the landing page losing all its traffic.
- `LandingPageClient.tsx` (1,006 lines) deleted. `src/app/data.ts` deleted with it — once the
  client page was gone nothing imported `FAQS`, and `COURSES` was already dead.
- Title and description on `/` now derive their figures from `homeCounts`, and the page emits
  `FAQPage` structured data from `HOME_FAQS`.
- `layout.tsx`: the site-wide title, description, OG, Twitter and the `websiteSchema` JSON-LD
  all drop "community-driven" and "CAT and other competitive exam preparation" — 7 occurrences
  across 4 metadata blocks plus the schema, which sits outside the `metadata` object and is
  easy to miss. Instrument Serif flipped to `preload: true` now that `/` paints display type
  above the fold.
- Dead CSS removed: `.btn-primary`, `.btn-secondary`, `.card-hover` and the three `animate-*`
  utilities with their keyframes. `.faq-answer`, `.details-panel` and `.svg-diagram` were
  verified as still used by the `/cat-prep` surfaces and kept.

  **Correction (U002 survey).** This spec originally claimed the legacy `@theme` tokens
  generate Tailwind utilities the `/cat-prep` pages still use. That is wrong. Verified counts
  across `src/**/*.{ts,tsx}`: `--trust-navy` has **82** usages; `--trust-blue`, `--hope-teal`,
  `--warm-gold`, `--calm-bg`, `--calm-border`, `--page-bg` and all four `--shadow-*` have
  **zero each**. The surfaces use raw hex (`#1E3A5F` ×107, `#94A3B8` ×80, `#E2E8F0` ×70), not
  the utilities. Only `--trust-navy` is load-bearing; the rest are deleted in U002 Phase 1.

**Waitlist removed entirely**, at the user's direction — the open question above is closed in
favour of deletion. Gone: `src/app/api/waitlist/route.ts`, `src/lib/waitlistQueries.ts`,
`src/lib/waitlistValidation.ts`, `src/app/cat-prep/models/waitlist.ts` and
`src/__tests__/waitlistValidation.test.ts`. The suite drops from 31 tests to 26 accordingly,
and `planning/G003` is marked superseded.

**Three defects in this work, found by the U002 survey and fixed there**

Recorded here because they are U001's, not U002's. All verified independently.

1. `--ink-faint` (`#6b7589`) is **4.41:1** on `--paper` and **4.04:1** on `--paper-sunk`, below
   the 4.5:1 AA threshold for normal text, and is live at 12-13px in `SurfaceList.tsx:65`,
   `RoadmapPlate.tsx:170` and `FaqAccordion.tsx:62`. The acceptance criterion above claiming
   "primary copy meets WCAG AA" was checked against `--accent-text` and not against this.
   Retired to `#5A6478` (5.66 / 5.19) in U002 Phase 2.
2. `.ed-page > *` (`globals.css:252-255`) forces `z-index: 1` on every direct child. Tailwind
   v4 emits utilities inside `@layer utilities`, so this unlayered rule beats them — adding
   `ed-page` to a `/cat-prep` root would clamp `DetailsPanel` and `SignInModal` behind the
   sticky header. Latent today because `ed-page` is on exactly one element.
3. `--measure: 68ch` (`globals.css:78`) was added and never used.

**Two content defects found, not fixed, both outside U001:**
- Node 20 is titled "Mixtures and Allegations" — a misspelling of *Alligations*, which
  `practiceChapters.ts` spells correctly. Fixing it changes a slug and a prerendered URL, so
  it needs its own change. The mini-tree currently shows Algebra and the first five
  Arithmetic subtopics, so the typo is not visible, but that is luck, not design.
- `details/FeedbackForm.tsx:6` hardcodes a personal WhatsApp number in a public repo.

## Acceptance Criteria

### Positioning
- [ ] All five surfaces (Learn, Practice, PYQ, Daily Dose, How to Prepare) are visible on `/`
      without scrolling past the second section, each with a working direct link.
- [ ] "PYQ" is expanded on first use — a first-time visitor who does not know the acronym can
      still tell what the section is.
- [ ] No reference anywhere on `/` to GMAT, GRE, UPSC, "other exams" or "competitive exams"
      (generic/plural). `grep -rni "gmat\|gre\b\|upsc\|competitive exam" src/app/page.tsx
      src/app/components/home/ src/app/data.ts src/app/layout.tsx` returns nothing.
- [ ] The comparison table is gone, along with its `COMPARISON_ROWS`, `COMPARISON_COLS` and
      `comparisonValColor` definitions.
- [ ] Every numeric claim traces to `homeCounts.ts`. No hardcoded figure in JSX.
- [ ] No invented social proof, testimonial or user count.

### Visual
- [ ] No pill badge, no pulsing dot, no middot-separated feature list.
- [ ] No CSS gradient anywhere on `/`.
- [ ] No `repeat(auto-fit, minmax(260px, 1fr))` card grid.
- [ ] The icon characters `₹`, `?`, `▶` are gone; any icon is real SVG or omitted.
- [ ] The hero shows a live render of real `data.json` nodes.
- [ ] Body copy is at least 16px; primary copy meets WCAG AA against the page background.
- [ ] Sections are left-aligned, not centred.

### Side-by-side (Phase A)
- [ ] `/` renders exactly as it does today — byte-identical output, no regression.
- [ ] `/home-preview` renders the new design and both can be open at once.
- [ ] `/home-preview` returns `noindex, nofollow` and does not appear in `/sitemap.xml`.
- [ ] No waitlist on `/home-preview`: no email field, no course dropdown, no call to
      `/api/waitlist`.

### Code quality
- [ ] The preview page is a Server Component; only `FaqAccordion` and `SectionTracker` carry
      `"use client"`.
- [ ] Hover and focus states are CSS classes, not the roughly 8 inline
      `onMouseEnter`/`onMouseLeave` handlers that mutate `style` directly. Every interactive
      element has a visible `:focus-visible` state — the current page has none.
- [ ] Every new file carries its `// filename — description` header.
- [ ] No `any`. No `eslint-disable`. No dead exports left behind.
- [ ] `npm run lint` and `npm run test` pass.
- [ ] `npm run build` succeeds.

### Analytics
- [ ] `section_viewed`, `scroll_depth`, `cta_click` and `faq_expanded` fire from the preview
      page with unchanged payload shapes. Section ids change with the new section set; the new
      ids get recorded in `report/event-registry.md` as part of this work.
- [ ] `waitlist_submitted` and `exam_preference_selected` no longer fire from the home page.
      Both are marked retired-on-home in `report/event-registry.md` with the reason, so a drop
      in the GA4 funnel is explained rather than read as a bug.
- [ ] Preview-page events are distinguishable from live-page events, so comparison traffic
      does not pollute the `/` funnel.

## Test Plan

1. `npm run dev`, open `/`. Confirm the five surfaces are present and every link resolves —
   `/cat-prep`, `/cat-prep/practice`, `/cat-prep/pyq`, `/cat-prep/daily-dose`,
   `/cat-prep/how-to-prepare`.
2. Compare rendered figures against the Derived Counts table above.
3. Mobile at 360px and 390px: no horizontal scroll, mini-tree legible or gracefully hidden,
   tap targets at least 44px.
4. Desktop at 1280px and 1920px: the asymmetric grid holds, measure stays capped.
5. Keyboard only: Tab through the whole page. Every link, FAQ trigger and waitlist field takes
   a visible focus ring. Accordions open on Enter and Space.
6. Expand the longest FAQ answer (`cost`) and confirm no clipping — the current implementation
   hard-caps `max-height: 200px`, a latent bug at smaller widths.
7. Open `/` and `/home-preview` in two tabs and compare directly. Confirm `/` is unchanged
   from `staging`, and that `curl -s localhost:3000/home-preview | grep -i robots` shows
   `noindex`.
8. GA4 DebugView: scroll the full page and confirm each event above fires once with the expected
   payload.
9. View source on `/` and confirm the surface names, counts and links are in the server HTML
   (they currently are not — the whole page is client-rendered).
10. Lighthouse on `/` before and after; record both. Expect LCP and TBT to improve as the page
    moves to the server.
11. Edge cases: `data.json` with an empty first subject (mini-tree must not crash);
    `resources.json` empty (figures degrade rather than rendering "0 resources" as a selling
    point); long display headline at 320px.

## Out of Scope

- The Learn / Practice / PYQ / Daily Dose / How to Prepare surfaces themselves. Separate spec.
- Dark mode (tracked in the Daily Challenge Backlog).
- The performance-analytics feedback loop and the mock percentile screen
  (`report/product-review.md` §3b, §3c) — the real product gaps, but not UI work.
- Founder story and social proof (§3f) — needs real content, not a layout.
- Replacing the word "community" site-wide (§3g) — touched only where it appears in the files
  this spec already edits.
- Screenshot capture for the PYQ mock palette. Requires the user; the page ships without it if
  unavailable.

## Resolved Decisions

1. **Branch** — ✅ `feat/u001-home-page-redesign`, cut from latest `staging`. The stale `text`
   instruction in CLAUDE.md is replaced by a rule that every change gets its own branch cut
   fresh from `staging`.
2. **Waitlist** — ✅ Removed from the home page. `planning/L101` is closed as moot. Whether to
   delete the now-unreferenced `/api/waitlist` route is left open deliberately (see "No
   waitlist" above).
3. **Side-by-side** — ✅ New design ships to `/home-preview` first; `/` is untouched until the
   user approves. The swap is Phase B.

## Open Questions

1. **Display font.** Instrument Serif or Newsreader? The preview ships with Instrument Serif;
   swapping is a one-line change in `layout.tsx` plus the display token. Best judged on sight
   rather than argued in advance — which is the point of the preview route.
2. **`/api/waitlist`** — keep the unreferenced route and libs, or delete them? Default is keep.
