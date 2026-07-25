# SEO Handoff — StudyNaksha
> To resume: read this file, then say "continue phase 4"

---

## Project Context

- **Site:** https://studynaksha.com
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, MongoDB, Firebase
- **Problem:** Only homepage indexed on Google despite sitemap submitted to GSC
- **Root causes fixed:** Missing canonical tags, no generateStaticParams (SSR-only), force-dynamic on content pages
- **Tracking files:** [seo-analysis.md](seo-analysis.md) (full audit) · [seo-todo.md](seo-todo.md) (action list)

---

## Phases Completed

### Phase 1 — Emergency ✅
- Vercel `NEXT_PUBLIC_SITE_URL` was already correct (no whitespace on prod)
- User still needs to manually: re-submit sitemap in GSC + request indexing for 5 pages (see seo-todo.md)

### Phase 2 — Canonical Tags + Robots ✅ (July 1)
Files edited:
- `src/app/cat-prep/practice/page.tsx` — added ENV import + `alternates.canonical`
- `src/app/cat-prep/pyq/page.tsx` — added ENV import + `alternates.canonical`
- `src/app/cat-prep/daily-dose/essay/page.tsx` — added ENV import + `alternates.canonical`
- `src/app/cat-prep/daily-dose/challenge/page.tsx` — added ENV import + `alternates.canonical` + fixed title (was missing `| StudyNaksha`)
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx` — added `alternates.canonical` in generateMetadata
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` — added `alternates.canonical` in generateMetadata
- `src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx` — added `alternates.canonical` in generateMetadata
- `src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx` — added `robots: { index: false, follow: false }` (exam session, should not be indexed)
- `src/app/robots.ts` — added `disallow: ["/api/", "/cat-prep/pyq/*/mock"]`
- `src/app/sitemap.ts` — made async, added VARC RC pages (fetches count from MongoDB), added missing hub pages (`/cat-prep/practice`, `/cat-prep/pyq`, `/cat-prep/how-to-prepare`)

### Phase 3 — generateStaticParams + revalidate ✅ (July 1)
Files edited:
- `src/app/cat-prep/[topic]/page.tsx` — added `generateStaticParams` (all TOPIC nodes from data.json)
- `src/app/cat-prep/[topic]/[subtopic]/page.tsx` — added `generateStaticParams` (all SUBTOPIC nodes + parent topic)
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx` — added `generateStaticParams` from `PRACTICE_SUBJECTS` Quant section
- `src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx` — added `generateStaticParams` (set 1 per DILR chapter)
- `src/app/cat-prep/pyq/[paperSlug]/page.tsx` — added `generateStaticParams` from `PYQ_PAPERS` (38 papers) + added `alternates.canonical` + imported `PYQ_PAPERS` and `ENV`
- `src/app/cat-prep/daily-dose/essay/page.tsx` — replaced `force-dynamic` with `revalidate = 3600`
- `src/app/cat-prep/daily-dose/challenge/page.tsx` — replaced `force-dynamic` with `revalidate = 3600`
- `src/app/cat-prep/daily-dose/essay/[date]/page.tsx` — replaced `force-dynamic` with `revalidate = 86400`

---

## Phase 4 — Schema Markup ✅ (July 1)

Files edited:
- `src/app/layout.tsx` — added `WebSite` JSON-LD schema (enables Google Sitelinks)
- `src/app/cat-prep/daily-dose/essay/[date]/page.tsx` — added `Article` JSON-LD schema + improved `generateMetadata` to use `essay.title`/`essay.excerpt` + canonical
- `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx` — added `Quiz` JSON-LD schema to existing BreadcrumbList+LearningResource array
- `src/app/cat-prep/how-to-prepare/page.tsx` — added `FAQPage` JSON-LD schema (5 real FAQs from page content) + canonical
- `src/app/sitemap-page/page.tsx` — **NEW FILE** — HTML sitemap listing all hub pages, 38 PYQ papers, and practice chapters
- `src/app/sitemap.ts` — added 38 PYQ paper entries (were missing!) + `/sitemap-page` entry

Also confirmed: 4b (BreadcrumbList on topic pages) was **already done** — verified at `[topic]/page.tsx` lines 53–63.

## Phase 4 Completed — What Was Done

### 4a. WebSite schema in root layout
**File:** `src/app/layout.tsx`
**What:** Add JSON-LD `WebSite` schema to `<head>`. Enables Google Sitelinks search box.
**How:** Import `JsonLd` component (already used elsewhere, e.g. `src/app/components/JsonLd.tsx`). Add:
```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StudyNaksha",
  "url": "https://studynaksha.com",
  "description": "Free structured learning paths and practice for CAT exam preparation",
}
```

### 4b. BreadcrumbList schema on topic pages
**File:** `src/app/cat-prep/[topic]/page.tsx`
**What:** Already has BreadcrumbList in jsonLd — CHECK if it's already there (it was in the file I read). If yes, mark done. If missing, add it matching the subtopic page pattern.
**Current state from code read:** The topic page already has BreadcrumbList in jsonLd (lines 47-56). This may already be done — verify before editing.

### 4c. Article schema on daily essay [date] pages
**File:** `src/app/cat-prep/daily-dose/essay/[date]/page.tsx`
**What:** Add `Article` JSON-LD schema. The essay `date` param and essay content are available in `PastEssayPage`.
**How:**
```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": essay.title, // check actual field name on essay object
  "datePublished": date,
  "publisher": { "@type": "Organization", "name": "StudyNaksha", "url": "https://studynaksha.com" },
  "inLanguage": "en-IN",
}
```
First read the file to confirm the essay object shape (field names).

### 4d. Quiz schema on practice pages (Quant chapters)
**File:** `src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx`
**What:** Add `Quiz` + update existing `LearningResource` schema. Already has BreadcrumbList + LearningResource (lines 45-61). Add Quiz schema alongside.
```typescript
{
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": `${chapter.name} Practice — ${topic.name}`,
  "educationalLevel": "graduate",
  "about": { "@type": "Thing", "name": "CAT Exam" },
  "provider": { "@type": "Organization", "name": "StudyNaksha" },
  "numberOfQuestions": questions.length,
}
```

### 4e. HTML sitemap page
**File:** Create `src/app/sitemap-page/page.tsx` (renders at `/sitemap-page`) OR `src/app/sitemap/page.tsx`
**What:** A user-facing HTML page listing all major sections and pages. Helps both users and crawlers.
**Note:** Check if `/sitemap` conflicts with the Next.js `sitemap.ts` route. Use `/site-map` or `/all-pages` if needed.

### 4f. FAQ schema on how-to-prepare page
**File:** `src/app/cat-prep/how-to-prepare/page.tsx`
**What:** Add FAQPage schema if the page has Q&A content. Read the file first to check if FAQs exist in the content.

---

## Key Files Reference

| Purpose | Path |
|---|---|
| Root layout (metadata, JSON-LD) | `src/app/layout.tsx` |
| JsonLd component | `src/app/components/JsonLd.tsx` |
| ENV config | `src/config/env.ts` |
| PYQ papers list | `src/constants/pyqPapers.ts` |
| Practice chapters | `src/constants/practiceChapters.ts` |
| Node metadata helpers | `src/app/cat-prep/lib/nodeMetadata.ts` |
| CAT prep data | `src/app/cat-prep/data.json` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |

## Patterns Already In Codebase (Reuse These)

**JsonLd component usage:**
```tsx
import { JsonLd } from "@/app/components/JsonLd";
// In JSX:
<JsonLd data={jsonLd} />
// or
<JsonLd data={[schema1, schema2]} />
```

**ENV import:**
```typescript
import { ENV } from "@/config/env";
// Use: ENV.SITE_URL
```

**buildLearningResourceSchema helper** (in `src/app/cat-prep/lib/nodeMetadata.ts`):
```typescript
import { buildLearningResourceSchema } from "@/app/cat-prep/lib/nodeMetadata";
buildLearningResourceSchema(name, description, url)
```

---

## Phase 5 — Monitoring (User Does Manually, No Code)
- Weekly GSC checks (Coverage, Performance, Core Web Vitals)
- Bing Webmaster Tools setup
- Backlinks: Reddit r/CATPrep, Quora CAT sections, Telegram CAT groups

---

## Progress Tracker (as of July 1, 2026)

| Phase | Task | Status |
|---|---|---|
| 1 | Vercel SITE_URL correct | ✅ |
| 1 | Re-submit sitemap in GSC | ⏳ User manual |
| 1 | Request indexing for 5 pages | ⏳ User manual |
| 2 | Canonical tags on 8 pages | ✅ |
| 2 | noindex on mock test pages | ✅ |
| 2 | disallow rules in robots.ts | ✅ |
| 2 | VARC RC + hub pages in sitemap | ✅ |
| 3 | generateStaticParams — topic/subtopic | ✅ |
| 3 | generateStaticParams — quant/DILR | ✅ |
| 3 | generateStaticParams — PYQ (38 papers) | ✅ |
| 3 | force-dynamic → revalidate (3 files) | ✅ |
| 4a | WebSite schema in root layout | ✅ |
| 4b | BreadcrumbList on topic pages | ✅ Already existed |
| 4c | Article schema on essay [date] pages | ✅ |
| 4d | Quiz schema on quant practice pages | ✅ |
| 4e | HTML sitemap page | ✅ /sitemap-page |
| 4f | FAQ schema on how-to-prepare | ✅ |
| 5 | Bing Webmaster Tools | ⏳ User manual |
| 5 | Weekly GSC monitoring | ⏳ Ongoing |
