// RoadmapContent — client-side roadmap UI; receives pre-built tree data from server page
"use client";

import { useEffect, useMemo, useState } from "react";
import { Node } from "../models/node";
import { Description } from "../models/description";
import { Resource } from "../models/resource";
import type { Faq as FaqType } from "../models/faq";
import { ProgressStatus } from "../models/progress";
import { SUBJECT_META } from "../lib/subjectMeta";

import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import SubjectTab from "./SubjectTab";
import TopicRow from "./TopicRow";
import DailyChallenge from "./DailyChallenge";
import ContinueLearning from "./ContinueLearning";
import DetailsPanel from "./details/DetailsPanel";
import { useProgressContext } from "../lib/ProgressContext";

export default function RoadmapContent({
  subjects,
  allDescriptions,
  allResources,
  allFaqs,
}: {
  subjects: Node[];
  allDescriptions: Description[];
  allResources: Resource[];
  allFaqs: FaqType[];
}) {
  const [activeSubjectId, setActiveSubjectId] = useState<number>(subjects[0]?.id ?? 2);
  const [selected, setSelected] = useState<Node | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { progress } = useProgressContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activeSubject = subjects.find((s) => s.id === activeSubjectId);
  const meta = SUBJECT_META[activeSubjectId];

  const { totalSubs, doneSubs, totalPct } = useMemo(() => {
    const allSubs = subjects.flatMap((s) => (s.children ?? []).flatMap((t) => t.children ?? []));
    const done = allSubs.filter(
      (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
    ).length;
    const pct = allSubs.length > 0 ? Math.round((done / allSubs.length) * 100) : 0;
    return { totalSubs: allSubs.length, doneSubs: done, totalPct: pct };
  }, [subjects, progress]);

  const faqSlice = allFaqs.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF8" }}>
      <Header />

      {/* Page hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 100%)",
          padding: "36px 24px 40px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="font-semibold mb-1" style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.5px" }}>
            CAT 2025
          </div>
          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(24px,4vw,36px)", margin: "0 0 6px", letterSpacing: "-0.5px" }}
          >
            CAT Preparation Roadmap
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 24px" }}>
            Follow structured learning paths across all three sections
          </p>

          {/* Overall progress bar */}
          <div className="flex items-center gap-3">
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: "#E2E8F0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${totalPct}%`,
                  height: "100%",
                  background: "#14B8A6",
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span className="font-bold text-trust-navy" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              {doneSubs}/{totalSubs} subtopics
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1"
        style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "32px 24px" }}
      >
        {/* Continue Learning strip */}
        <ContinueLearning subjects={subjects} progress={progress} onSelectNode={setSelected} />

        {/* Daily Challenge */}
        <DailyChallenge />

        {/* Subject tabs */}
        <div className="flex gap-2.5 mb-7 flex-wrap">
          {subjects.map((subject) => {
            const subMeta = SUBJECT_META[subject.id];
            if (!subMeta) return null;
            return (
              <SubjectTab
                key={subject.id}
                subject={subject}
                isActive={activeSubjectId === subject.id}
                onClick={() => { setActiveSubjectId(subject.id); setSelected(null); }}
                progress={progress}
                meta={subMeta}
              />
            );
          })}
        </div>

        {/* Active subject header */}
        {meta && activeSubject && (
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: meta.light,
              border: `1.5px solid ${meta.color}30`,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, flexShrink: 0 }}
            />
            <div>
              <div className="font-extrabold" style={{ fontSize: 16, color: meta.color }}>
                {meta.label}
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                {activeSubject.children?.length ?? 0} topics ·{" "}
                {activeSubject.children?.flatMap((t) => t.children ?? []).length ?? 0} subtopics
              </div>
            </div>
          </div>
        )}

        {/* Topic accordion rows */}
        <ErrorBoundary>
          <div>
            {activeSubject?.children
              ?.slice()
              .sort((a, b) => a.order_index - b.order_index)
              .map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  onSelectNode={setSelected}
                  selectedId={selected?.id ?? null}
                  progress={progress}
                  accentColor={meta?.color ?? "#1E3A5F"}
                />
              ))}
          </div>
        </ErrorBoundary>

        {/* FAQ */}
        <div
          style={{
            marginTop: 48,
            padding: "32px 28px",
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #E8EAF0",
          }}
        >
          <h3 className="font-extrabold text-trust-navy" style={{ fontSize: 18, margin: "0 0 20px" }}>
            FAQs about CAT Prep
          </h3>
          <div className="flex flex-col gap-2">
            {faqSlice.map((faq, i) => (
              <div
                key={faq.id}
                style={{
                  borderRadius: 10,
                  border: `1.5px solid ${openFaq === i ? "#14B8A6" : "#E8EAF0"}`,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-3"
                  style={{ padding: "13px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <span className="font-semibold text-trust-navy" style={{ fontSize: 14 }}>
                    {faq.question}
                  </span>
                  <span
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: openFaq === i ? "#14B8A6" : "#F1F5F9",
                      color: openFaq === i ? "#fff" : "#94A3B8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0, fontWeight: 700,
                      transition: "all 0.2s",
                    }}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                <div className="faq-answer" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                  <p style={{ padding: "0 16px 13px", fontSize: 13, color: "#64748B", lineHeight: 1.7, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Details panel */}
      {selected && (
        <DetailsPanel
          selected={selected}
          descriptions={allDescriptions}
          resources={allResources}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
