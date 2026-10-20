// FeedbackForm — floating suggest-a-resource footer pinned to the bottom of the details panel
"use client";

import { trackEvent } from "@/app/components/analytics";

const WA_NUMBER = "919352277260";

export default function FeedbackForm({ topicTitle }: { topicTitle: string }) {
  const message =
    `Hi! Suggestion for StudyNaksha\n\nSubtopic: ${topicTitle}\n\nSuggested resource:\n- Link: \n- Why it's better: \n- Any general feedback: `;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div
      style={{
        flexShrink: 0,
        padding: "14px 20px 20px",
        background: "var(--paper)",
        borderTop: "1px solid var(--rule)",
        boxShadow: "0 -6px 20px rgba(30,58,95,0.07)",
      }}
    >
      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 12px" }}>
        Found a clearer explanation for this topic? Send it over and it gets reviewed.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("feedback_submitted", { subtopic_name: topicTitle, feedback_type: "suggestion" })}
        className="ed-btn"
        data-weight="secondary"
        style={{ width: "100%" }}
      >
        Suggest a better resource
      </a>
    </div>
  );
}
