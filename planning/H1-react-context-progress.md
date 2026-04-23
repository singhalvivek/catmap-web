# Spec: H1 — Replace Event-Based State with React Context

**Status:** In Progress  
**Branch:** text  
**Report ref:** [report/04-code.md](../report/04-code.md)

## Goal
Replace `window.dispatchEvent("progress-updated")` / `window.addEventListener("progress-updated")` with a `ProgressContext` that is the single source of truth for all progress state. Eliminates localStorage coupling, DOM event hacks, and duplicate auth subscriptions.

## Problems Removed
- `window.dispatchEvent(new Event("progress-updated"))` in `page.tsx` and `DetailsPanel.tsx`
- `window.addEventListener("progress-updated", handler)` in `Tree.tsx` and `TreeNode.tsx`
- `forceUpdate` hack in `Tree.tsx`
- `refreshKey` state in `TreeNode.tsx`
- `calculateNodeProgress` reading `localStorage` and `auth.currentUser` directly (not reactive)
- `useProgress` creating a new `onAuthStateChanged` subscription per component instance
- `localStorage` used as an intermediate cache for Firestore data

## Files Affected
- `src/app/cat-prep/lib/ProgressContext.tsx` — **create**: Context, Provider, `useProgressContext` hook
- `src/app/cat-prep/lib/useProgress.ts` — **delete**: replaced entirely by context
- `src/app/cat-prep/lib/progressCalculator.ts` — accept `progress` map as param instead of reading localStorage
- `src/app/cat-prep/page.tsx` — wrap in `<ProgressProvider>`, remove auth/localStorage/dispatchEvent block
- `src/app/cat-prep/components/Tree.tsx` — remove event listener and forceUpdate
- `src/app/cat-prep/components/TreeNode.tsx` — use context for progress display, remove event listener
- `src/app/cat-prep/components/DetailsPanel.tsx` — use context, remove dispatchEvent

## Acceptance Criteria
- [ ] Zero occurrences of `"progress-updated"` in `src/`
- [ ] Zero occurrences of `window.dispatchEvent` in `src/`
- [ ] Zero occurrences of `window.addEventListener("progress-updated"` in `src/`
- [ ] `useProgress.ts` deleted
- [ ] `calculateNodeProgress` no longer imports `auth` or reads `localStorage`
- [ ] Selecting a node in the panel and changing its status updates the tree progress bar without a page reload

## Test Plan
- [ ] Manual: log in with Google → progress badges on tree nodes show correct %
- [ ] Manual: open a node panel → change status → tree node % updates immediately
- [ ] Manual: log out → all progress badges disappear
- [ ] Manual: hard refresh → progress reloads from Firestore correctly

## Out of Scope
- Redesigning the DetailsPanel UI (M1)
- Adding optimistic UI or offline support
- Changing Firestore schema

## Notes
- `calculateNodeProgress` will receive `progress: Record<number, ProgressStatus>` as a second argument. All callers updated.
- No localStorage reads or writes remain after this change.
