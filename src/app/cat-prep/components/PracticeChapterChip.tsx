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
}: {
  chapter: PracticeChapter;
  href: string;
}) {
  const { isLoggedIn } = useProgressContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

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
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1.5px solid #E2E8F0",
          background: "#fff",
          color: "#334155",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.border = "1.5px solid #14B8A6";
          el.style.background = "#F0FDFA";
          el.style.color = "#0F766E";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.border = "1.5px solid #E2E8F0";
          el.style.background = "#fff";
          el.style.color = "#334155";
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#CBD5E1",
            flexShrink: 0,
          }}
        />
        {chapter.name}
        <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 2 }}>
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
