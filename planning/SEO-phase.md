# SEO Phase — L1, L2, L9

## Goal

Add per-page metadata, crawl configuration, and Open Graph images so StudyNaksha pages are correctly indexed and render rich previews when shared on social media.

## Files Affected

- `src/app/layout.tsx` — update root metadata with OG defaults and title template 
- `src/app/cat-prep/page.tsx` — add `export const metadata`
- `src/app/robots.ts` — new: Next.js robots.txt generation
- `src/app/sitemap.ts` — new: Next.js sitemap.xml generation
- `src/app/opengraph-image.tsx` — new: root OG image via ImageResponse
- `src/app/cat-prep/opengraph-image.tsx` — new: roadmap route OG image

## Acceptance Criteria

### L1 — Per-page metadata
- [ ] Root layout exports `metadata` with title template `"%s | StudyNaksha"`
- [ ] `/cat-prep` page exports unique `title` and `description`
- [ ] `/cat-prep/daily-challenge` already has metadata (verified, no change needed)

### L2 — robots.txt + sitemap.xml
- [ ] `GET /robots.txt` returns valid robots directives allowing all crawlers
- [ ] `GET /sitemap.xml` returns a valid XML sitemap with all public URLs

### L9 — Open Graph image
- [ ] `GET /opengraph-image` returns a branded PNG image (1200×630)
- [ ] `GET /cat-prep/opengraph-image` returns a route-specific branded image

## Test Plan

1. Run `npm run build && npm run start`, inspect `<head>` on each page for correct meta tags.
2. Visit `/robots.txt` — should return valid text.
3. Visit `/sitemap.xml` — should return valid XML with `<url>` entries.
4. Visit `/opengraph-image` — should return a PNG image.
5. Paste any page URL into the Twitter Card Validator or LinkedIn post inspector to verify OG preview.

## Out of Scope

- Per-subtopic dynamic metadata (no route per subtopic).
- Paid SEO tools or analytics setup.
