# Planning Index — StudyNaksha

All planned work is tracked here. Pick an item, write a spec in `planning/`, implement, review, and mark ✅.

See [README.md](./README.md) for the workflow and [instructions.md](./instructions.md) for how to add a new feature.

---

## Status Legend
- ⬜ Pending
- 🔄 In Progress
- ✅ Done
- ❌ Deferred

---

## Code Quality Sprint
| ID | Status | Spec | Notes |
|----|--------|------|-------|
| L3–L6, M10 | ✅ | [L3-L4-L5-L6-M10-implementation.md](./L3-L4-L5-L6-M10-implementation.md) | Completed in refactor branch |

---

## SEO Phase
| ID | Status | Spec | Notes |
|----|--------|------|-------|
| L1 | ✅ | [SEO-phase.md](./SEO-phase.md) | Per-page `generateMetadata` |
| L2 | ✅ | [SEO-phase.md](./SEO-phase.md) | `robots.ts` + `sitemap.ts` |
| L9 | ✅ | [SEO-phase.md](./SEO-phase.md) | `opengraph-image.tsx` per route |

---

## Content
| ID | Status | Spec | Notes |
|----|--------|------|-------|
| M10 | ⬜ | — | Expand FAQ with platform-specific questions |

---

## Features
| ID | Status | Spec | Notes |
|----|--------|------|-------|
| H101 | ✅ | [H101-resource-viewer.md](./H101-resource-viewer.md) | In-panel resource viewer with thumbnails |
| H102 | ⬜ | — | Roadmap page quiz cards; real quiz on separate page |
| L101 | ⬜ | — | Waitlist: text-box instead of dropdown |
| P001 | 🔄 | [P001-practice-questions.md](./P001-practice-questions.md) | Practice questions — Quant MCQ, DILR sets, VARC RC; Learn/Practice toggle on roadmap |
| P002 | 🔄 | [P002-practice-player-fixes.md](./P002-practice-player-fixes.md) | Bug fixes + code reuse: RC solution cache bug, inline component remounts, mobile layout, shared PracticeOptionButton + PracticePalette |
| P003 | 🔄 | [P003-continue-practice-strip.md](./P003-continue-practice-strip.md) | Continue Practice strip — chips for in-progress practice sessions |
| P004 | 🔄 | [P004-pyq-section.md](./P004-pyq-section.md) | PYQ section — browse past papers + timed mock test; new entry point next to Learn/Practice. All 4 phases built; pending a real click-test of the mock submit flow before marking ✅ |
| P005 | 🔄 | [P005-progress-bars.md](./P005-progress-bars.md) | Mode-aware progress bars — Learn/Practice/PYQ each show their own metric + info tooltip |
| P006 | 🔄 | [P006-daily-dose-date-rollover.md](./P006-daily-dose-date-rollover.md) | Daily Dose date rollover — ISR was freezing "today" into the cache, serving yesterday's challenge/essay for up to an hour past IST midnight. Pages made dynamic; `getTodayIST` extracted to `src/lib/dateIST.ts` |

---

## Growth Phase — August 2026
| ID | Status | Spec | Notes |
|----|--------|------|-------|
| G001 | 🔄 | [G001-pyq-open-access.md](./G001-pyq-open-access.md) | Remove the PYQ sign-in walls; paper links become crawlable `<a href>` |
| G002 | 🔄 | [G002-pyq-ssr-full-paper.md](./G002-pyq-ssr-full-paper.md) | Server-render every question, option and explanation below the player |
| G003 | 🔄 | [G003-waitlist-capture.md](./G003-waitlist-capture.md) | Waitlist writes to a MongoDB `waitlist` collection instead of discarding the address |
| G004 | 🔄 | [G004-pricing-copy-cleanup.md](./G004-pricing-copy-cleanup.md) | Remove "later ₹200/mo" from the comparison table and the FAQ |
| G005 | 🔄 | [G005-practice-chip-link.md](./G005-practice-chip-link.md) | Practice chapter chips become real links, same defect as G001 |
| G006 | 🔄 | [G006-pyq-single-reader.md](./G006-pyq-single-reader.md) | One reader per paper — answer inline, no login, no duplicated questions; supersedes G002's two-copy layout |

---

## Deferred
| ID | Status | Blocker |
|----|--------|---------|
| M7 | ❌ | ARIA/keyboard nav — revisit when design stable |
| M8 | ❌ | Server-side tree load — needs API split first |
| H4 | ❌ | Feedback API validation — low priority |

---

## Daily Challenge Backlog
| Item | Status |
|------|--------|
| Admin upload tool for daily test JSON | ⬜ |
| Leaderboard / cross-user comparisons | ⬜ |
| Detailed per-question time analytics | ⬜ |
| Partial saves / resume mid-test | ⬜ |
| Mobile gesture navigation | ⬜ |
| Dark mode | ⬜ |
