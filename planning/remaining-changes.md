# Remaining Changes — Post-Refactor

Items not completed in the `text` refactor branch, grouped by when to tackle them.

---

## Next Sprint (Code Quality)

All items from this sprint are complete. See [L3-L4-L5-L6-M10-implementation.md](./L3-L4-L5-L6-M10-implementation.md) for details.

---

## SEO Phase (Separate Initiative)

| ID | Change | Notes |
|----|--------|-------|
| L1 | Per-page metadata (`generateMetadata`) | Each `page.tsx` needs unique `title` + `description` |
| L2 | `robots.txt` and `sitemap.xml` | Add via Next.js app router conventions |
| L9 | Open Graph image for social sharing | Design + `opengraph-image.png` per route |

---

## Content (Ongoing)

| ID | Change | Notes |
|----|--------|-------|
| M10 | Expand FAQ content | Add platform-specific questions (mock tests, books, schedule) |

---

## Deferred (Needs Bigger Decision)

| ID | Change | Blocker |
|----|--------|---------|
| M7 | ARIA labels and keyboard navigation | Revisit when design is stable |
| M8 | Load tree data server-side (Server Component) | Requires backend/API split first |
| H4 | Input validation + error handling on feedback API | Low priority; feedback volume is low |
