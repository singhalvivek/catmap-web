# G005 — Practice Chapter Chips Become Real Links

## Goal

`PracticeChapterChip` renders a `<button>` that opens a sign-in modal for logged-out users instead of navigating. The practice chapter pages it points at are already open — `QuestionPlayer`, `DilrPlayer` and `RcPlayer` have no auth gate — so the modal blocks nobody who is determined, while ensuring Googlebot has no crawlable link to any practice page. Those URLs are in `sitemap.ts` with nothing internally linking to them.

Same defect and same fix as `PyqPaperRow` in G001, on a different surface. Kept as its own commit so the PYQ work stays reviewable in isolation.

## Files Affected

- `src/app/cat-prep/components/PracticeChapterChip.tsx` — becomes a `<Link>`; drops `useProgressContext`, `useRouter`, modal state and the `SignInModal` import. Hover styling is preserved.

## Acceptance Criteria

- [ ] Each practice chip renders as `<a href>` and appears in `view-source` of `/cat-prep`.
- [ ] A logged-out visitor clicking a chip lands on the chapter page and can answer questions.
- [ ] Hover styling is unchanged.
- [ ] No unused imports left behind.

## Test Plan

- Private window → `/cat-prep` → Practice mode → click a chip → chapter page loads and is usable.
- `curl -s http://localhost:3000/cat-prep | grep -c "practice/quant"` → greater than zero.
- Confirm `SignInModal` is still used elsewhere (`DetailsPanel`) and not left orphaned.

## Out of Scope

- Anything on the practice chapter pages themselves.
- Server-rendering practice questions, the equivalent of G002 for practice (not scoped for August).
