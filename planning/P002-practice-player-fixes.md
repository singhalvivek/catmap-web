# P002 — Practice Player Fixes & Code Reuse

**Status**: 🔄 In progress  
**Branch**: practice  
**Created**: 2026-06-08

---

## Goal
Fix bugs in the three practice player components (QuestionPlayer, DilrPlayer, RcPlayer), improve mobile layout, and eliminate code duplication by reusing daily-challenge UI patterns.

## Files Affected

### New files
- `src/app/cat-prep/components/practice/PracticeOptionButton.tsx`
- `src/app/cat-prep/components/practice/PracticePalette.tsx`

### Modified files
- `src/app/cat-prep/lib/practiceProgressStore.ts`
- `src/app/cat-prep/lib/usePracticeProgress.ts`
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/QuestionPlayer.tsx`
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/DilrPlayer.tsx`
- `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/RcPlayer.tsx`

### Read-only reference (do not modify)
- `src/app/cat-prep/daily-challenge/components/MCQOptions.tsx` — option button style to match
- `src/app/cat-prep/daily-challenge/components/QuestionPalette.tsx` — palette grid + legend style to match
- `src/app/cat-prep/daily-challenge/components/TestView.tsx` — desktop sidebar + mobile fixed-bar layout to match
- `src/app/cat-prep/daily-challenge/components/ComprehensionBlock.tsx` — passage block style to match

---

## Bugs

### B1 — RC/Quant auto-show all cached solutions on load ⚠️
**Root cause**: `useEffect` in players calls `setSolutions(loadLocalSolutions(...))` on mount.  
If the user checked solutions in a previous session, all are loaded at once. Every question they navigate to has `hasSolution = true` immediately and the explanation panel appears without clicking "Check Answer".  
**Fix**: Remove `loadLocalSolutions` / `saveLocalSolution` entirely. Do NOT persist full solution data. Instead persist only `correctAnswers: Record<number, string>` (the correct option letter). This is enough to show green/red states on return visits without auto-displaying explanations.

### B2 — Inline PassagePanel / QuestionsPanel cause React remounts ⚠️
**Root cause**: In `DilrPlayer` and `RcPlayer`, `PassagePanel` and `QuestionsPanel` are defined as:
```tsx
const PassagePanel = () => (<div>...</div>);
```
inside the component render body. React sees a **new component type** on every render and fully unmounts + remounts them — losing scroll position, running all effects, and causing unnecessary DOM churn.  
**Fix**: Convert to JSX fragment variables (not components):
```tsx
const passageContent = (<div>...</div>);
const questionsContent = (<div>...</div>);
```
These are JSX elements (not component definitions) so React reconciles them in-place.

### B3 — MathContent re-runs on every render
**Root cause**: `useEffect(() => { ... })` in `MathContent` has no dependency array — runs on every render of QuestionPlayer.  
**Fix**: Add `[html]` as the dependency array so MathJax only re-typesets when the HTML content changes.

### B4 — Double DOM on mobile (dilr-grid + dilr-mobile)
**Root cause**: Both `dilr-grid` and `dilr-mobile` divs are always mounted. On mobile the grid is CSS-hidden but content is fully rendered — two instances of every sub-component alive simultaneously.  
**Fix**: Use a single responsive container with Tailwind classes:
```tsx
// Passage: hidden on mobile when questions tab active
<div className={isQuestionsTab ? "hidden md:block" : "md:col-span-1"}>
  {passageContent}
</div>
```
This renders each panel only once; CSS controls visibility responsively.

### B5 — No mobile pill scrolling / fixed bottom bar for QuestionPlayer
**Root cause**: Pills wrap to multiple rows, pushing the question content far down on small screens.  
Daily challenge uses a fixed bottom scrollable pill bar with `scrollIntoView` on the active pill.  
**Fix**: Adopt the `TestView` mobile pattern — fixed bottom bar, `overflowX: auto`, `scrollbarWidth: none`, and `scrollIntoView` for the current pill on navigation.

---

## Code Reuse Gaps

### R1 — MCQOptions not reused
All three players have ~40 lines of identical inline option-button rendering. Daily challenge `MCQOptions` only handles selected/unselected — no correct/wrong states.  
**Fix**: Create `PracticeOptionButton.tsx` with `idle | selected | correct | wrong` state prop. Use in all three players.

### R2 — QuestionPalette not reused
Daily challenge has a `QuestionPalette` component with grid + legend. `QuestionPlayer` has a hand-rolled `pillStyle()` function.  
**Fix**: Create `PracticePalette.tsx` with practice-specific pill states (`unanswered | answered | correct | wrong | current`). Renders the desktop sidebar and the mobile fixed-bottom-bar — component decides which based on a `variant` prop (`"sidebar" | "bottom-bar"`).

### R3 — SectionHeader not reused
Daily challenge has a nice sticky navy header with back link. Practice players have a plain inline back link.  
**Fix**: Add a sticky practice header using the same navy bar pattern from `SectionHeader` but without the timer — shows `← Back`, chapter name, and question count.

---

## Data Model Change

### Current `PracticeProgress`
```typescript
type PracticeProgress = {
  answers: Record<number, string>;
  revealed: Record<number, boolean>; // ← remove
};
// + separate loadLocalSolutions / saveLocalSolution helpers ← remove
```

### New `PracticeProgress`
```typescript
type PracticeProgress = {
  answers: Record<number, string>;        // qNum → selected option (A/B/C/D)
  correctAnswers: Record<number, string>; // qNum → correct option letter (set after Check)
};
```

**Why**: `correctAnswers` drives the green/red color-coding on pills and option buttons when the user returns to a chapter. The full explanation text is fetched on-demand (per-session, not persisted) so it is never auto-displayed on load.

---

## New Components API

### `PracticeOptionButton`
```tsx
type OptionState = "idle" | "selected" | "correct" | "wrong";

export default function PracticeOptionButton({
  label,          // "A" | "B" | "C" | "D"
  text,           // option text (may contain HTML for MathJax)
  state,          // OptionState
  disabled,       // true after solution shown
  onClick,
}: Props)
```

### `PracticePalette`
```tsx
type PillState = "unanswered" | "answered" | "correct" | "wrong" | "current";

export default function PracticePalette({
  total,          // number of questions
  getPillState,   // (qNum: number) => PillState
  currentNum,
  onSelect,       // (qNum: number) => void
  variant,        // "sidebar" | "bottom-bar"
}: Props)
```

---

## Layout Target (QuestionPlayer)

### Desktop
```
┌─────────────────────────────────────────┐
│ ← Back  |  Chapter Name  |  20 questions │  ← sticky navy header
├─────────────────────────────────────────┤
│                        │                 │
│   Question + Options   │  Palette        │
│                        │  (sticky sidebar│
│   [Check Solution]     │   196px wide)   │
│                        │                 │
└─────────────────────────────────────────┘
```

### Mobile
```
┌─────────────────────┐
│ ← Back  |  Chapter  │  ← sticky navy header
├─────────────────────┤
│                     │
│  Question + Options │
│                     │
│  [Check Solution]   │
│                     │
│  (bottom padding)   │
├─────────────────────┤
│  [1][2][3][4]...    │  ← fixed bottom scrollable pill bar
└─────────────────────┘
```

### DILR / RC (desktop)
```
┌──────────────────────────────────────────┐
│ ← Back  |  Set 1 of 8  |  DILR          │
├──────────────────────────────────────────┤
│  Passage / Diagram  │  Questions + Opts  │
│  (scrollable)       │  [View Solution]   │
└──────────────────────────────────────────┘
```

### DILR / RC (mobile)
```
┌─────────────────────┐
│ ← Back  |  Set 1    │
├─────────────────────┤
│  [Passage][Questions]│  ← tab bar
├─────────────────────┤
│  active panel       │
└─────────────────────┘
```

---

## Acceptance Criteria

- [ ] Refreshing a practice page shows previously selected answers (green/red state) but NOT the explanation text
- [ ] Navigating between questions never shows stale explanation from a different question
- [ ] On mobile (< 768px) QuestionPlayer shows a fixed bottom pill bar that scrolls horizontally
- [ ] DILR/RC passage panel scroll position is preserved when switching between questions
- [ ] MathJax only re-runs when question HTML changes (not on every option select)
- [ ] `PracticeOptionButton` and `PracticePalette` are the single source of option/pill rendering across all three players
- [ ] TypeScript: `tsc --noEmit` reports zero source errors

---

## Implementation Order

1. Update `practiceProgressStore.ts` + `usePracticeProgress.ts` (data model)
2. Create `PracticeOptionButton.tsx`
3. Create `PracticePalette.tsx`
4. Rewrite `QuestionPlayer.tsx` using new components + TestView layout
5. Fix `DilrPlayer.tsx` (B2, B4, R1, use setCorrectAnswer)
6. Fix `RcPlayer.tsx` (B1, B2, B4, R1, use setCorrectAnswer)
7. Run `tsc --noEmit` → verify clean
8. User tests locally
