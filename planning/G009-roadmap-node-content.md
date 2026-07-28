# G009 — Server-Render Roadmap Node Content

## Goal

The 61 subtopic pages and 11 topic pages render the roadmap tree and nothing about the node they are named after. The node's description and resource list live in a click-to-open client panel, so neither appears in the HTML.

Measured on the production build before this change:

- **Jaccard similarity between any two subtopic pages: 0.947**
- **Truly-unique words per page (present on that page and no other subtopic page): 0**
- The description text from `description.json` appeared in no page's HTML at all

72 of 215 sitemap URLs were, to a crawler, the same page with a different title.

This renders each node's own description, its resources, and links to its siblings — which doubles as the internal linking these pages have never had.

## What this does not fix

Being straight about the result, because the measurement is not flattering:

| Metric | Before | After |
|---|---|---|
| Subtopic Jaccard similarity | 0.947 | 0.948 |
| Truly-unique words per subtopic page | 0 | median **7**, min **0**, max 12 |
| Shared boilerplate share of vocabulary | — | ~69% |
| Topic page Jaccard similarity | ~0.95 | **0.576** |

Topic pages improve substantially, because each lists a different set of subtopics. Subtopic pages barely move.

The reason is arithmetic. The unique content available per subtopic is a description with a median length of **90 characters** — about 15 words — plus two or three resource titles. The shared roadmap tree on the same page is roughly 400 words: every topic name, every sibling subtopic, the progress rings and the Daily Dose card. 15 unique words cannot outweigh 400 shared ones.

So this is a real improvement and an insufficient one. Two things would actually fix it, neither in scope here:

1. **Real content per node** — the 250–400 words per page already planned for September via the Cowork brief. This is the intended fix; 61 × 300 words changes the ratio decisively.
2. **Stop rendering the whole roadmap tree on every node page.** A subtopic page that led with its own content and linked back to the roadmap would not share 400 words with its 60 siblings. That is a page-design decision, not a rendering bug.

Until one of those lands, these pages remain thin and near-duplicate. Whether to keep them indexed in the meantime is a judgement call — the alternative is `noindex` until the September content arrives, which parks 72 URLs including topic pages that target real queries.

## Files Affected

- `src/app/cat-prep/components/NodeContent.tsx` — **new** server component: heading, description, resource list, related-node links.
- `src/app/cat-prep/[topic]/[subtopic]/page.tsx` — renders it with the node's siblings.
- `src/app/cat-prep/[topic]/page.tsx` — renders it with the topic's children.

Headings stay at `h2`: `RoadmapContent` already emits an `h1` ("CAT Preparation Roadmap") on every one of these pages, and a second `h1` would be worse than a generic one. That shared `h1` is itself a weak signal worth fixing separately.

Outbound resource links carry `nofollow` — they point at YouTube and third-party articles, and there is no reason to pass equity to them from 61 pages.

## Acceptance Criteria

- [ ] Every subtopic page's HTML contains its own description, where one exists (53 of 61).
- [ ] Every subtopic page links to its siblings; every topic page links to its children.
- [ ] Resource titles and links render server-side with `rel="nofollow"`.
- [ ] No page gains a second `h1`.
- [ ] Topic page similarity drops materially.
- [ ] `tsc`, `eslint`, `vitest`, `next build` clean.

## Test Plan

- Build, then diff the visible text of two subtopic pages in the same topic and two in different topics.
- Confirm the 8 subtopics with no description and the 9 with no resources render without an empty heading.
- Check `/cat-prep/algebra` lists all 8 algebra subtopics as links.
- Confirm the roadmap UI above is untouched.

## Out of Scope

- Writing the 250–400 words per page (September, Cowork).
- Changing the shared `h1`.
- Removing the roadmap tree from node pages.
