# SEO To-Do — StudyNaksha

> Tasks you need to do to get pages indexed and ranking on Google.  
> Legend: 🔴 Blocker · 🟠 High · 🟡 Medium · 🟢 Nice to have · ✅ Done

---

## RIGHT NOW — Do These Today

### 🔴 Re-submit sitemap to Google Search Console
**Why:** The canonical tags we just fixed are now in the code, but Google doesn't know yet. Re-submitting tells Google to re-crawl.

**Steps:**
1. Open [Google Search Console](https://search.google.com/search-console) → select `studynaksha.com`
2. Left sidebar → **Sitemaps**
3. If there's an existing entry, click it → delete it
4. In the "Add a new sitemap" box, type: `sitemap.xml`
5. Click **Submit**

---

### 🔴 Request indexing for your 5 most important pages
**Why:** Google can take weeks to re-crawl on its own. Manual indexing requests jump the queue.

**Steps (repeat for each URL):**
1. In GSC → top search bar → paste the URL → press Enter
2. Click **"Request Indexing"**
3. Wait for the green checkmark

**URLs to request (in this order):**

| Priority | URL |
|---|---|
| 1 | `https://studynaksha.com/cat-prep` |
| 2 | `https://studynaksha.com/cat-prep/how-to-prepare` |
| 3 | `https://studynaksha.com/cat-prep/practice` |
| 4 | `https://studynaksha.com/cat-prep/pyq` |
| 5 | `https://studynaksha.com/cat-prep/daily-dose/essay` |

> GSC allows ~10 indexing requests per day. Spread them over 2 days if needed.

---

## THIS WEEK — Code Changes (Claude can do these)

### 🟠 Add `disallow` rules to robots.ts
**Why:** API routes and exam session pages should not be crawled — keeps Googlebot focused on real content pages.

**File:** [src/app/robots.ts](src/app/robots.ts)

Add these disallow rules:
```typescript
disallow: ["/api/", "/cat-prep/pyq/*/mock"]
```

---

### 🟠 Add VARC reading comprehension pages to sitemap
**Why:** These pages exist and have canonical tags now, but Google won't discover them if they're not in the sitemap.

**File:** [src/app/sitemap.ts](src/app/sitemap.ts)

Add entries for: `https://studynaksha.com/cat-prep/practice/varc/reading-comprehensions/1`, `/2`, `/3` ... etc. (fetch the count from MongoDB at build time, same pattern as other dynamic entries already in the sitemap)

---

### 🟠 Add `generateStaticParams` to topic + subtopic pages
**Why:** These are your most important pages and currently render on-demand (SSR). Google finds SSG pages faster and more reliably.

**Files:**
- [src/app/cat-prep/[topic]/page.tsx](src/app/cat-prep/[topic]/page.tsx)
- [src/app/cat-prep/[topic]/[subtopic]/page.tsx](src/app/cat-prep/[topic]/[subtopic]/page.tsx)

What to add (Claude can implement this):
```typescript
export async function generateStaticParams() {
  return [
    { topic: "quantitative-aptitude" },
    { topic: "verbal-ability" },
    // ... all your topic slugs
  ];
}
```

---

### 🟠 Add `generateStaticParams` to practice pages
**Why:** Practice chapter pages are high-value SEO targets. Pre-rendering makes them indexable faster.

**Files:**
- [src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx](src/app/cat-prep/practice/quant/[topic]/[chapter]/page.tsx)
- [src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx](src/app/cat-prep/practice/dilr/[chapter]/[setNumber]/page.tsx)

---

### 🟠 Add `generateStaticParams` to PYQ paper pages
**Why:** "CAT 2023 paper" is one of the highest-searched CAT queries. These pages need to be pre-rendered.

**File:** [src/app/cat-prep/pyq/[paperSlug]/page.tsx](src/app/cat-prep/pyq/[paperSlug]/page.tsx)

---

### 🟡 Replace `force-dynamic` with `revalidate` on daily content hubs
**Why:** The hub pages (not the individual daily content, but the listing/landing pages) don't need to re-render on every request. `force-dynamic` makes them slower for Googlebot.

**Files to change:**
- [src/app/cat-prep/daily-dose/essay/page.tsx](src/app/cat-prep/daily-dose/essay/page.tsx) — line 6
- [src/app/cat-prep/daily-dose/challenge/page.tsx](src/app/cat-prep/daily-dose/challenge/page.tsx) — line 5

Replace:
```typescript
export const dynamic = "force-dynamic";
```
With:
```typescript
export const revalidate = 3600; // rebuild every hour
```

---

### 🟡 Add `generateStaticParams` to daily essay archive pages
**Why:** Past essay pages (`/daily-dose/essay/2026-06-30`) are static content — no reason to re-render them on every visit. Pre-generating them makes them fast to crawl.

**File:** [src/app/cat-prep/daily-dose/essay/[date]/page.tsx](src/app/cat-prep/daily-dose/essay/[date]/page.tsx)

---

## NEXT 2–4 WEEKS — Content & Schema (Claude can help)

### 🟡 Add `WebSite` schema to root layout
**Why:** Enables Google Sitelinks search box — users can search your site directly from Google results.

**File:** [src/app/layout.tsx](src/app/layout.tsx)

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StudyNaksha",
  "url": "https://studynaksha.com",
}
```

---

### 🟡 Add `BreadcrumbList` schema to topic pages
**Why:** Currently only subtopic pages have breadcrumb schema. Adding it to topic pages (`/cat-prep/[topic]`) enables breadcrumb rich results in Google.

**File:** [src/app/cat-prep/[topic]/page.tsx](src/app/cat-prep/[topic]/page.tsx)

---

### 🟡 Add `Article` schema to daily essay pages
**Why:** Helps Google understand these are article-type content, potentially enabling rich results with publish date.

**File:** [src/app/cat-prep/daily-dose/essay/[date]/page.tsx](src/app/cat-prep/daily-dose/essay/[date]/page.tsx)

---

### 🟡 Add intro text to practice chapter pages
**Why:** Google rewards pages with substantial text content. A practice page that's just a list of questions has thin content. Adding 150–300 words of intro text (topic overview, what to expect, tips) significantly improves ranking potential.

**Affects:** All `/cat-prep/practice/quant/[topic]/[chapter]` pages

What to add per page:
- What this chapter covers
- Key formulas or concepts
- Difficulty breakdown
- 2–3 quick tips

---

### 🟡 Add HTML sitemap page
**Why:** An HTML sitemap at `/sitemap` helps both users and crawlers discover all your content, especially deep pages Google might not reach via internal links alone.

---

## ONGOING — You Do These Manually

### 🟢 Build backlinks
**Why:** Domain authority (how much Google trusts you) is built through other sites linking to yours. You currently have only 1–5 backlinks.

**Where to post:**
- **Reddit:** r/CATPrep, r/MBA — share useful content, link back naturally
- **Quora:** Answer CAT prep questions, link to relevant practice pages
- **Telegram groups:** CAT 2025/2026 prep groups — share your daily essay/challenge
- **YouTube comments:** On CAT prep channels, mention your free practice resources

> Don't spam. Post genuinely useful answers and let the link be a "learn more" reference.

---

### 🟢 Set up Bing Webmaster Tools
**Why:** Bing powers ~7% of searches and has its own index. Takes 10 minutes to set up.

**Steps:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Add your site → verify via DNS or HTML tag
4. Submit sitemap: `https://studynaksha.com/sitemap.xml`

---

### 🟢 Monitor GSC weekly
**What to check:**
- **Coverage report** — are new pages getting indexed?
- **Performance report** — what queries are you appearing for?
- **Core Web Vitals** — any pages failing LCP/CLS/FID?
- **Crawl stats** — is Googlebot visiting regularly?

---

## Progress Tracker

| Phase | Task | Status |
|---|---|---|
| 1 | Vercel SITE_URL correct | ✅ Was already fine |
| 1 | Re-submit sitemap in GSC | ⏳ You need to do this |
| 1 | Request indexing for 5 pages | ⏳ You need to do this |
| 2 | Canonical tags on 8 pages | ✅ Done (July 1) |
| 2 | noindex on mock test pages | ✅ Done (July 1) |
| 2 | disallow rules in robots.ts | ✅ Done (July 1) |
| 2 | VARC RC pages in sitemap | ✅ Done (July 1) |
| 3 | generateStaticParams — topic/subtopic | ✅ Done (July 1) |
| 3 | generateStaticParams — quant/DILR | ✅ Done (July 1) |
| 3 | generateStaticParams — PYQ pages | ✅ Done (July 1) |
| 3 | Replace force-dynamic with revalidate | ✅ Done (July 1) |
| 4 | WebSite schema in root layout | ✅ Done (July 1) |
| 4 | BreadcrumbList on topic pages | ✅ Already existed |
| 4 | Article schema on essay pages | ✅ Done (July 1) |
| 4 | Quiz schema on quant practice pages | ✅ Done (July 1) |
| 4 | FAQ schema on how-to-prepare | ✅ Done (July 1) |
| 4 | HTML sitemap page (/sitemap-page) | ✅ Done (July 1) |
| 4 | PYQ papers added to XML sitemap | ✅ Done (July 1) — were missing! |
| 4 | Intro text on practice pages | ⏳ You write the content, Claude adds it |
| 4 | Backlinks (Reddit/Quora/Telegram) | ⏳ You do this manually |
| 5 | Bing Webmaster Tools setup | ⏳ You do this manually |
| 5 | Weekly GSC monitoring | ⏳ Ongoing |
