# Implementation Notes: L3, L4, L5, L6, M10

**Branch:** `text`  
**Date:** 2026-04-23

---

## L3 — External link attributes (`rel="noopener noreferrer"` + `target="_blank"`)

**Status: Already done — no changes needed.**

All external links in the app go through `ResourceList.tsx`, which already had the correct attributes on the `<a>` tag that opens resource links. All other `<a href="...">` tags in the codebase use internal anchors (`#faq`, `#browse`, `/#browse`) and do not need `target="_blank"`.

---

## L4 — Error boundary around `<Tree />`

**Why:** Without an error boundary, a runtime render error in any tree node crashes the entire page and shows a blank white screen. The boundary catches the error, logs it, and shows a readable fallback.

**Files changed:**
- `src/app/cat-prep/components/ErrorBoundary.tsx` — new React class component; `getDerivedStateFromError` flips `hasError` state, `componentDidCatch` logs to console
- `src/app/cat-prep/page.tsx` — `<Tree />` wrapped with `<ErrorBoundary>`

**Why a class component:** React error boundaries require `getDerivedStateFromError` or `componentDidCatch`, which are class lifecycle methods. There is no hook equivalent. The `"use client"` directive is required because error boundaries only work in client-rendered trees.

---

## L5 — Unit tests for `buildTree.ts` and `progressCalculator.ts`

**Why:** Both are pure functions with no side effects, making them ideal for unit tests. Tests catch regressions when the tree structure or progress logic changes.

**Dependencies added:**
- `vitest` (devDependency) — chosen over Jest because it has zero config for TypeScript and does not require Babel or `ts-jest`
- `npm run test` → `vitest run` (single-pass, suitable for CI)

**Files created:**
- `vitest.config.ts` — sets `environment: "node"`, includes `src/__tests__/**/*.test.ts`
- `src/__tests__/buildTree.test.ts` — 6 tests: roots, children, nesting, empty input, orphan nodes, multiple roots
- `src/__tests__/progressCalculator.test.ts` — 6 tests: 0%, partial, 100%, IN_PROGRESS not counted, direct SUBTOPIC node, multi-topic aggregation

**Result:** 12/12 tests passing.

**Fix during testing:** The test for a direct SUBTOPIC node call initially expected `total=0` — but `collectSubtopics` collects the node itself when its type is `SUBTOPIC`, so `total=1`. The test was corrected to match actual (correct) behaviour.

**Also fixed:** `buildTree.ts` was missing its file header comment — added `// buildTree — converts a flat node list into a nested tree structure`.

---

## L6 — Standardise node title casing in `data.json`

**Why:** Inconsistent casing ("logarithm", "Bar chart") and several typos ("Factores", "Distibution", "Vein diagrams", "touraments") made the roadmap look unprofessional.

**Convention applied:** Title Case for all node titles — capitalise the first letter of each major word; articles and short prepositions ("and", "of", "in") stay lowercase unless they are the first word.

**Changes in `data.json`:**

| id | Before | After |
|----|--------|-------|
| 13 | `logarithm` | `Logarithm` |
| 18 | `Profit and loss` | `Profit and Loss` |
| 21 | `Work rate and time` | `Work Rate and Time` |
| 22 | `Distance time and speed` | `Distance, Time and Speed` |
| 23 | `Factores` *(typo)* | `Factors` |
| 24 | `Unit Digit theorm` *(typo)* | `Unit Digit Theorem` |
| 25 | `Maximum power and trailing zeros` | `Maximum Power and Trailing Zeros` |
| 26 | `Remainder theorem` | `Remainder Theorem` |
| 31 | `Quadlaterals` *(typo)* | `Quadrilaterals` |
| 32 | `Coordinate geometry` | `Coordinate Geometry` |
| 33 | `Surface area and volume` | `Surface Area and Volume` |
| 35 | `Arithmetic and geometric progression` | `Arithmetic and Geometric Progression` |
| 36 | `P &c` | `P & C` |
| 40 | `Vein diagrams` *(wrong word)* | `Venn Diagrams` |
| 42 | `Distibution` *(typo)* | `Distribution` |
| 43 | `Games and touraments` *(typo)* | `Games and Tournaments` |
| 44 | `Maps and networks` | `Maps and Networks` |
| 47 | `Bar chart` | `Bar Chart` |
| 48 | `Line chart` | `Line Chart` |
| 49 | `Pie chart` | `Pie Chart` |
| 50 | `Word problems` | `Word Problems` |
| 51 | `Vein diagrams` *(wrong word)* | `Venn Diagrams` |
| 53 | `Critical reasoning` | `Critical Reasoning` |
| 56 | `Statement, premise conclusions, premise, arguments and assumptions` | `Statements, Premises, Conclusions and Assumptions` |
| 58 | `Strengthen/weaken the argument` | `Strengthen and Weaken the Argument` |
| 59 | `Similar structure/arguments` | `Similar Structure and Arguments` |
| 60 | `Para summary` | `Para Summary` |
| 62 | `Para completion` | `Para Completion` |
| 63 | `Para odd one out` | `Para Odd One Out` |
| 64 | `How to read a passage` | `How to Read a Passage` |
| 65 | `eliminition of incorrect answers` *(typo)* | `Elimination of Incorrect Answers` |
| 66 | `Types of question in RC` | `Types of Questions in RC` |
| 67 | `Main idea of passage` | `Main Idea of Passage` |
| 68 | `tone and structure of passage` | `Tone and Structure of Passage` |

---

## M10 — Expand FAQ content

**Why:** The original 4 FAQs only covered the basics. Students also need guidance on scoring, books, mock test strategy, and platform-specific questions.

**Added 8 new entries (ids 5–12) to `faq.json`:**

| id | Question |
|----|----------|
| 5 | What percentile do I need for IIM calls? |
| 6 | How is the CAT score calculated? |
| 7 | What books are recommended for Quantitative Aptitude? |
| 8 | What resources are recommended for VARC? |
| 9 | Should I attempt all questions in CAT? |
| 10 | How does the topic lock work on StudyNaksha? |
| 11 | How do I save my progress on StudyNaksha? |
| 12 | Is StudyNaksha free? |
