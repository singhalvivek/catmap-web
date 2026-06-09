# P003 — Continue Practice Strip

## Goal
Add a "Continue Practice" strip to the roadmap home page, similar to "Continue Learning", showing practice sections the user has started but not finished.

## Files Affected
- `src/app/cat-prep/components/ContinuePractice.tsx` — new component
- `src/app/cat-prep/components/RoadmapContent.tsx` — import and place after ContinueLearning

## Acceptance Criteria
- [ ] Strip is hidden when no practice sections have been started
- [ ] Strip shows chips for Quant chapters with `X/Y` format (e.g. "6/20 done")
- [ ] Strip shows chips for DILR sets with "X done" (no known total per set)
- [ ] Strip shows chips for VARC RCs with "X done" (no known total per RC)
- [ ] Completed Quant chapters (`answered >= questionCount`) are excluded
- [ ] Each chip navigates to the correct practice URL
- [ ] Visual style matches ContinueLearning (white card, blue accent)

## Data Source
localStorage only (`sn_practice__*` keys). No auth dependency — works for logged-out users too.

## Key Enumeration Strategy
- **Quant**: Enumerate all chapters from `PRACTICE_SUBJECTS` deterministically; check each key
- **DILR**: Scan all `sn_practice__dilr-*` keys in localStorage; resolve chapter name from PRACTICE_SUBJECTS
- **VARC RC**: Scan all `sn_practice__varc-rc-*` keys in localStorage

## Storage Key Parsing
- Quant: `quant-{topicSlug}-{chapterSlug}` — slugs can contain hyphens; enumerate from config
- DILR: `dilr-{chapterSlug}-{setNum}` — match against known chapter slugs to avoid ambiguous splits
- VARC: `varc-rc-{num}` — simple integer suffix

## Test Plan
- Start a Quant chapter (answer a few questions), reload roadmap → chip appears with correct fraction
- Complete a Quant chapter (answer all 20) → chip disappears
- Start a DILR set → chip appears  
- Start a VARC RC → chip appears
- Clear localStorage → strip is hidden
