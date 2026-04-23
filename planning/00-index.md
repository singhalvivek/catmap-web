# StudyNaksha — Refactor Planning Index

**Branch:** `text`  
**Last updated:** 2026-04-22

Each item links to its spec doc once created. Update the status column after each commit.

## How to Use

1. Pick the next `🔲 Todo` item below.
2. Create a spec doc: `planning/<ID>-<slug>.md` (use the template at the bottom of this file).
3. Implement → run `code-reviewer` agent → user tests locally → commit.
4. Update status here to `✅ Done` with the commit hash.

---

## High Priority

| ID | Change | Spec | Status | Commit |
|----|--------|------|--------|--------|
| H1 | Replace event-based state with React Context | [spec](./H1-react-context-progress.md) | ✅ Done | — |
| H2 | Rename to StudyNaksha (branding overhaul) | [spec](./H2-branding-rename-studynaksha.md) | ✅ Done | — |
| H3 | Remove hardcoded Firebase credential fallbacks | [spec](./H3-remove-hardcoded-firebase-credentials.md) | ✅ Done | — |
| H4 | Add input validation + real error handling to feedback API | — | ⏸ Deferred (out of scope for this refactor) | — |
| H5 | Consolidate to `/cat-prep`, remove `/cat-prep/tree` dead route | — | ✅ Done | — |
| H6 | Rename `youtubevideo_title` → `title` in resources | — | ✅ Done | — |

## Medium Priority

| ID | Change | Spec | Status | Commit |
|----|--------|------|--------|--------|
| M1 | Split DetailsPanel into sub-components | [spec](./M1-split-details-panel.md) | ✅ Done | — |
| M2 | Fix `parent_id: ""` → `null` in data.json + type | — | ✅ Done | — |
| M3 | Tighten TypeScript types (NodeType union, ResourceType) | — | ✅ Done | — |
| M4 | Add empty-description state + contribution nudge | — | ✅ Done | — |
| M5 | Remove unused `@xyflow/react` dependency | — | ✅ Done | — |
| M6 | Promote `/landing` to root `/`, delete old root | [spec](./M6-delete-landing-promote-to-root.md) | ✅ Done | — |
| M7 | Add ARIA labels and keyboard navigation | — | ⏸ Deferred | — |
| M8 | Load tree data server-side (Server Component) | — | ⏸ Deferred (needs backend split) | — |
| M9 | Memoize progress calculation + 70% TOPIC gate + restrict progress saving to subtopics | — | ✅ Done | — |
| M10 | Expand FAQ content (platform-specific questions) | — | ✅ Done | — |

## Low Priority

| ID | Change | Spec | Status | Commit |
|----|--------|------|--------|--------|
| L1 | Per-page metadata (`generateMetadata`) | — | ⏸ Deferred (SEO phase) | — |
| L2 | Add `robots.txt` and `sitemap.xml` | — | ⏸ Deferred (SEO phase) | — |
| L3 | `rel="noopener noreferrer"` + `target="_blank"` on all external links | — | ✅ Done (already correct in ResourceList) | — |
| L4 | Error boundary around `<Tree />` | — | ✅ Done | — |
| L5 | Unit tests for `buildTree.ts` and `progressCalculator.ts` | — | ✅ Done (12/12 passing, Vitest) | — |
| L6 | Standardise node title casing in `data.json` | — | ✅ Done | — |
| L7 | Rename `THIS_WEEK` progress status to clearer label | — | N/A (status removed) | — |
| L8 | Add `updatedAt` timestamp to Firestore progress writes | — | ✅ Done | — |
| L9 | Open Graph image for social sharing | — | ⏸ Deferred (SEO phase) | — |

---

## Spec Template

Copy this when creating a new spec file (`planning/<ID>-<slug>.md`):

```markdown
# Spec: <ID> — <Title>

**Status:** In Progress  
**Branch:** text  
**Report ref:** [report/07-improvements.md](../report/07-improvements.md)

## Goal
One sentence: what this change achieves and why.

## Files Affected
- `path/to/file.tsx` — what changes
- `path/to/other.ts` — what changes

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Test Plan
- [ ] Manual: describe what to click/check in the browser
- [ ] Unit (if applicable): what function to test and expected output

## Out of Scope
What this PR deliberately does NOT change (to keep it focused).

## Notes
Any constraints, decisions, or open questions.
```
