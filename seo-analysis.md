# SEO Analysis — StudyNaksha (studynaksha.com)

> **Audit Date:** June 30, 2026 · **Last Updated:** July 1, 2026  
> **Site:** https://studynaksha.com  
> **Framework:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4  
> **Current Status:** Only 1 page indexed (homepage) despite sitemap submitted to GSC  

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [Critical Bugs — Fix These First](#2-critical-bugs--fix-these-first)
3. [Page-by-Page Metadata Audit](#3-page-by-page-metadata-audit)
4. [Rendering Mode Analysis](#4-rendering-mode-analysis)
5. [Sitemap & Robots Audit](#5-sitemap--robots-audit)
6. [Structured Data / Schema Markup](#6-structured-data--schema-markup)
7. [Content SEO Gaps](#7-content-seo-gaps)
8. [Technical SEO Checklist](#8-technical-seo-checklist)
9. [What Is Already Good](#9-what-is-already-good)
10. [Prioritized Fix Plan](#10-prioritized-fix-plan)

---

## 1. Current State Summary

| Factor | Status | Notes |
|---|---|---|
| Domain age | ~1–6 months | New domain, trust building in progress |
| HTTPS | ✅ Active | Custom domain secured |
| Pages indexed | ❌ 1/73+ | Only homepage in Google's index |
| Sitemap submitted | ✅ Yes | GSC shows it, but pages not getting crawled |
| robots.txt | ✅ Correct | All crawlers allowed |
| noindex anywhere | ✅ None found | No deliberate blocking |
| Canonical tags | ✅ Fixed | Added to all 8 missing pages (July 1) |
| generateStaticParams | ❌ Missing | All dynamic routes are SSR-only |
| SITE_URL env var | ✅ Production OK | Vercel env var confirmed correct; local `.env.local` has whitespace (dev-only, no prod impact) |
| Mock test pages | ✅ Fixed | `/pyq/[paperSlug]/mock` now has `noindex` (July 1) |
| Structured data | ⚠️ Partial | Present on some pages, missing on most |
| Core Web Vitals | Unknown | Not measured in this audit |
| Backlinks | ⚠️ 1–5 | Very low — authority building needed |

**Root Cause of Indexing Failure:** Missing canonical tags on major pages + all dynamic routes running as SSR with no pre-rendering. Google finds pages slowly (or not at all) because nothing is statically built. The SITE_URL env var is correct on production.

---

## 2. Critical Bugs — Fix These First

### BUG #1 — SITE_URL Has Leading Whitespace (LOCAL ONLY — RESOLVED)

**File:** [.env.local](.env.local) — Line 9

**Status:** ✅ Not a production issue. Vercel production env var confirmed correct (`https://studynaksha.com` with no whitespace). The whitespace only exists in the local `.env.local` file and does not affect the live site.

```
# Local .env.local (low priority — dev only):
NEXT_PUBLIC_SITE_URL=  https://studynaksha.com  ← two leading spaces, affects localhost only

# Vercel production (confirmed correct):
NEXT_PUBLIC_SITE_URL=https://studynaksha.com  ✅
```

**Optional local fix:** Remove the leading spaces from `.env.local` line 9 so your local dev environment also generates correct canonical URLs during testing.

---

### BUG #2 — Missing Canonical Tags on 8 Major Pages ✅ FIXED (July 1)

Canonical tags tell Google which URL is the "true" version of a page. Without them, Google can't determine the authoritative URL and may skip indexing.

**All pages now have `alternates.canonical` — fixed July 1:**

| Page | File | Fix Applied |
|---|---|---|
| Practice hub | [src/app/cat-prep/practice/page.tsx](src/app/cat-prep/practice/page.tsx) | ✅ Added canonical |
| PYQ hub | [src/app/cat-prep/pyq/page.tsx](src/app/cat-prep/pyq/page.tsx) | ✅ Added canonical |
| PYQ mock test | [src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx](src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx) | ✅ Added `noindex` (exam session — should not be indexed) |
| VARC Reading Comprehensions | [src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx](src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx) | ✅ Added canonical |
| DILR Practice Sets | [src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx](src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx) | ✅ Added canonical |
| Quant Practice Chapters | [src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx](src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx) | ✅ Added canonical |
| Daily Essay | [src/app/cat-prep/daily-dose/essay/page.tsx](src/app/cat-prep/daily-dose/essay/page.tsx) | ✅ Added canonical |
| Daily Challenge | [src/app/cat-prep/daily-dose/challenge/page.tsx](src/app/cat-prep/daily-dose/challenge/page.tsx) | ✅ Added canonical + fixed title (was missing `\| StudyNaksha`) |

**Pages that already had canonicals correctly (unchanged):**
- [src/app/cat-prep/[topic]/page.tsx](src/app/cat-prep/[topic]/page.tsx) ✅
- [src/app/cat-prep/[topic]/[subtopic]/page.tsx](src/app/cat-prep/[topic]/[subtopic]/page.tsx) ✅

---

### BUG #3 — No `generateStaticParams` on Any Dynamic Route (HIGH)

**What this means:** Every dynamic page (`[topic]`, `[chapter]`, `[paperSlug]`, etc.) is currently **Server-Side Rendered (SSR)** on demand. Pages only exist when someone visits them. Googlebot crawls fast — if a page takes too long to respond or hasn't been "warmed up," Google skips it.

**Files missing `generateStaticParams`:**

| Route | File |
|---|---|
| `/cat-prep/[topic]` | [src/app/cat-prep/[topic]/page.tsx](src/app/cat-prep/[topic]/page.tsx) |
| `/cat-prep/[topic]/[subtopic]` | [src/app/cat-prep/[topic]/[subtopic]/page.tsx](src/app/cat-prep/[topic]/[subtopic]/page.tsx) |
| `/cat-prep/practice/quant/[topic]/[chapter]` | [src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx](src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx) |
| `/cat-prep/practice/varc/reading-comprehensions/[rcNumber]` | [src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx](src/app/cat-prep/practice/varc/reading-comprehensions/[rcNumber]/page.tsx) |
| `/cat-prep/practice/dilr/[chapter]/[setNumber]` | [src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx](src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx) |
| `/cat-prep/pyq/[paperSlug]` | [src/app/cat-prep/pyq/[paperSlug]/page.tsx](src/app/cat-prep/pyq/[paperSlug]/page.tsx) |
| `/cat-prep/pyq/[paperSlug]/mock` | [src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx](src/app/cat-prep/pyq/[paperSlug]/mock/page.tsx) |

**Example fix for a topic page:**
```typescript
// src/app/cat-prep/[topic]/page.tsx

export async function generateStaticParams() {
  // Return all known topic slugs so Next.js pre-renders them at build time
  return [
    { topic: "quantitative-aptitude" },
    { topic: "verbal-ability" },
    { topic: "data-interpretation" },
    { topic: "logical-reasoning" },
    // ... all topics
  ];
}
```

For pages that pull data from MongoDB (like quant chapters), fetch the list at build time:
```typescript
export async function generateStaticParams() {
  const chapters = await getChaptersFromDB(); // your existing data fetching function
  return chapters.map(c => ({ topic: c.topicSlug, chapter: c.chapterSlug }));
}
```

> **Note:** For PYQ mock test pages (`/pyq/[paperSlug]/mock`), do NOT pre-generate — these are exam sessions and should stay SSR. Just ensure the landing page (`/pyq/[paperSlug]`) is pre-generated.

---

### BUG #4 — `force-dynamic` on Core Content Pages (MEDIUM)

These pages are set to re-render on every request, making them slow for crawlers:

| File | Line | Why It's a Problem |
|---|---|---|
| [src/app/cat-prep/daily-dose/essay/page.tsx](src/app/cat-prep/daily-dose/essay/page.tsx) | Line 6 | Hub page doesn't need to be force-dynamic |
| [src/app/cat-prep/daily-dose/challenge/page.tsx](src/app/cat-prep/daily-dose/challenge/page.tsx) | Line 5 | Same — the hub listing page |
| [src/app/cat-prep/daily-dose/essay/[date]/page.tsx](src/app/cat-prep/daily-dose/essay/[date]/page.tsx) | Line 7 | Past essays are static — no reason to re-render |
| [src/app/cat-prep/daily-dose/essay/archive/page.tsx](src/app/cat-prep/daily-dose/essay/archive/page.tsx) | — | Archive is static content |

**Fix:** 
- For the hub/listing pages: remove `force-dynamic`, use `revalidate` instead:
  ```typescript
  export const revalidate = 3600; // revalidate every hour
  ```
- For individual past essay `[date]` pages: use `generateStaticParams` + no dynamic flag (they're archived content)

---

## 3. Page-by-Page Metadata Audit

### ✅ Pages with Good Metadata

| Page | Title | Description | Canonical | OG Tags |
|---|---|---|---|---|
| Homepage `/` | ✅ | ✅ | ✅ (via metadataBase) | ✅ |
| `/cat-prep/[topic]` | ✅ dynamic | ✅ dynamic | ✅ | ✅ |
| `/cat-prep/[topic]/[subtopic]` | ✅ dynamic | ✅ dynamic | ✅ | ✅ |
| `/cat-prep/how-to-prepare` | ✅ | ✅ | ✅ (via metadataBase) | ✅ |

### ❌ Pages with Missing or Incomplete Metadata

| Page | Title | Description | Canonical | OG Tags | Issue |
|---|---|---|---|---|---|
| `/cat-prep/practice` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/pyq` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/pyq/[paperSlug]` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/pyq/[paperSlug]/mock` | ✅ | ⚠️ generic | ❌ | ❌ | Should probably be noindex (it's a test session) |
| `/cat-prep/practice/quant/[topic]/[chapter]` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/practice/dilr/[chapter]/[setNumber]` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/practice/varc/reading-comprehensions/[rcNumber]` | ✅ | ✅ | ❌ | ⚠️ partial | Missing canonical |
| `/cat-prep/daily-dose/essay` | ✅ | ✅ | ❌ | ❌ | Missing canonical + OG |
| `/cat-prep/daily-dose/challenge` | ✅ | ✅ | ❌ | ❌ | Missing canonical + OG |
| `/cat-prep/daily-dose/essay/[date]` | ✅ | ✅ | ❌ | ❌ | Should have canonical per date |

### Pages That Should Be noindex

These are session/state pages that should NOT be indexed:

| Page | Reason |
|---|---|
| `/cat-prep/pyq/[paperSlug]/mock` | Active exam session — no useful content for Google |
| Any `/result` or `/score` pages | User-specific data, not indexable |
| Any `/attempt/[id]` pages | User-specific quiz attempt |

**Add to these pages:**
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

---

## 4. Rendering Mode Analysis

| Route Pattern | Current Mode | SEO Impact | Recommended |
|---|---|---|---|
| `/` | Static | ✅ Good | Keep |
| `/cat-prep` | Static | ✅ Good | Keep |
| `/cat-prep/how-to-prepare` | Static | ✅ Good | Keep |
| `/cat-prep/[topic]` | SSR (no generateStaticParams) | ⚠️ Slow for crawlers | Add generateStaticParams → SSG |
| `/cat-prep/[topic]/[subtopic]` | SSR | ⚠️ Slow | Add generateStaticParams → SSG |
| `/cat-prep/practice/quant/[topic]/[chapter]` | SSR | ⚠️ Slow | Add generateStaticParams → SSG |
| `/cat-prep/practice/dilr/[chapter]/[setNumber]` | SSR | ⚠️ Slow | Add generateStaticParams → SSG |
| `/cat-prep/practice/varc/reading-comprehensions/[rcNumber]` | SSR | ⚠️ Slow | Add generateStaticParams → SSG |
| `/cat-prep/pyq/[paperSlug]` | SSR | ⚠️ Slow | Add generateStaticParams → SSG |
| `/cat-prep/pyq/[paperSlug]/mock` | SSR | ✅ Correct (exam session) | Add noindex |
| `/cat-prep/daily-dose/essay` | force-dynamic | ❌ Very slow | Switch to revalidate |
| `/cat-prep/daily-dose/essay/[date]` | force-dynamic | ❌ Bad for archive | SSG + generateStaticParams |
| `/cat-prep/daily-dose/challenge` | force-dynamic | ❌ Very slow | Switch to revalidate |

---

## 5. Sitemap & Robots Audit

### Sitemap ([src/app/sitemap.ts](src/app/sitemap.ts))

**What's in it (good):**
- ✅ Homepage
- ✅ Topic pages (`/cat-prep/[topic]`)
- ✅ Subtopic pages (`/cat-prep/[topic]/[subtopic]`)
- ✅ Practice chapter pages (quant)
- ✅ DILR sets
- ✅ PYQ paper pages
- ✅ Daily dose / how-to-prepare
- ✅ `lastModified`, `changeFrequency`, `priority` set on all entries
- ✅ Total ~73 URLs

**What's missing from sitemap:**
- ❌ VARC reading comprehension pages (`/cat-prep/practice/varc/reading-comprehensions/[rcNumber]`)
- ❌ Daily essay archive (`/cat-prep/daily-dose/essay/archive`)
- ❌ Individual past essay pages (`/cat-prep/daily-dose/essay/[date]`)

**What should NOT be in sitemap (currently included or should be excluded):**
- `/cat-prep/pyq/[paperSlug]/mock` — this is an exam session page, exclude it

**Critical issue:** Because `SITE_URL` has leading whitespace, every URL in the sitemap is currently broken (e.g., `  https://studynaksha.com/cat-prep/...`). Fix Bug #1 first, then re-submit the sitemap.

### robots.ts ([src/app/robots.ts](src/app/robots.ts))

**Current state:**
```typescript
// Allow all, reference sitemap
userAgent: "*", allow: "/"
sitemap: `${ENV.SITE_URL}/sitemap.xml`
```

**Issues:**
- ⚠️ Sitemap URL is also broken due to the SITE_URL whitespace bug
- ❌ Should block crawlers from exam session pages:

```typescript
// Add these disallow rules:
{
  userAgent: "*",
  allow: "/",
  disallow: [
    "/cat-prep/pyq/*/mock",  // exam sessions
    "/api/",                  // API routes
  ],
}
```

---

## 6. Structured Data / Schema Markup

### Currently Present ✅

| Page | Schema Type | File |
|---|---|---|
| `/cat-prep/[topic]/[subtopic]` | `BreadcrumbList` | [src/app/cat-prep/[topic]/[subtopic]/page.tsx](src/app/cat-prep/[topic]/[subtopic]/page.tsx) L52-63 |
| `/cat-prep/[topic]/[subtopic]` | `LearningResource` | Same file |
| `/cat-prep` (roadmap) | `FAQPage` | [src/app/cat-prep/page.tsx](src/app/cat-prep/page.tsx) |

### Missing Schema (High Value for CAT Prep Site) ❌

| Page Type | Recommended Schema | Why |
|---|---|---|
| Practice question pages | `Quiz`, `Question`, `Answer` | Google can show "Practice Quiz" rich results |
| PYQ paper pages | `Course`, `LearningResource` | Shows as educational content in search |
| How-to-prepare guide | `HowTo`, `FAQPage` | Rich results for step-by-step guides |
| Daily essay pages | `Article` | Article rich results with date |
| Homepage | `WebSite` + `Sitelinks Searchbox` | Enables Google sitelinks search |
| Individual topic pages | `BreadcrumbList` | Missing on `/cat-prep/[topic]` — only on `[topic]/[subtopic]` |

**Example: Add WebSite schema to root layout:**
```typescript
// src/app/layout.tsx — add to <head>:
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StudyNaksha",
  "url": "https://studynaksha.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://studynaksha.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Example: Quiz schema for practice pages:**
```typescript
const quizSchema = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": `${chapter.name} Practice — ${topic.name}`,
  "educationalLevel": "graduate",
  "about": { "@type": "Thing", "name": "CAT Exam" },
  "provider": { "@type": "Organization", "name": "StudyNaksha" }
}
```

---

## 7. Content SEO Gaps

### Target Keywords You're Missing Content For

Based on what CAT aspirants actually search, these are high-value content gaps:

| Search Intent | Example Query | Current Coverage | Gap |
|---|---|---|---|
| Past papers | "CAT 2023 question paper PDF" | PYQ pages exist | No year-specific landing pages with answers |
| Topic explanations | "CAT quant percentages questions" | Practice pages | Pages may not have enough text content for Google |
| Score calculators | "CAT percentile calculator 2024" | Not found | Completely missing — high search volume |
| Preparation timeline | "CAT preparation 6 months plan" | How-to-prepare | Good — keep building |
| Section-specific | "CAT DILR tricks and shortcuts" | Subtopic pages | Need more text/explanation content |
| Mock tests | "free CAT mock test 2024" | PYQ mock | Landing page needs better copy |
| Cut-offs | "CAT 2023 cutoff IIM" | Not found | Missing entirely |
| Books/resources | "best books for CAT preparation" | Not found | Missing resource pages |

### Content Depth Problem

Google rewards pages with substantial, helpful content. Your practice pages likely show a list of questions but may have thin text content (no intro, no explanations, no context). 

**What to add to each practice page:**
- 150–300 word intro explaining the topic/chapter
- Key formulas or concepts listed
- Difficulty breakdown (how many easy/medium/hard)
- Tips specific to that chapter
- Link to related topics (internal linking)

### Internal Linking Gaps

- No link from homepage to individual practice chapter pages
- No "related topics" sections on practice pages
- Daily essays not linked from the main `/cat-prep` roadmap page
- No sitemap page (HTML sitemap) for users/crawlers

---

## 8. Technical SEO Checklist

| Item | Status | Notes |
|---|---|---|
| HTTPS | ✅ | Active |
| Mobile-friendly | ✅ | Tailwind CSS responsive |
| Core Web Vitals | ❓ | Not audited — check in GSC |
| Page speed | ⚠️ | SSR pages will be slower; fix generateStaticParams |
| Broken links | ❓ | Not checked — audit with Screaming Frog |
| Image alt tags | ❓ | Not audited in code |
| URL structure | ✅ | Clean, descriptive slugs |
| 301 redirects | ✅ | Old URLs properly redirected |
| Duplicate content | ⚠️ | No canonicals = duplicate risk |
| XML sitemap | ⚠️ | Exists but broken URLs (whitespace bug) |
| HTML sitemap | ❌ | Missing entirely |
| Pagination | ❓ | Not checked for archive pages |
| Hreflang | N/A | English-only site |
| 404 page | ❓ | Need to verify custom 404 exists |
| Favicon | ✅ | Configured in layout |
| Open Graph image | ⚠️ | Default OG image? Not confirmed |
| Twitter Card | ✅ | Configured in root layout |
| Google Analytics | ✅ | GA4 configured |
| Search Console | ✅ | Verified + sitemap submitted |
| Bing Webmaster | ❓ | Not mentioned |

---

## 9. What Is Already Good

- ✅ **No `noindex` tags anywhere** — you're not accidentally blocking Google
- ✅ **`robots.ts` allows all crawlers** — Googlebot can reach the site
- ✅ **301 redirects for old URLs** — legacy daily-essay → daily-dose URLs properly redirected
- ✅ **MathJax for equation rendering** — math content renders properly (important for CAT quant)
- ✅ **GA4 configured** — tracking is in place
- ✅ **Sitemap structure is correct** — just broken by whitespace bug
- ✅ **`metadataBase` set in root layout** — relative URLs will resolve correctly once SITE_URL is fixed
- ✅ **Title template set** (`%s | StudyNaksha`) — consistent branding in titles
- ✅ **Topic + subtopic pages have canonical + schema** — these are the most important pages and they're done right
- ✅ **FAQPage schema on `/cat-prep`** — good for rich results
- ✅ **Clean URL structure** — descriptive slugs, no query strings on content pages
- ✅ **TypeScript + React 19** — modern stack, fast rendering potential

---

## 10. Prioritized Fix Plan

### Phase 1 — Emergency Fixes ✅ MOSTLY DONE

| Task | Status |
|---|---|
| Fix `SITE_URL` on Vercel | ✅ Was already correct — no action needed |
| Fix `.env.local` locally | ⏭️ Skipped — local only, no prod impact |
| Redeploy | ✅ Not needed — prod was never broken |
| **Re-submit sitemap in GSC** | ⏳ Pending — manual action required |
| **Request indexing for 5 key pages** | ⏳ Pending — manual action required |

### Phase 2 — High Impact ✅ DONE (July 1)

| Task | Status |
|---|---|
| Add `alternates.canonical` to all 8 missing pages | ✅ Done |
| Add `noindex` to `/pyq/[paperSlug]/mock` | ✅ Done |
| Add `disallow` rules to robots.ts | ✅ Done (July 1) |
| Add VARC RC pages to sitemap | ✅ Done (July 1) |

### Phase 3 — Structural ✅ DONE (July 1)

| Task | Status |
|---|---|
| `generateStaticParams` — topic + subtopic pages | ✅ Done |
| `generateStaticParams` — quant chapter pages | ✅ Done |
| `generateStaticParams` — DILR set pages (set 1 per chapter) | ✅ Done |
| `generateStaticParams` — all 38 PYQ paper pages | ✅ Done |
| `alternates.canonical` — PYQ paper pages | ✅ Done (also fixed in this phase) |
| Replace `force-dynamic` → `revalidate = 3600` on daily essay + challenge hubs | ✅ Done |
| Replace `force-dynamic` → `revalidate = 86400` on past essay `[date]` pages | ✅ Done |

### Phase 4 — Content & Authority (Ongoing)

- [ ] Add 150–300 word intro content to each practice chapter page
- [ ] Add `Quiz` + `LearningResource` schema to practice pages
- [ ] Add `Article` schema to daily essay pages
- [ ] Add `WebSite` + Sitelinks Searchbox schema to root layout
- [ ] Add BreadcrumbList to `/cat-prep/[topic]` pages (currently only on subtopic)
- [ ] Add HTML sitemap page at `/sitemap` for users
- [ ] Build backlinks: post on r/CATPrep, Quora CAT sections, CAT prep Facebook groups
- [ ] Set up Bing Webmaster Tools (separate from Google, worth doing)
- [ ] Add FAQ sections to how-to-prepare and topic hub pages

### Phase 5 — Monitoring (Ongoing)

- [ ] Check GSC weekly for crawl errors, coverage issues
- [ ] Set up GSC email alerts for coverage drops
- [ ] Measure Core Web Vitals in GSC → Core Web Vitals report
- [ ] Use Screaming Frog (free up to 500 URLs) to audit for broken links

---

## Quick Reference: Expected Timeline After Fixes

| Action | Expected Google Response |
|---|---|
| Fix SITE_URL + redeploy + resubmit sitemap | Google re-crawls sitemap within 1–3 days |
| Homepage + main pages indexed | Should appear within 1–2 weeks |
| Practice chapter pages indexed | 2–4 weeks after SSG fix |
| Rich results (schema) showing | 4–8 weeks after schema addition |
| Ranking for target keywords | 3–6 months (domain authority builds over time) |

---

*Generated by SEO audit — studynaksha.com — June 30, 2026*
