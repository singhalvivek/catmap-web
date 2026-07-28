// PracticeChapterChip — link chip that navigates to a practice chapter
"use client";

import { useState } from "react";
import Link from "next/link";
import type { PracticeChapter } from "@/constants/practiceChapters";

export default function PracticeChapterChip({
  chapter,
  href,
  chipColor,
}: {
  chapter: PracticeChapter;
  href: string;
  chipColor: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: `1.5px solid ${isHovered ? "#14B8A6" : chipColor}`,
        background: isHovered ? "#fff" : chipColor,
        color: isHovered ? "#0F766E" : "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        textDecoration: "none",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isHovered ? "#CBD5E1" : "rgba(255,255,255,0.7)",
          flexShrink: 0,
        }}
      />
      {chapter.name}
      <span
        style={{
          fontSize: 11,
          color: isHovered ? "#94A3B8" : "rgba(255,255,255,0.75)",
          marginLeft: 2,
        }}
      >
        {chapter.questionCount}Q
      </span>
    </Link>
  );
}
