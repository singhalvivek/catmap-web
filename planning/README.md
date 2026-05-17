# Planning — StudyNaksha

This folder contains all planning specs for StudyNaksha features and changes.

## Workflow

Every change follows this exact sequence — no skipping:

1. **Pick** — Open [00-index.md](./00-index.md), choose a pending item.
2. **Spec** — Create a spec file (e.g. `planning/H101-resource-viewer.md`) with:
   - Goal
   - Files affected
   - Acceptance criteria
   - Test plan
3. **Implement** — Make the changes described in the spec. One concern per PR.
4. **Review** — Run the `code-reviewer` sub-agent. Must pass before continuing.
5. **User review** — User tests the feature locally.
6. **Commit** — After approval, commit and mark the item ✅ in `00-index.md`.

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Feature spec | `{ID}-{slug}.md` | `H101-resource-viewer.md` |
| Phase spec | `{phase}-phase.md` | `SEO-phase.md` |
| Implementation log | `{IDs}-implementation.md` | `L3-L4-L5-L6-M10-implementation.md` |

## Priority Tiers

IDs use a prefix to indicate urgency:
- **H** — High priority (core product impact)
- **M** — Medium priority (quality / content)
- **L** — Low priority (polish / SEO)

## Rules

- Never bundle unrelated changes into one commit.
- Never skip the code-reviewer step.
- One active spec per branch.
