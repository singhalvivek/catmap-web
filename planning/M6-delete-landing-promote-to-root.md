# Spec: M6 — Promote `/landing` to Root, Delete Old `/`

**Status:** In Progress  
**Branch:** text  
**Report ref:** [report/01-structure.md](../report/01-structure.md)

## Goal
Make the `/landing` page the new root `/` page and delete the old root `page.tsx`. This removes the dead `/landing` route and gives the site a proper public-facing home page.

## Context
- `src/app/page.tsx` — current root page (dark-mode, blue Tailwind classes, pricing comparison table, inline FAQ data). **Will be deleted.**
- `src/app/landing/page.tsx` — landing page using the site's custom theme tokens (trust-navy, hope-teal, calm-bg). Imports data from `./data`. **Will become the new root.**
- `src/app/landing/data.ts` — COURSES and FAQS data arrays used by the landing page. **Will move to `src/app/data.ts`.**

## Files Affected
- `src/app/page.tsx` — **delete** (replaced by landing content)
- `src/app/landing/page.tsx` — **move** to `src/app/page.tsx`; update import path `"./data"` → `"./data"` (same relative path, still works since both files move to `src/app/`)
- `src/app/landing/data.ts` — **move** to `src/app/data.ts`
- `src/app/landing/` — **delete** directory entirely (empty after moves)
- Any raw `<a href="/cat-prep">` in the new root page — replace with `<Link href="/cat-prep">` from `next/link` (Next.js convention)

## Acceptance Criteria
- [ ] `GET /` returns the former landing page content (StudyNaksha nav, hero, courses table, FAQ accordion)
- [ ] `GET /landing` returns 404 (route no longer exists)
- [ ] No raw `<a>` for internal links — all use `<Link>` from `next/link`
- [ ] `src/app/landing/` directory does not exist
- [ ] No broken imports — `data.ts` is correctly imported from its new location

## Test Plan
- [ ] Manual: open `/` — see StudyNaksha hero, courses table, FAQ accordion, footer
- [ ] Manual: open `/landing` — get 404 page
- [ ] Manual: click "Explore Roadmaps" / roadmap row button — navigates to `/cat-prep` correctly
- [ ] Manual: FAQ accordion opens and closes correctly

## Out of Scope
- Redesigning or rewriting the landing page content
- Changing the custom theme tokens (trust-navy, hope-teal, etc.)
- Adding metadata (`generateMetadata`) — that is L1

## Notes
- The old `page.tsx` uses dark mode + blue Tailwind classes which are inconsistent with the rest of the site's theme. Removing it in favour of the themed landing page is the correct direction.
- `data.ts` import path in the new root `page.tsx` stays `"./data"` — both files land in `src/app/`, so the relative import resolves to `src/app/data.ts`.
