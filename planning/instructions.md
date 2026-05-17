# Instructions — Adding a New Feature

Step-by-step guide for adding any new feature to StudyNaksha.

---

## 1. Add to the Index

Open [00-index.md](./00-index.md) and add a row to the appropriate section:

```markdown
| H103 | ⬜ | — | Short description of the feature |
```

Pick the right tier (H/M/L) based on product impact.

---

## 2. Write a Spec File

Create `planning/{ID}-{slug}.md`. Use this template:

```markdown
# {ID} — {Feature Name}

## Goal
One paragraph describing what this feature does and why it matters.

## Files Affected
- `path/to/Component.tsx` — what changes
- `path/to/model.ts` — what changes

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Test Plan
- Step 1: ...
- Step 2: ...
- Edge cases: ...

## Out of Scope
- What this spec deliberately does NOT cover.
```

---

## 3. Implement

Follow the code rules in [CLAUDE.md](../CLAUDE.md):
- DRY — no duplicated logic
- No secrets — no hardcoded credentials
- No `any` — proper TypeScript types
- File headers on every source file
- Standard Next.js conventions

---

## 4. Review

Run the `code-reviewer` sub-agent in Claude Code:

```
/review
```

Fix all issues before proceeding.

---

## 5. Test Locally

Start the dev server:

```bash
npm run dev
```

Test every acceptance criterion from the spec. Test mobile + desktop.

---

## 6. Commit

After user approval:
1. Stage only the relevant files.
2. Commit with a clear message referencing the spec ID.
3. Mark the item ✅ in [00-index.md](./00-index.md).

---

## Adding Data (JSON Files)

All content lives in `src/app/cat-prep/`:
- `data.json` — node tree (SUBJECT → TOPIC → SUBTOPIC)
- `resources.json` — resources per subtopic
- `description.json` — descriptions per node
- `faq.json` — FAQ entries for the landing page

To add a new resource, append to `resources.json` following the existing shape:

```json
{
  "id": <next_id>,
  "parent_id": <subtopic_node_id>,
  "title": "Resource title",
  "type": "VIDEO",
  "link": "https://...",
  "order_index": <next_order>
}
```

---

## Adding a New Page

1. Create `src/app/{route}/page.tsx` as a Server Component.
2. Export `generateMetadata` with unique `title` and `description`.
3. Create `src/app/{route}/opengraph-image.tsx` for OG image.
4. Add the URL to `src/app/sitemap.ts`.
5. Update [00-index.md](./00-index.md).
