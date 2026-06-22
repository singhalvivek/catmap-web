// PracticeTopicRow — accordion row for a practice topic; expands to show chapter chips
"use client";

import type { PracticeTopic } from "@/constants/practiceChapters";
import PracticeChapterChip from "./PracticeChapterChip";

export default function PracticeTopicRow({
  topic,
  section,
  accentColor,
  chipColor,
  isOpen,
  onToggle,
}: {
  topic: PracticeTopic;
  /** "Quant" | "DILR" | "VARC" — determines URL prefix */
  section: string;
  accentColor: string;
  chipColor: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const totalQuestions = topic.chapters.reduce((s, c) => s + c.questionCount, 0);

  function chapterHref(chapterSlug: string, topicSlug: string): string {
    if (section === "Quant") {
      return `/cat-prep/practice/quant/${topicSlug}/${chapterSlug}`;
    }
    if (section === "DILR") {
      return `/cat-prep/practice/dilr/${chapterSlug}/1`;
    }
    if (chapterSlug === "reading-comprehensions") {
      return `/cat-prep/practice/varc/reading-comprehensions/1`;
    }
    // Odd One Out, Para Jumbles, Para Summary — same MCQ player via quant route pattern
    return `/cat-prep/practice/varc/${topicSlug}/${chapterSlug}`;
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          borderRadius: isOpen ? "10px 10px 0 0" : 10,
          border: `1.5px solid ${isOpen ? accentColor : "#E2E8F0"}`,
          background: isOpen ? "#FFFDF8" : "#fff",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.18s",
          gap: 12,
        }}
      >
        <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              flexShrink: 0,
            }}
          />
          <span className="font-bold text-trust-navy text-left" style={{ fontSize: 14 }}>
            {topic.name}
          </span>
          <span className="font-medium text-slate-400" style={{ fontSize: 11 }}>
            {topic.chapters.length} chapters
          </span>
        </div>

        <div className="flex items-center gap-2.5" style={{ flexShrink: 0 }}>
          <span className="font-semibold text-slate-400" style={{ fontSize: 11 }}>
            {totalQuestions}Q
          </span>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: isOpen ? accentColor : "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isOpen ? "#fff" : "#94A3B8",
              fontSize: 13,
              fontWeight: 700,
              transition: "all 0.18s",
              flexShrink: 0,
            }}
          >
            {isOpen ? "−" : "+"}
          </div>
        </div>
      </button>

      <div
        style={{
          maxHeight: isOpen ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "12px 16px 14px",
            borderRadius: "0 0 10px 10px",
            border: `1.5px solid ${accentColor}`,
            borderTop: "none",
            background: "#FAFBFC",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {topic.chapters.map((chapter) => (
            <PracticeChapterChip
              key={chapter.slug}
              chapter={chapter}
              href={chapterHref(chapter.slug, topic.slug)}
              chipColor={chipColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
