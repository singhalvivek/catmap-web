// SubjectModeToggle — split Learn/Practice pill replacing the plain subject header
"use client";

import { SubjectMeta } from "../lib/subjectMeta";
import { Node } from "../models/node";
import { getPracticeSubject } from "@/constants/practiceChapters";

type Mode = "learn" | "practice";

export default function SubjectModeToggle({
  activeSubject,
  meta,
  mode,
  onModeChange,
}: {
  activeSubject: Node;
  meta: SubjectMeta;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}) {
  const topicCount = activeSubject.children?.length ?? 0;
  const subtopicCount = activeSubject.children?.flatMap((t) => t.children ?? []).length ?? 0;

  const practiceSubject = getPracticeSubject(activeSubject.id);
  const practiceTopicCount = practiceSubject?.topics.length ?? 0;
  const practiceQuestionCount =
    practiceSubject?.topics
      .flatMap((t) => t.chapters)
      .reduce((sum, c) => sum + c.questionCount, 0) ?? 0;

  return (
    <div
      className="flex items-stretch gap-0 mb-4"
      style={{
        borderRadius: 12,
        border: `1.5px solid ${meta.color}30`,
        overflow: "hidden",
      }}
    >
      {/* Learn half */}
      <button
        onClick={() => onModeChange("learn")}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          background: mode === "learn" ? meta.color : meta.light,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.18s",
          borderRight: `1px solid ${meta.color}30`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: mode === "learn" ? "#fff" : meta.color,
            flexShrink: 0,
            transition: "background 0.18s",
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div
            className="font-extrabold"
            style={{ fontSize: 15, color: mode === "learn" ? "#fff" : meta.color }}
          >
            Learn
          </div>
          <div style={{ fontSize: 12, color: mode === "learn" ? "rgba(255,255,255,0.7)" : "#94A3B8", marginTop: 1 }}>
            {topicCount} topics · {subtopicCount} subtopics
          </div>
        </div>
      </button>

      {/* Practice half */}
      <button
        onClick={() => onModeChange("practice")}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          background: mode === "practice" ? meta.color : meta.light,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.18s",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: mode === "practice" ? "#fff" : meta.color,
            flexShrink: 0,
            transition: "background 0.18s",
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div
            className="font-extrabold"
            style={{ fontSize: 15, color: mode === "practice" ? "#fff" : meta.color }}
          >
            Practice
          </div>
          <div style={{ fontSize: 12, color: mode === "practice" ? "rgba(255,255,255,0.7)" : "#94A3B8", marginTop: 1 }}>
            {practiceTopicCount} topics · {practiceQuestionCount} questions
          </div>
        </div>
      </button>
    </div>
  );
}
