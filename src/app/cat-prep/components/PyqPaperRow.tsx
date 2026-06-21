// PyqPaperRow — row for one PYQ paper; links to the browse player (sign-in-gated) and the mock test (gated on its own page)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PyqPaperSummary } from "@/app/cat-prep/models/pyq";
import { pyqPaperLabel } from "@/constants/pyqPapers";
import { useProgressContext } from "@/app/cat-prep/lib/ProgressContext";
import SignInModal from "./SignInModal";

export default function PyqPaperRow({ paper }: { paper: PyqPaperSummary }) {
  const { isLoggedIn } = useProgressContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const browseHref = `/cat-prep/pyq/${paper.paperSlug}`;
  const mockHref = `/cat-prep/pyq/${paper.paperSlug}/mock`;
  const totalQuestions =
    (paper.sectionCounts.VARC ?? 0) + (paper.sectionCounts.DILR ?? 0) + (paper.sectionCounts.QA ?? 0);

  function handleBrowseClick() {
    if (isLoggedIn) {
      router.push(browseHref);
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "14px 18px",
          borderRadius: 12,
          border: "1.5px solid #E8EAF0",
          background: "#fff",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="font-bold text-trust-navy" style={{ fontSize: 14 }}>
            {pyqPaperLabel(paper)}
          </span>
          <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 10 }}>{totalQuestions} questions</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleBrowseClick}
            className="font-bold"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1.5px solid #1E3A5F",
              background: "#1E3A5F",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Practice
          </button>
          <Link
            href={mockHref}
            className="font-bold"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1.5px solid #1E3A5F",
              background: "#fff",
              color: "#1E3A5F",
              fontSize: 13,
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            Take Mock Test
          </Link>
        </div>
      </div>

      {showModal && (
        <SignInModal
          message="Sign in to save your PYQ attempts and track progress across devices. It's free."
          onClose={() => setShowModal(false)}
          onSuccess={() => router.push(browseHref)}
          triggerLocation="pyq_gate"
        />
      )}
    </>
  );
}
