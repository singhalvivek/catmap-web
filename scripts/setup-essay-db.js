/**
 * setup-essay-db.js — creates collections and indexes for the daily essay feature.
 *
 * Run once against your MongoDB instance:
 *   mongosh "mongodb+srv://<user>:<pass>@<cluster>/<dbname>" --file scripts/setup-essay-db.js
 *
 * Safe to re-run — createIndex is idempotent.
 */

// ── daily_essays ─────────────────────────────────────────────────────────────
// One document per calendar day. Stores the Aeon essay picked that day.
db.createCollection("daily_essays");
db.daily_essays.createIndex({ date: 1 }, { unique: true, name: "date_unique" });

// ── used_essays ───────────────────────────────────────────────────────────────
// Tracks every essay URL that has been used so we never repeat.
db.createCollection("used_essays");
db.used_essays.createIndex({ url: 1 }, { unique: true, name: "url_unique" });

// ── essay_submissions ─────────────────────────────────────────────────────────
// One document per (date, user). Fields:
//   date        : "YYYY-MM-DD"  — IST calendar date
//   userId      : Firebase UID
//   displayName : from Firebase Auth (Google display name)
//   photoUrl    : from Firebase Auth (Google profile photo), nullable
//   answers     : { q1, q2, q3, q4 } — free-text answers
//   submittedAt : ISODate
db.createCollection("essay_submissions");

// Prevent a user from submitting more than once per day
db.essay_submissions.createIndex(
  { date: 1, userId: 1 },
  { unique: true, name: "date_user_unique" }
);

// Fast lookup of all submissions for a given date (discussion view)
db.essay_submissions.createIndex({ date: 1 }, { name: "date" });

// ── essay_votes ───────────────────────────────────────────────────────────────
// One document per (submission, question, voter). Votes are per-answer, not per-submission.
// Fields:
//   submissionId : essay_submissions._id as string
//   questionId   : "q1" | "q2" | "q3" | "q4"
//   voterId      : Firebase UID of the voter (never equals the submission's userId)
//   value        : 1 (upvote) or -1 (downvote)
db.createCollection("essay_votes");

// Prevent a user from casting more than one vote per answer
db.essay_votes.createIndex(
  { submissionId: 1, questionId: 1, voterId: 1 },
  { unique: true, name: "submission_question_voter_unique" }
);

// Fast lookup of all votes for a set of submissions
db.essay_votes.createIndex({ submissionId: 1 }, { name: "submissionId" });

print("✓ Daily essay collections and indexes created successfully.");
