# H103 — Daily Challenge: MongoDB Atlas Data API

## Goal
Replace the static JSON file data source and Firestore result storage with MongoDB Atlas Data API, accessed via Next.js API routes (server-side proxy). The existing test-taking UI and scoring logic are preserved.

## What Changes

| Concern | Before | After |
|---|---|---|
| Quiz data | `/public/daily-challenges/{date}.json` | MongoDB `daily_quizzes` + `questions` + `comprehensions` collections |
| Answer keys | `/public/answers/{date}.json` | Embedded in `questions` (server-side only) |
| Grading | Client-side in `computeResult()` | Server-side in `POST /api/submit-attempt` |
| Results storage | Firestore `users/{uid}/dailyChallenges/{date}` | MongoDB `quiz_attempts` + localStorage |
| Draft / resume | Firestore `users/{uid}/dailyChallengeDrafts/{date}` | `localStorage` (device-local) |
| Time limits | Per-test JSON fields | `.env.local` env vars |
| API key exposure | N/A | Proxied through Next.js API routes (key never in client bundle) |

## New Env Vars (add to `.env.local`)

```
MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/<App-ID>/endpoint/data/v1
MONGODB_API_KEY=<your-api-key>
MONGODB_DATA_SOURCE=Cluster0
MONGODB_DATABASE=StudyNaksha
DAILY_CHALLENGE_SECTION_TIME_SECONDS=1200
DAILY_CHALLENGE_QUESTION_TIME_SECONDS=0
```

- `MONGODB_*` vars are server-side only (no `NEXT_PUBLIC_` prefix).
- `DAILY_CHALLENGE_SECTION_TIME_SECONDS`: total time in seconds for each quiz (e.g. 1200 = 20 min).
- `DAILY_CHALLENGE_QUESTION_TIME_SECONDS`: per-question timer in seconds; `0` disables it.

## MongoDB Collections Used

- `daily_quizzes` — one document per date; has `subject`, `questionIds`, `isComprehension`, `comprehensionId`
- `questions` — one per question; has `type`, `text`, `options`, `correctOptionIndex`/`correctAnswer`
- `comprehensions` — passage text for RC/DILR sets
- `quiz_attempts` — one per (userId × date); compound unique index `{ date: 1, userId: 1 }`

## Architecture

```
Browser                     Next.js server               MongoDB Atlas
  │                              │                              │
  │  GET /cat-prep/daily-challenge                             │
  │──────────────────────────────► page.tsx (server component) │
  │                              │──── fetchDailyTest(date) ───►│
  │                              │◄── DailyTest (no answers) ──│
  │◄── HTML + DailyTest props ───│                              │
  │                              │                              │
  │  POST /api/submit-attempt    │                              │
  │──────────────────────────────►                              │
  │  { date, uid, responses,     │──── fetch questions ────────►│
  │    timings, totalTimeSeconds}│◄─── with correct answers ───│
  │                              │──── insertOne quiz_attempts─►│
  │◄── DailyChallengeResult ─────│                              │
```

## Files Created

- `src/lib/mongodb.ts` — HTTP client for MongoDB Atlas Data API
- `src/lib/dailyQuizQueries.ts` — `fetchDailyTest()`, `gradeAndSave()`, `getStoredResult()`
- `src/app/api/daily-quiz/route.ts` — `GET ?date=YYYY-MM-DD` → `DailyTest | 404`
- `src/app/api/submit-attempt/route.ts` — `POST` → grade + save + return `DailyChallengeResult`
- `src/app/api/daily-challenge-result/route.ts` — `GET ?uid=&date=` → `DailyChallengeResult | null`

## Files Changed

- `src/app/cat-prep/models/dailyChallenge.ts` — add `correctAnswer: number | null` to `QuestionResponse`; remove `AnswerKey`
- `src/app/cat-prep/lib/dailyChallengeStore.ts` — replace Firestore with localStorage helpers
- `src/app/cat-prep/daily-challenge/lib/useDailyChallengeTest.ts` — remove `computeResult`; add `collectTimingSnapshot()`
- `src/app/cat-prep/daily-challenge/page.tsx` — async; calls `fetchDailyTest()` directly
- `src/app/cat-prep/daily-challenge/components/DailyChallengePageClient.tsx` — updated store calls
- `src/app/cat-prep/daily-challenge/components/TestView.tsx` — calls submit API, localStorage save
- `src/app/cat-prep/daily-challenge/components/ResultView.tsx` — remove `answerKey` prop
- `src/app/cat-prep/daily-challenge/components/SectionBreakdownCard.tsx` — remove `answers` prop
- `src/app/cat-prep/daily-challenge/components/QuestionReviewList.tsx` — use `resp.correctAnswer`
- `src/app/cat-prep/components/DailyChallengeCard.tsx` — check quiz via API, result via localStorage

## Acceptance Criteria

- [ ] Visiting `/cat-prep/daily-challenge` fetches today's quiz from MongoDB and renders the test
- [ ] Time limits come from env vars (section timer visible in SectionHeader)
- [ ] Submitting sends answers to `/api/submit-attempt`; correct answers never sent to browser before submit
- [ ] After submission, result is stored in MongoDB `quiz_attempts` and `localStorage`
- [ ] Revisiting the page shows the result (from localStorage or API)
- [ ] The `DailyChallengeCard` shows "No challenge" / "CTA" / "Completed" states correctly
- [ ] Resume prompt works (localStorage draft)
- [ ] No Firestore reads/writes for the daily challenge feature

## Test Plan

1. Add a `daily_quizzes` document for today's date in MongoDB Atlas UI
2. Add corresponding `questions` documents
3. Visit `/cat-prep/daily-challenge` and verify quiz loads
4. Set `DAILY_CHALLENGE_SECTION_TIME_SECONDS=60` and verify timer
5. Set `DAILY_CHALLENGE_QUESTION_TIME_SECONDS=30` and verify per-question timer
6. Submit answers and verify result screen shows correct scores
7. Refresh — result screen should persist (from localStorage)
8. Open the roadmap and verify the card shows "Completed" with score
9. Close browser, reopen — card still shows "Completed" (localStorage)
