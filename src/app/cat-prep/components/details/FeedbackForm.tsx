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
        background: "#FFFDF8",
        borderTop: "1px solid #E8EAF0",
        boxShadow: "0 -6px 20px rgba(30,58,95,0.07)",
      }}
    >
      <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6, margin: "0 0 10px" }}>
        StudyNaksha gets better every week because aspirants like you improve it.
        Found a clearer explanation? Send it over.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("feedback_submitted", { subtopic_name: topicTitle, feedback_type: "suggestion" })}
        className="w-full font-semibold"
        style={{
          display: "block",
          padding: "10px 16px",
          borderRadius: 8,
          background: "#25D366",
          color: "#fff",
          fontSize: 13,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        Know a better video for this? Suggest it →
      </a>
    </div>
  );
}
