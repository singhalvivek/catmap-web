// SignInGate — the screen shown before a timed test, for a visitor who is not signed in
"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import type { DailyTest } from "../models/dailyChallenge";

function minutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

/**
 * Both gates were a centred box on a bare page: a 48px emoji, one line, and a Google
 * button. No masthead, no footer, no way anywhere else — on two routes a visitor can land
 * on directly. And neither said what was behind the gate, although the test is already in
 * scope on both, carrying its section names, question counts and per-section durations.
 *
 * Asking for an account is a bigger request than the page was making the case for.
 */
export default function SignInGate({
  title,
  reason,
  test,
  error,
  onSignIn,
  backHref,
  backLabel,
}: {
  title: string;
  reason: string;
  /** Null when there is nothing scheduled; the summary is simply omitted. */
  test: DailyTest | null;
  error?: string | null;
  onSignIn: () => void;
  backHref: string;
  backLabel: string;
}) {
  const totalQuestions = test?.sections.reduce((n, s) => n + s.questions.length, 0) ?? 0;
  const totalSeconds = test?.sections.reduce((n, s) => n + s.timeLimitSeconds, 0) ?? 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <Header />

      <div className="gate">
        <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
          Before you start
        </p>
        <h1 className="display gate__title">{title}</h1>
        <p className="gate__reason">{reason}</p>

        {test && test.sections.length > 0 && (
          <div className="gate__summary">
            <p className="gate__summary-head">
              {totalQuestions} questions &middot; {minutes(totalSeconds)} in total
            </p>
            <ul className="gate__sections">
              {test.sections.map((section) => (
                <li key={section.name}>
                  <span className="gate__section-name">{section.name}</span>
                  <span className="gate__section-meta">
                    {section.questions.length} questions &middot;{" "}
                    {minutes(section.timeLimitSeconds)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="gate__note">
              Sections are taken in order and timed separately, the way the real exam runs.
            </p>
          </div>
        )}

        {error && (
          <p className="ed-notice" data-state="wrong" role="alert">
            {error}
          </p>
        )}

        <div className="gate__actions">
          <button type="button" onClick={onSignIn} className="ed-btn" data-weight="primary">
            Sign in with Google
          </button>
          <Link href={backHref} className="ed-btn" data-weight="quiet">
            {backLabel}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
