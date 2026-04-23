# Spec: M1 — Split DetailsPanel into Sub-Components

**Status:** In Progress  
**Branch:** text

## Goal
Break the 313-line `DetailsPanel.tsx` monolith into focused sub-components so each piece has a single responsibility.

## Target Structure

```
components/details/
  DetailsPanel.tsx      ← orchestrator: owns all state, passes props down
  NodeHeader.tsx        ← type badge + title + progress status picker
  NodeDescription.tsx   ← description view/edit + empty-state nudge
  ResourceList.tsx      ← resource list view/edit
  FeedbackForm.tsx      ← contributor name/email/comment + submit/cancel
```

## Files Affected
- `src/app/cat-prep/components/DetailsPanel.tsx` — move to `components/details/`, slim to orchestrator
- `src/app/cat-prep/components/details/NodeHeader.tsx` — new
- `src/app/cat-prep/components/details/NodeDescription.tsx` — new
- `src/app/cat-prep/components/details/ResourceList.tsx` — new
- `src/app/cat-prep/components/details/FeedbackForm.tsx` — new
- `src/app/cat-prep/page.tsx` — update import path

## Acceptance Criteria
- [ ] `DetailsPanel.tsx` under 60 lines (orchestrator only)
- [ ] No sub-component exceeds 80 lines
- [ ] All existing functionality preserved (progress picker, edit form, submit, nudge)
- [ ] `page.tsx` import updated to new path

## Test Plan
- [ ] Manual: open node panel — header, description, resources all render
- [ ] Manual: change progress status — updates immediately
- [ ] Manual: click "Suggest Edit" — form appears with name/email/comment fields
- [ ] Manual: empty-description node — nudge renders and clicking it opens the form

## Out of Scope
- Redesigning the UI
- Adding new features to the panel

## Notes
- `EditableResource` type is defined in `DetailsPanel.tsx` and exported for `ResourceList.tsx` — avoids premature promotion to models/ for a UI-only form type.
- File header comments required on all new and changed files per `.claude/rules/file-headers.md`.
