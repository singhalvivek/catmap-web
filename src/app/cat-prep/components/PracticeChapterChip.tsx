// PracticeChapterChip — auth-gated button chip that navigates to a practice chapter
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PracticeChapter } from "@/constants/practiceChapters";
import { useProgressContext } from "@/app/cat-prep/lib/ProgressContext";
import SignInModal from "./SignInModal";

export default function PracticeChapterChip({
  chapter,
  href,
  chipColor,
}: {
  chapter: PracticeChapter;
  href: string;
  chipColor: string;
}) {
  const { isLoggedIn } = useProgressContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function handleClick() {
    if (isLoggedIn) {
      router.push(href);
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
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
      </button>

      {showModal && (
        <SignInModal
          message="Sign in to save your practice attempts and track progress across devices. It's free."
          onClose={() => setShowModal(false)}
          onSuccess={() => router.push(href)}
        />
      )}
    </>
  );
}
