# SEO Phase — L1, L2, L9

## Goal

Add per-page metadata, crawl configuration, and Open Graph images so StudyNaksha pages are correctly indexed and render rich previews when shared on social media.

## Files Affected

- `src/app/layout.tsx` — root metadata with OG defaults and title template
- `src/app/cat-prep/page.tsx` — static metadata for the base `/cat-prep` route
- `src/app/cat-prep/[topic]/page.tsx` — topic-level route with canonical metadata
- `src/app/cat-prep/[topic]/[subtopic]/page.tsx` — subtopic-level route with canonical metadata
- `src/app/cat-prep/lib/nodeMetadata.ts` — `toSlug`, slug lookups, and SEO title/description builders
- `src/app/cat-prep/components/RoadmapContent.tsx` — syncs slug-based URL via `history.replaceState`
- `src/app/cat-prep/lib/useTopicExpandState.ts` — accepts `forcedOpenId` for URL-driven initial expand
- `src/app/robots.ts` — Next.js robots.txt generation
- `src/app/sitemap.ts` — sitemap (core routes + topic/subtopic slug paths + practice chapters)
- `src/app/opengraph-image.tsx` — root OG image via ImageResponse
- `src/app/cat-prep/opengraph-image.tsx` — roadmap route OG image
- `src/app/cat-prep/daily-challenge/opengraph-image.tsx` — daily challenge OG image
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx` — practice metadata
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` — practice metadata
- `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx` — practice metadata

## Acceptance Criteria

### L1 — Per-page metadata
- [x] Root layout exports `metadata` with title template `"%s | StudyNaksha"`
- [x] `/cat-prep` has static metadata (title, description, OG, Twitter)
- [x] `/cat-prep/{topic}` — unique title, description, OG, Twitter, canonical per topic slug
- [x] `/cat-prep/{topic}/{subtopic}` — unique title, description, OG, Twitter, canonical per subtopic slug
- [x] `/cat-prep/daily-challenge` has static metadata (title, description, OG, Twitter)
- [x] `/cat-prep/practice/quant/[topic]/[chapter]` — title, description, OG, Twitter
- [x] `/cat-prep/practice/dilr/[chapter]/[setNumber]` — title, description, OG, Twitter
- [x] `/cat-prep/practice/varc/reading-comprehensions/[rcNumber]` — title, description, OG, Twitter

### L2 — robots.txt + sitemap.xml
- [x] `GET /robots.txt` returns valid robots directives allowing all crawlers
- [x] `GET /sitemap.xml` includes core routes (`/`, `/cat-prep`, `/cat-prep/daily-challenge`)
- [x] Sitemap includes all 11 TOPIC slug paths (`/cat-prep/{topic}`)
- [x] Sitemap includes all 53 SUBTOPIC slug paths (`/cat-prep/{topic}/{subtopic}`)
- [x] Sitemap includes all Quant practice chapter pages (20 URLs)
- [x] Sitemap includes DILR chapter entry points — set 1 per chapter (2 URLs)

### L9 — Open Graph image
- [x] `GET /opengraph-image` returns a branded PNG image (1200×630)
- [x] `GET /cat-prep/opengraph-image` returns a route-specific branded image
- [x] `GET /cat-prep/daily-challenge/opengraph-image` returns a daily-challenge branded image

## Known Gaps (not yet implemented)

### High priority
- [ ] **VARC RC pages missing from sitemap** — RC count is only known at runtime (DB). Fix: export `generateSitemaps` from the RC route with a DB call, or hardcode the count if it's stable.
- [ ] **DILR sets 2+ not in sitemap** — only set 1 per chapter is listed. Set counts are DB-driven, same problem as VARC RC.

### Medium priority
- [ ] **Practice OG images** — practice routes (`/quant`, `/dilr`, `/varc/reading-comprehensions`) inherit the root OG image. Add `opengraph-image.tsx` per practice route folder for branded social previews.
- [x] **JSON-LD structured data** — `FAQPage` on `/cat-prep`, `BreadcrumbList` + `LearningResource` on all topic/subtopic/practice pages. Shared `JsonLd` component at `src/app/components/JsonLd.tsx`.

### Low priority
- [ ] **`twitter:site` handle** — root layout doesn't set a Twitter/X handle; cards show as generic.

## Test Plan

1. Run `npm run build && npm run start`, inspect `<head>` on each page for correct meta tags.
2. Visit `/robots.txt` — should return valid text.
3. Visit `/sitemap.xml` — should return valid XML with all `<url>` entries including slug paths.
4. Visit `/opengraph-image` and `/cat-prep/opengraph-image` — should return PNG images.
5. Paste any page URL into the Twitter Card Validator or LinkedIn post inspector to verify OG preview.
6. Visit `/cat-prep/algebra` — check `<title>` is "Algebra for CAT | StudyNaksha" and accordion is expanded.
7. Visit `/cat-prep/algebra/linear-equations` — check title, description, and detail panel is open.
8. Navigate between topics/subtopics — confirm URL updates in browser bar without page reload.
9. Visit a practice page (e.g. `/cat-prep/practice/quant/arithmetics/percentages`) — check `<title>` and meta description.

## Out of Scope

- Paid SEO tools or analytics setup.
