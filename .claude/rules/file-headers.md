# Rule: File Header Comments

Every source file must have a single-line comment as the very first line (before any imports or directives).

## Format

```
// <filename without extension> — <one-line description of what this file exports or does>
```

## Examples

```ts
// progressCalculator — computes completion % for a tree node from the progress map
```

```tsx
// NodeHeader — node type badge, title, and progress status picker
```

```ts
// ProgressContext — React Context for user progress state; single auth subscription for the cat-prep feature
```

## Rules

1. **Required on every file** — components, hooks, lib utilities, models, constants, config. Not required on `page.tsx`, `layout.tsx`, `error.tsx` (Next.js reserved files where the filename is self-documenting by convention).
2. **Must match the file** — if the file is renamed or its responsibility changes, update the comment.
3. **Single line only** — no multi-line block comments. One sentence max.
4. **Before directives** — for client components, the header goes *before* `"use client"`:
   ```tsx
   // Tree — renders the full syllabus tree; pure render, no local state
   "use client";
   ```
5. **Check on edit** — when editing an existing file, read the first line and verify it still accurately describes the file. Update it if it has drifted.
