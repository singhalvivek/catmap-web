# Spec: H2 — Rename to StudyNaksha (Branding Overhaul)

**Status:** In Progress  
**Branch:** text  
**Report ref:** [report/05-text-copy.md](../report/05-text-copy.md), [report/07-improvements.md](../report/07-improvements.md)

## Goal
Replace every occurrence of "CatMap", "learnmax", and "Rx for Education" with "StudyNaksha" across all source files. One consistent product name everywhere.

## Occurrences Found

### `src/app/layout.tsx` (1 change)
- Line 16: page `title` metadata → `"StudyNaksha - Master CAT with Interactive Roadmaps"`

### `src/app/page.tsx` (13 changes)
- Line 16: FAQ question `"What is CatMap?"` → `"What is StudyNaksha?"`
- Line 17, 22, 32: FAQ answers — replace `CatMap` → `StudyNaksha`
- Line 21: FAQ question `"Is CatMap free to use?"` → `"Is StudyNaksha free to use?"`
- Line 49, 406: logo/hero text `🗺️ CatMap` → `StudyNaksha`
- Line 91, 120, 149, 157, 246: body copy — replace `CatMap` → `StudyNaksha`
- Line 337: placeholder GitHub URL `yourusername/catmap-web` → `yourusername/studynaksha` (placeholder stays, just updates the name)
- Line 346: placeholder email `contribute@catmap.com` → `contribute@studynaksha.com`
- Line 395: CTA button `"Explore CatMap Now"` → `"Explore StudyNaksha Now"`
- Line 445: footer copyright `© 2025 CatMap.` → `© 2025 StudyNaksha.`

### `src/app/cat-prep/tree/components/Header.tsx` (2 changes)
- Line 52: brand name `learnmax` → `StudyNaksha`
- Line 53: tagline `"Rx for Education"` → `"Free CAT Prep"`

### `src/app/cat-prep/tree/components/Footer.tsx` (1 change)
- Line 12: `📚 learnmax` → `StudyNaksha`

### `src/app/landing/page.tsx` (3 changes)
- Line 30: brand name `learnmax` → `StudyNaksha`
- Line 31: tagline `"Rx for Education"` → `"Free CAT Prep"`
- Line 106: `🇮🇳 learnmax` → `🇮🇳 StudyNaksha`
- Lines 124, 166, 183: comments/dead code referencing `learnmax` — remove the commented-out lines entirely

### `src/app/landing/data.ts` (4 changes)
- Line 13: FAQ id `"what-is-learnmax"` → `"what-is-studynaksha"`
- Line 14: `"What is learnmax?"` → `"What is StudyNaksha?"`
- Line 24: `"Do I need to create an account or register on learnmax?"` → replace `learnmax` → `StudyNaksha`
- Line 29: `"Does learnmax cost anything?"` → replace `learnmax` → `StudyNaksha`

## Files Affected
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/cat-prep/tree/components/Header.tsx`
- `src/app/cat-prep/tree/components/Footer.tsx`
- `src/app/landing/page.tsx`
- `src/app/landing/data.ts`

## Acceptance Criteria
- [ ] Zero occurrences of `"learnmax"` in `src/` (case-insensitive)
- [ ] Zero occurrences of `"CatMap"` in `src/` (case-insensitive)
- [ ] Zero occurrences of `"Rx for Education"` in `src/`
- [ ] All instances replaced with `"StudyNaksha"` (exact casing)
- [ ] Commented-out lines in `landing/page.tsx` referencing `learnmax` are removed
- [ ] App title in browser tab shows "StudyNaksha"
- [ ] Header on tree page shows "StudyNaksha"

## Test Plan
- [ ] Manual: open `/` — logo, hero, FAQ, footer all say "StudyNaksha"
- [ ] Manual: open `/cat-prep/tree` — header shows "StudyNaksha / Free CAT Prep"
- [ ] Manual: browser tab shows "StudyNaksha - Master CAT with Interactive Roadmaps"

## Out of Scope
- Renaming the Firebase project ID (`learnmax-vivek`) — that is a Firebase Console action, not a code change
- Renaming the GitHub repo URL — placeholder stays as `yourusername/studynaksha`
- Changing the URL path `/cat-prep/tree` — route paths are not part of this rename

## Notes
- The `landing/` route is dead (nothing links to it) but we still update it for consistency since it's not deleted yet (that's M6).
- Firebase project ID `learnmax-vivek` will remain in env vars — document this in `.env.example` as a note.
