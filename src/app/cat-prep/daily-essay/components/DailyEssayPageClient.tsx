// DailyEssayPageClient — essay display, response form, and per-question community discussion
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { DailyEssay, EssaySubmissionView } from "@/app/cat-prep/models/essay";
import { ESSAY_QUESTIONS } from "@/constants/essayQuestions";

type PageState = "auth-loading" | "form" | "submitting" | "discussion" | "discussion-loading";

function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Avatar({ name, photoUrl, size = 32 }: { name: string; photoUrl: string | null; size?: number }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#1E3A5F",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function VoteButton({
  direction,
  active,
  disabled,
  onClick,
}: {
  direction: "up" | "down";
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active ? (direction === "up" ? "#DCFCE7" : "#FEE2E2") : "#F8FAFC",
        border: `1px solid ${active ? (direction === "up" ? "#86EFAC" : "#FCA5A5") : "#E2E8F0"}`,
        color: active ? (direction === "up" ? "#166534" : "#991B1B") : "#94A3B8",
        borderRadius: 6,
        padding: "3px 9px",
        fontSize: 11,
        fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        opacity: disabled && !active ? 0.45 : 1,
        lineHeight: 1.6,
      }}
    >
      {direction === "up" ? "▲" : "▼"}
    </button>
  );
}

// Single answer card — shown inside a per-question section
function AnswerCard({
  sub,
  questionId,
  isOwn,
  canVote,
  onVote,
}: {
  sub: EssaySubmissionView;
  questionId: string;
  isOwn: boolean;
  canVote: boolean;
  onVote: (submissionId: string, questionId: string, value: 1 | -1 | 0) => void;
}) {
  const score = sub.questionScores[questionId] ?? 0;
  const userVote = sub.questionUserVotes[questionId] ?? 0;

  const handleVote = (direction: 1 | -1) => {
    if (!canVote) return;
    onVote(sub.id, questionId, userVote === direction ? 0 : direction);
  };

  return (
    <div
      style={{
        border: isOwn ? "1.5px solid #1E3A5F25" : "1px solid #E2E8F0",
        borderRadius: 10,
        padding: "14px 16px",
        background: isOwn ? "#F0F4FF" : "#fff",
      }}
    >
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={sub.displayName} photoUrl={sub.photoUrl} size={28} />
          <span className="font-semibold" style={{ fontSize: 13, color: "#1E3A5F" }}>
            {sub.displayName}
          </span>
          {isOwn && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#3B82F6",
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 100,
                padding: "1px 7px",
              }}
            >
              you
            </span>
          )}
        </div>

        {/* Vote controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <VoteButton direction="up" active={userVote === 1} disabled={!canVote} onClick={() => handleVote(1)} />
          <span
            className="font-bold"
            style={{
              fontSize: 12,
              color: score > 0 ? "#166534" : score < 0 ? "#991B1B" : "#94A3B8",
              minWidth: 18,
              textAlign: "center",
            }}
          >
            {score > 0 ? `+${score}` : score}
          </span>
          <VoteButton direction="down" active={userVote === -1} disabled={!canVote} onClick={() => handleVote(-1)} />
        </div>
      </div>

      {/* Answer text */}
      <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>
        {sub.answers[questionId] || <em style={{ color: "#CBD5E1" }}>No answer</em>}
      </p>
    </div>
  );
}

export default function DailyEssayPageClient({
  essay,
  date,
  viewOnly = false,
  initialSubmissions = [],
}: {
  essay: DailyEssay | null;
  date: string;
  viewOnly?: boolean;
  initialSubmissions?: EssaySubmissionView[];
}) {
  const [pageState, setPageState] = useState<PageState>(
    viewOnly ? "discussion" : "auth-loading"
  );
  const [user, setUser] = useState<User | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<EssaySubmissionView[]>(initialSubmissions);
  const [loginError, setLoginError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (viewOnly) {
      const unsub = onAuthStateChanged(auth, (u) => setUser(u));
      return () => unsub();
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setPageState("form");
        return;
      }

      if (checkedRef.current) return;
      checkedRef.current = true;

      try {
        const res = await fetch(
          `/api/daily-essay/submissions?date=${date}&userId=${encodeURIComponent(firebaseUser.uid)}`
        );
        const data = await res.json() as { submitted: boolean; submissions?: EssaySubmissionView[] };

        if (data.submitted && data.submissions) {
          setSubmissions(data.submissions);
          setPageState("discussion");
        } else {
          setPageState("form");
        }
      } catch {
        setPageState("form");
      }
    });
    return () => unsub();
  }, [date, viewOnly]);

  const handleSignIn = async () => {
    setLoginError(false);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setLoginError(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) { handleSignIn(); return; }

    const missing = ESSAY_QUESTIONS.find((q) => !(answers[q.id] ?? "").trim());
    if (missing) {
      setSubmitError("Please answer all four questions before submitting.");
      return;
    }

    setSubmitError(null);
    setPageState("submitting");

    try {
      const res = await fetch("/api/daily-essay/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          userId: user.uid,
          displayName: user.displayName ?? "Anonymous",
          photoUrl: user.photoURL ?? null,
          answers,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? "Submission failed");
      }

      setPageState("discussion-loading");
      const subsRes = await fetch(
        `/api/daily-essay/submissions?date=${date}&userId=${encodeURIComponent(user.uid)}`
      );
      const subsData = await subsRes.json() as { submitted: boolean; submissions?: EssaySubmissionView[] };
      setSubmissions(subsData.submissions ?? []);
      setPageState("discussion");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPageState("form");
    }
  };

  const handleVote = async (submissionId: string, questionId: string, value: 1 | -1 | 0) => {
    if (!user) return;

    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== submissionId) return s;
        const prevVote = s.questionUserVotes[questionId] ?? 0;
        const delta = value - prevVote;
        return {
          ...s,
          questionScores: { ...s.questionScores, [questionId]: (s.questionScores[questionId] ?? 0) + delta },
          questionUserVotes: { ...s.questionUserVotes, [questionId]: value },
        };
      })
    );

    try {
      await fetch("/api/daily-essay/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, questionId, voterId: user.uid, value }),
      });
    } catch {
      // Revert on failure — re-fetch to get ground truth
      const res = await fetch(
        `/api/daily-essay/submissions?date=${date}&userId=${encodeURIComponent(user.uid)}`
      ).catch(() => null);
      if (res?.ok) {
        const data = await res.json() as { submitted: boolean; submissions?: EssaySubmissionView[] };
        if (data.submissions) setSubmissions(data.submissions);
      }
    }
  };

  if (!essay) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFFDF8", padding: "48px 24px", textAlign: "center" }}>
        <p className="font-semibold text-slate-400" style={{ fontSize: 16 }}>
          Could not load today&apos;s essay. Please try again later.
        </p>
        <Link href="/cat-prep" style={{ color: "#1E3A5F", fontSize: 14, marginTop: 16, display: "inline-block" }}>
          ← Back to Roadmap
        </Link>
      </div>
    );
  }

  const isLoading = pageState === "auth-loading" || pageState === "discussion-loading";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      {/* Header */}
      <div style={{ background: "#1E3A5F", padding: "14px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/cat-prep"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}
          >
            ← Roadmap
          </Link>
          <span className="font-bold text-white" style={{ fontSize: 13 }}>
            Daily Essay
          </span>
          <Link
            href="/cat-prep/daily-essay/archive"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", fontWeight: 500, textAlign: "right" }}
          >
            Archive
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        {/* Date */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.5px", marginBottom: 6, textTransform: "uppercase" }}>
          {formatDate(date)}
        </p>

        {/* Essay card */}
        <div
          style={{
            border: "1.5px solid #E2E8F0",
            borderRadius: 16,
            padding: "22px 24px",
            background: "#fff",
            marginBottom: 32,
            boxShadow: "0 2px 12px rgba(30,58,95,0.06)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
            Today&apos;s Essay · Aeon
          </p>
          <h1 className="font-extrabold text-trust-navy" style={{ fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.3, marginBottom: 6 }}>
            {essay.title}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
            by <span className="font-semibold">{essay.author || "Unknown"}</span>
          </p>
          {essay.excerpt && (
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 18 }}>
              {essay.excerpt}…
            </p>
          )}
          <a
            href={essay.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
            style={{
              display: "inline-block",
              padding: "9px 20px",
              borderRadius: 8,
              background: "#1E3A5F",
              color: "#fff",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Read full essay on Aeon →
          </a>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="animate-pulse" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 80, borderRadius: 12, background: "#E2E8F0" }} />
            ))}
          </div>
        )}

        {/* Response form */}
        {pageState === "form" && (
          <div>
            <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 18, marginBottom: 6 }}>
              Your Response
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>
              Answer all four questions. You&apos;ll see everyone else&apos;s responses after submitting.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
              {ESSAY_QUESTIONS.map((q, i) => (
                <div key={q.id}>
                  <label
                    htmlFor={q.id}
                    className="font-semibold text-trust-navy"
                    style={{ fontSize: 14, display: "block", marginBottom: 8 }}
                  >
                    {i + 1}. {q.text}
                  </label>
                  <textarea
                    id={q.id}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    rows={3}
                    placeholder="Write your answer here…"
                    style={{
                      width: "100%",
                      border: "1.5px solid #E2E8F0",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#334155",
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      background: "#FAFBFC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>

            {submitError && (
              <p style={{ fontSize: 13, color: "#EF4444", marginBottom: 14 }}>{submitError}</p>
            )}

            {!user ? (
              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>
                  Sign in to submit your response and see what others think.
                </p>
                {loginError && (
                  <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>
                    Could not sign in. Please try again.
                  </p>
                )}
                <button
                  onClick={handleSignIn}
                  className="font-bold text-white"
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    background: "#1E3A5F",
                    border: "none",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign in with Google →
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="font-bold text-white"
                style={{
                  padding: "10px 28px",
                  borderRadius: 8,
                  background: "#1E3A5F",
                  border: "none",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Submit Response →
              </button>
            )}
          </div>
        )}

        {/* Submitting state */}
        {pageState === "submitting" && (
          <p style={{ fontSize: 14, color: "#64748B" }}>Submitting…</p>
        )}

        {/* Discussion — per-question sections */}
        {pageState === "discussion" && (
          <div>
            <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 18, marginBottom: 4 }}>
              Community Responses
              <span className="font-medium text-slate-400" style={{ fontSize: 14, marginLeft: 8 }}>
                ({submissions.length})
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 28 }}>
              {viewOnly
                ? "Community responses for this essay. Sign in to upvote individual answers."
                : "Upvote the answers you find most insightful within each question."}
            </p>

            {submissions.length === 0 ? (
              <p style={{ fontSize: 14, color: "#94A3B8" }}>No responses yet — you&apos;re the first!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                {ESSAY_QUESTIONS.map((q, i) => {
                  // Sort this question's answers by score descending
                  const sorted = [...submissions].sort(
                    (a, b) =>
                      (b.questionScores[q.id] ?? 0) - (a.questionScores[q.id] ?? 0)
                  );

                  return (
                    <div key={q.id}>
                      {/* Question heading */}
                      <div
                        style={{
                          borderLeft: "3px solid #1E3A5F",
                          paddingLeft: 12,
                          marginBottom: 14,
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Q{i + 1}
                        </span>
                        <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginTop: 2 }}>
                          {q.text}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {sorted.map((sub) => (
                          <AnswerCard
                            key={sub.id}
                            sub={sub}
                            questionId={q.id}
                            isOwn={sub.userId === user?.uid}
                            canVote={!!user && sub.userId !== user.uid}
                            onVote={handleVote}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
