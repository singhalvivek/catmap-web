# StudyNaksha — Claude Instructions

## Project
**StudyNaksha** is a free CAT exam prep platform (Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · Firebase 12 · Firestore). No backend — all content is served from static JSON files in `src/app/cat-prep/`. Auth is Google Sign-In only.

Previous names ("CatMap", "learnmax") are being renamed to "StudyNaksha" in this refactor branch (`text`).

## Refactoring Workflow

Every change follows this sequence — no exceptions:

1. **Plan** — Read `planning/00-index.md`, pick an item, create a spec doc in `planning/` (e.g. `planning/H2-branding.md`) with: goal, files affected, acceptance criteria, test plan.
2. **Implement** — Make the changes described in the spec. One concern per PR.
3. **Review** — Run the `code-reviewer` sub-agent. It must pass before proceeding.
4. **User review** — User tests the feature locally.
5. **Commit** — After user approval, commit and update `planning/00-index.md` status to ✅.

Never skip steps. Never bundle unrelated changes into one commit.

## Code Rules

- **DRY** — No duplicated logic. Extract shared code before writing it twice.
- **No secrets** — Never hardcode API keys, tokens, or credentials. No fallback values for env vars. See `.claude/rules/no-secrets.md`.
- **No `any`** — Use proper TypeScript types. Narrow unions before using `string`.
- **No magic strings** — Define constants for repeated string values (event names, status keys, routes).
- **No dead code** — Remove unused imports, components, routes, and dependencies before committing.
- **No comments that explain what** — Only comment when the *why* is non-obvious.
- **Standard Next.js** — See `.claude/rules/nextjs-conventions.md`.

## File Structure Rules

- Components in sub-folders when a component has 3+ related sub-components.
- Hooks in `src/app/cat-prep/tree/lib/` (until a shared `src/hooks/` is created per plan).
- Types in `models/` — one file per domain entity.
- Constants in `src/constants/` (create when needed).
- Planning specs in `planning/`.

## What NOT to Do

- Do not install new dependencies without discussing first.
- Do not move data out of JSON files (no backend yet).
- Do not create new pages or routes outside the plan.
- Do not amend published commits — create new ones.
- Do not run `git push` without user confirmation.
- Do not add `eslint-disable` comments to silence lint errors — fix the root cause.

## Branch
All refactor work happens on the `text` branch.
