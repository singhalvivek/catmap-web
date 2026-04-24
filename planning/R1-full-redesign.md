# Spec: R1 — Full UI Redesign

**Status:** Ready for user review
**Branch:** `text`
**Design source:** `e:\Downloads\studynaksha\design_handoff\`

---

## Goal

Implement the StudyNaksha design handoff pixel-accurately: new typography, updated colour tokens, a completely rebuilt landing page, and a rebuilt CAT roadmap page with subject tabs, topic accordion rows, subtopic chips, a Daily Challenge card, and a Continue Learning strip.

---

## Files Changed

### Modified

| File | What changed |
|------|-------------|
| `src/app/layout.tsx` | Replaced Geist with **Plus Jakarta Sans** (`--font-jakarta`); removed Geist Mono import |
| `src/app/globals.css` | Added `--page-bg` token, shadow vars, keyframe animations (`pulseDot`, `fadeInUp`, `slideInPanel`), utility classes (`.animate-*`, `.card-hover`, `.faq-answer`); removed duplicate subject-colour vars |
| `src/app/page.tsx` | Full landing page rewrite — inline nav, hero, how-it-works, roadmaps table, waitlist block, FAQ accordion, CTA section |
| `src/app/cat-prep/page.tsx` | Converted to **Server Component** — loads JSON data, calls `buildTree`, renders `<ProgressProvider><RoadmapContent …/>` |
| `src/app/cat-prep/components/Header.tsx` | New visual design: SNLogo + wordmark, "CAT 2025" pill, ghost auth button, "← Home" link; Firebase auth logic kept |
| `src/app/cat-prep/components/Footer.tsx` | New three-column dark footer with SNLogo and nav links |
| `src/app/cat-prep/components/details/DetailsPanel.tsx` | Full rewrite as a unified fixed side-panel — progress 3-button row, description, resource cards, suggest-edit form; `originalDesc`/`originalResources` memoised; `aria-label` on all form inputs |

### New

| File | Purpose |
|------|---------|
| `src/app/cat-prep/components/SNLogo.tsx` | Inline SVG brand logo (navy + teal overlapping books) |
| `src/app/cat-prep/components/ProgressRing.tsx` | SVG circle progress ring with animated `stroke-dashoffset` |
| `src/app/cat-prep/components/SubjectTab.tsx` | Tab button for QA / DILR / VARC with `ProgressRing` and completion % |
| `src/app/cat-prep/components/TopicRow.tsx` | Accordion row for a TOPIC node; expands to show subtopic chips; `aria-expanded` on toggle button |
| `src/app/cat-prep/components/SubtopicChip.tsx` | Chip button for a SUBTOPIC; progress dot (green/amber/slate) |
| `src/app/cat-prep/components/DailyChallenge.tsx` | Daily rotating quiz card; question selected by `date % questions.length`; Check Answer / Try Again flow; `disabled` on Check Answer until option selected |
| `src/app/cat-prep/components/ContinueLearning.tsx` | Amber strip of in-progress subtopic chips; hidden when `inProgress.length === 0` |
| `src/app/cat-prep/components/RoadmapContent.tsx` | **Client Component** — all `useState` / `useEffect` / `useProgressContext` logic for the roadmap page |
| `src/app/cat-prep/lib/subjectMeta.ts` | `SUBJECT_META` (id → colour/label) and `SUBJECT_META_BY_ABBR` (abbr → colour/label) constants |

### Deleted (dead code)

| File | Replaced by |
|------|------------|
| `components/Tree.tsx` | `TopicRow` + `SubtopicChip` |
| `components/TreeNode.tsx` | `TopicRow` + `SubtopicChip` |
| `components/Faq.tsx` | Inline FAQ in `RoadmapContent` |
| `components/details/NodeHeader.tsx` | Folded into `DetailsPanel` |
| `components/details/NodeDescription.tsx` | Folded into `DetailsPanel` |
| `components/details/ResourceList.tsx` | Folded into `DetailsPanel` |
| `components/details/FeedbackForm.tsx` | Folded into `DetailsPanel` |

---

## Design Tokens Added

```css
/* :root */
--page-bg:          #FFFDF8;   /* warm off-white page background */
--shadow-card:      0 4px 20px rgba(30,58,95,0.07);
--shadow-card-hover:0 12px 32px rgba(30,58,95,0.1);
--shadow-panel:    -8px 0 32px rgba(30,58,95,0.1);
--shadow-btn-teal:  0 2px 8px rgba(20,184,166,0.35);
```

Subject colours (QA navy / DILR teal / VARC amber) are defined once in `subjectMeta.ts` and derived from there everywhere — not repeated in CSS vars or component constants.

---

## Architecture Decisions

### Server / Client split on `/cat-prep`
`cat-prep/page.tsx` is a **Server Component**: it imports the JSON files, calls `buildTree()`, and passes the resulting `subjects[]`, `descriptions[]`, `resources[]`, and `faqs[]` arrays as props to `<RoadmapContent>`. This keeps the JSON payload out of the client JavaScript bundle.

`RoadmapContent.tsx` is the **Client Component** (`"use client"`) that manages all interactive state (`useState`, `useEffect`, `useProgressContext`).

### Unified `DetailsPanel`
The four sub-components from the M1 refactor (`NodeHeader`, `NodeDescription`, `ResourceList`, `FeedbackForm`) were consolidated back into a single `DetailsPanel.tsx`. The logic is unchanged; the components were thin JSX wrappers that added file-count overhead without meaningful separation of concerns at this scale. `DetailsPanel` is now self-contained: it manages the fixed-panel wrapper, animation, progress buttons, description, resources, and suggest-edit form.

### `subjectMeta` as the single source of truth for subject colours
`SUBJECT_META` (keyed by node id) and `SUBJECT_META_BY_ABBR` (keyed by "QA"/"DILR"/"VARC") are the only place subject colours and labels are defined. All components derive from one of these two exports — no duplicated hex values.

---

## Acceptance Criteria

- [x] Plus Jakarta Sans is the default sans font sitewide
- [x] Landing page: hero badge pulse, gradient background, stats row, how-it-works cards with hover lift, roadmaps table (CAT live + 3 coming-soon rows), waitlist email block, FAQ accordion, gradient CTA section
- [x] Roadmap page hero with full-width progress bar (`X/Y subtopics`)
- [x] Three subject tabs (QA / DILR / VARC) each showing `ProgressRing` and `% done`
- [x] Active tab highlighted with section-colour border + light background
- [x] Topic accordion rows expand / collapse with subtopic chips inside; dot colour reflects progress
- [x] `ContinueLearning` strip shown only when ≥ 1 subtopic is `IN_PROGRESS`
- [x] `DailyChallenge`: select option → Check Answer reveals result + explanation → Try Again resets
- [x] `DetailsPanel` slides in from right (280 ms cubic-bezier); closes on ✕ click or ESC key
- [x] Progress 3-button row (`Not Started / In Progress / Done`) saves to Firestore when logged in
- [x] Suggest Edit form submits to existing `/api/feedback` endpoint

---

## Test Plan

- [ ] Open `/` — verify font, hero, FAQ open/close, waitlist join ("You're on the list!"), CTA buttons
- [ ] Open `/cat-prep` — verify hero gradient, progress bar shows 0/N, subject tabs render
- [ ] Click a subtopic chip → DetailsPanel slides in → click 3 status buttons → verify Firestore write (check dev tools or login)
- [ ] Mark one subtopic `IN_PROGRESS` → ContinueLearning strip appears; clicking chip opens panel
- [ ] Mark subtopics `Done` → tab % updates, progress bar fills
- [ ] Daily Challenge: select wrong answer → Check Answer → red highlight, explanation → Try Again → state resets
- [ ] Panel close: ✕ button, ESC key, mobile overlay tap
- [ ] Suggest Edit → fill name/email/comment → Submit → alert confirms; Cancel → form hides
- [ ] Resize to mobile → DetailsPanel fills screen with dark overlay

---

## Out of Scope

- Firebase auth provider changes
- New pages or routes beyond `/` and `/cat-prep`
- SEO / Open Graph metadata (tracked in SEO phase)
- Dark mode
- Moving question data to JSON (tracked as future ticket)
