# G001 — PYQ Open Access

## Goal

Remove every sign-in wall between a logged-out visitor (including Googlebot) and a PYQ paper. Today `/cat-prep/pyq/[paperSlug]` renders a full-screen "Sign in to practice" block for unauthenticated users, and the "Practice" CTA on `/cat-prep/pyq` is a `<button>` rather than a link — so Google has no crawlable path to any of the 39 paper pages and, if it reaches one via the sitemap, finds a login prompt and no questions. This is the most likely cause of the 1-of-73 indexing failure.

After this change: reading a paper, selecting an option, and checking an answer all work logged out. `usePracticeProgress` already persists to `localStorage` when signed out and merges into Firestore on sign-in, so no storage work is needed. Sign-in is required only for the timed mock (gated on its own page, unchanged) and for cross-device sync.

This also resolves the contradiction with the homepage's "No sign-up needed" claim and FAQ `account-needed`.

## Files Affected

- `src/app/cat-prep/pyq/[paperSlug]/PyqPaperPlayer.tsx` — delete the `authUser === "loading"` and `!authUser` early-return branches, the `authUser`/`authError` state, the `onAuthStateChanged` effect, and the now-unused `firebase/auth` and `@/lib/firebase` imports.
- `src/app/cat-prep/components/PyqPaperRow.tsx` — "Practice" becomes a `<Link href={browseHref}>`; drop `useProgressContext`, `useRouter`, the modal state, and the `SignInModal` import. Header comment updated to drop "sign-in-gated".

## Acceptance Criteria

- [ ] A logged-out visitor can open `/cat-prep/pyq/<slug>`, read every question, select options, and press "Check Answer" to see the answer + explanation.
- [ ] `/cat-prep/pyq` renders a real `<a href>` to each of the 39 paper pages; `view-source` shows them.
- [ ] `curl` of a paper page (no JS, no cookies) returns question text in the HTML, not "Sign in to practice".
- [ ] Logged-out progress persists across a reload on the same device (localStorage).
- [ ] Signing in mid-session merges local progress into Firestore, unchanged from today.
- [ ] `/cat-prep/pyq/<slug>/mock` still shows "Sign in to take the mock test" when logged out.
- [ ] No unused imports, no `eslint-disable` added, `npx tsc --noEmit` clean.

## Test Plan

- Open a paper in a private window. Read, answer, check — all should work with no prompt.
- Reload; answered state should survive.
- Sign in from the header; the same answers should still be shown and now sync to Firestore.
- `curl -s http://localhost:3000/cat-prep/pyq/cat-2025-slot-1-question-paper-solved | grep -c "Sign in to practice"` → `0`.
- Click "Take Mock Test" logged out → sign-in gate still appears.
- Edge case: a paper section with zero scraped questions still renders "No questions scraped for this section yet."

## Out of Scope

- Server-rendering the full paper (G002).
- The mock-test gate, which stays exactly as it is.
- The unauthenticated `uid`-in-query/body API routes (`/api/pyq/progress`, `/api/pyq/[paperSlug]/submit`) — a real gap, but a separate security concern with its own spec.
- `PracticeChapterChip`, which has the same crawlability problem (G005).
