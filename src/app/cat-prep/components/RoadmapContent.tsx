// RoadmapContent — client-side roadmap UI; receives pre-built tree data from server page
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Node } from "../models/node";
import { Description } from "../models/description";
import { Resource } from "../models/resource";
import type { Faq as FaqType } from "../models/faq";
import { ProgressStatus } from "../models/progress";
import { SUBJECT_META } from "../lib/subjectMeta";

import { toSlug } from "../lib/nodeMetadata";
import Header from "./Header";
import Footer from "./Footer";
import { trackEvent } from "@/app/components/analytics";
import ErrorBoundary from "./ErrorBoundary";
import SubjectTab from "./SubjectTab";
import TopicRow from "./TopicRow";
import DailyDoseCard from "./DailyDoseCard";
import DailyDoseSection from "./DailyDoseSection";
import DailyDoseStreakBanner from "./DailyDoseStreakBanner";
import ContinueLearning from "./ContinueLearning";
import ContinuePractice from "./ContinuePractice";
import DetailsPanel from "./details/DetailsPanel";
import RoadmapNav from "./RoadmapNav";
import PracticeTopicRow from "./PracticeTopicRow";

export type Mode = "learn" | "practice" | "pyq" | "daily-dose";
import PyqPapersList from "./PyqPapersList";
import ModeProgressBar from "./ModeProgressBar";
import { useProgressContext } from "../lib/ProgressContext";
import { useTopicExpandState } from "../lib/useTopicExpandState";
import { usePracticeMasterySummary } from "../lib/usePracticeMasterySummary";
import { usePyqSolvedSummary } from "../lib/usePyqSolvedSummary";
import { getPracticeSubject } from "@/constants/practiceChapters";
import type { PyqPaperSummary } from "../models/pyq";

export default function RoadmapContent({
  subjects,
  allDescriptions,
  allResources,
  allFaqs,
  initialNode = null,
  initialExpandedTopicId = null,
  initialMode = "learn",
  initialPapers = null,
}: {
  subjects: Node[];
  allDescriptions: Description[];
  allResources: Resource[];
  allFaqs: FaqType[];
  initialNode?: Node | null;
  initialExpandedTopicId?: number | null;
  initialMode?: Mode;
  initialPapers?: PyqPaperSummary[] | null;
}) {
  const allTopics = useMemo(() => subjects.flatMap((s) => s.children ?? []), [subjects]);

  const [activeSubjectId, setActiveSubjectId] = useState<number>(() => {
    const anchorId = initialExpandedTopicId ?? initialNode?.id;
    if (anchorId != null) {
      const subject = subjects.find((s) =>
        s.children?.some(
          (t) => t.id === anchorId || t.children?.some((st) => st.id === anchorId)
        )
      );
      if (subject) return subject.id;
    }
    return subjects[0]?.id ?? 2;
  });
  const [selected, setSelected] = useState<Node | null>(initialNode);
  // tracks the "URL-active" topic for replaceState when no subtopic panel is open
  const [activeTopicId, setActiveTopicId] = useState<number | null>(initialExpandedTopicId);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mode] = useState<Mode>(initialMode);
  const [openPracticeTopics, setOpenPracticeTopics] = useState<Record<string, boolean>>({});
  const [pyqPapers, setPyqPapers] = useState<PyqPaperSummary[] | null>(initialPapers ?? null);
  // ref-based guard prevents duplicate fetches without a synchronous setState in the effect body
  const pyqFetchStarted = useRef(initialPapers != null);

  const { progress, isLoggedIn } = useProgressContext();
  const { isOpen, toggle } = useTopicExpandState(subjects, initialExpandedTopicId);
  const practiceMastery = usePracticeMasterySummary();
  const pyqSolved = usePyqSolvedSummary(mode === "pyq");

  useEffect(() => {
    if (mode !== "pyq" || pyqFetchStarted.current) return;
    pyqFetchStarted.current = true;
    fetch("/api/pyq/papers")
      .then((r) => r.json())
      .then((data: PyqPaperSummary[]) => setPyqPapers(data))
      .catch(() => setPyqPapers([]));
  }, [mode]);

  const handleSelectNode = useCallback(
    (node: Node) => {
      setSelected(node);
      if (node.type === "SUBTOPIC" && node.parent_id != null) {
        setActiveTopicId(node.parent_id);
      } else if (node.type === "TOPIC") {
        setActiveTopicId(node.id);
      }
    },
    []
  );
  const landedFired = useRef(false);

  useEffect(() => {
    if (landedFired.current) return;
    landedFired.current = true;
    trackEvent("cat_prep_landed", { auth_state: isLoggedIn ? "signed_in" : "signed_out" });
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (mode !== "learn") return;
    let url = "/cat-prep";
    if (selected?.type === "SUBTOPIC" && selected.parent_id != null) {
      const parent = allTopics.find((t) => t.id === selected.parent_id);
      if (parent) url = `/cat-prep/${toSlug(parent.title)}/${toSlug(selected.title)}`;
    } else if (selected?.type === "TOPIC") {
      url = `/cat-prep/${toSlug(selected.title)}`;
    } else if (activeTopicId != null) {
      const topic = allTopics.find((t) => t.id === activeTopicId);
      if (topic) url = `/cat-prep/${toSlug(topic.title)}`;
    }
    window.history.replaceState(null, "", url);
  }, [mode, selected, activeTopicId, allTopics]);

  const activeSubject = subjects.find((s) => s.id === activeSubjectId);
  const meta = SUBJECT_META[activeSubjectId];

  const { totalSubs, doneSubs } = useMemo(() => {
    const allSubs = subjects.flatMap((s) => (s.children ?? []).flatMap((t) => t.children ?? []));
    const done = allSubs.filter(
      (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
    ).length;
    return { totalSubs: allSubs.length, doneSubs: done };
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
            CAT
          </div>
          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(24px,4vw,36px)", margin: "0 0 6px", letterSpacing: "-0.5px" }}
          >
            {mode === "learn"
              ? "CAT Preparation Roadmap"
              : mode === "practice"
              ? "CAT Practice"
              : mode === "daily-dose"
              ? "Your Daily Dose"
              : "CAT Previous Year Papers"}
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 16px" }}>
            {mode === "learn"
              ? "Follow structured learning paths across all three sections"
              : mode === "practice"
              ? "Topic-wise practice questions across VARC, DILR and Quant"
              : mode === "daily-dose"
              ? "One essay, one challenge — a small daily habit that compounds."
              : "Every official CAT paper from 1990 to 2025, in one place."}
          </p>

          {meta && activeSubject && <RoadmapNav />}

          {/* Overall progress bar — contextual to the active mode */}
          {mode === "daily-dose" ? (
            <DailyDoseStreakBanner />
          ) : mode === "learn" ? (
            <ModeProgressBar
              current={doneSubs}
              total={totalSubs}
              label="subtopics"
              infoText="Counts subtopics you've marked complete in Learn mode."
            />
          ) : mode === "practice" ? (
            <ModeProgressBar
              current={practiceMastery.done}
              total={practiceMastery.total}
              label="subtopics practiced"
              infoText="A subtopic counts once you've attempted every question in it — 20 for a Quant chapter, 4 for a DILR set or RC passage."
            />
          ) : (
            <ModeProgressBar
              current={pyqSolved.solved}
              total={pyqSolved.target}
              label="PYQ solved"
              infoText="~20 official questions gives solid hands-on exposure to the real CAT format. Both Practice and Mock Test answers count."
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1"
        style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "32px 24px" }}
      >
        {/* Continue Learning strip */}
        {mode === "learn" && (
          <ContinueLearning subjects={subjects} progress={progress} onSelectNode={handleSelectNode} />
        )}

        {/* Daily Dose promo — surfaces the section from the Learn home */}
        {mode === "learn" && <DailyDoseCard />}

        {/* Continue Practice strip */}
        {mode === "practice" && <ContinuePractice />}

        {/* Subject tabs — hidden in PYQ & Daily Dose (not organized by subject) */}
        {mode !== "pyq" && mode !== "daily-dose" && (
          <div className="flex gap-2.5 mb-7 flex-wrap">
            {subjects.map((subject) => {
              const subMeta = SUBJECT_META[subject.id];
              if (!subMeta) return null;
              return (
                <SubjectTab
                  key={subject.id}
                  subject={subject}
                  isActive={activeSubjectId === subject.id}
                  onClick={() => {
                    setActiveSubjectId(subject.id);
                    setSelected(null);
                    setActiveTopicId(null);
                    trackEvent("subject_tab_changed", { subject: subMeta.abbr });
                  }}
                  progress={progress}
                  meta={subMeta}
                />
              );
            })}
          </div>
        )}

        {/* Main content area — switches on mode */}
        <ErrorBoundary>
          {mode === "daily-dose" ? (
            <DailyDoseSection />
          ) : mode === "pyq" ? (
            pyqPapers === null ? (
              <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading papers…</p>
            ) : (
              <>
                {/* Stat strip */}
                <div
                  className="flex gap-8 flex-wrap"
                  style={{
                    marginBottom: 24,
                    paddingBottom: 20,
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  {[
                    { value: pyqPapers.length, label: "past papers" },
                    { value: "1990–2025", label: "years covered" },
                    { value: "VARC · DILR · QA", label: "sections per paper" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-extrabold text-trust-navy" style={{ fontSize: 22, lineHeight: 1 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mode explanation cards */}
                <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                  <div
                    style={{ flex: 1, minWidth: 200, background: "#EEF2FF", borderRadius: 12, padding: "14px 16px" }}
                  >
                    <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 4 }}>
                      Practice mode
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
                      Work through a paper at your own pace. Each question reveals the answer and explanation after
                      you respond — good for targeted revision.
                    </p>
                  </div>
                  <div
                    style={{ flex: 1, minWidth: 200, background: "#F0FDFA", borderRadius: 12, padding: "14px 16px" }}
                  >
                    <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 4 }}>
                      Mock test mode
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
                      Sit the full paper under timed exam conditions — three sections (VARC → DILR → QA), no
                      peeking at answers until the end. One attempt per paper.
                    </p>
                  </div>
                </div>

                {/* Paper list */}
                <PyqPapersList papers={pyqPapers} />

                {/* Why solve section */}
                <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #E2E8F0" }}>
                  <h2
                    className="font-extrabold text-trust-navy"
                    style={{ fontSize: 20, margin: "0 0 8px", letterSpacing: "-0.3px" }}
                  >
                    Why solve CAT previous year papers?
                  </h2>
                  <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.6 }}>
                    Coaching material prepares you for the syllabus. PYQs prepare you for the exam. There is a
                    difference — and most toppers credit solving past papers as the single highest-leverage activity
                    in their preparation.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {[
                      {
                        title: "See the real difficulty",
                        body: "The CAT question style is distinctly different from coaching material. Only official papers show you what the exam makers actually value.",
                      },
                      {
                        title: "Spot year-to-year patterns",
                        body: "Topic weightage, question types, and difficulty shift across years. Solving a range of papers reveals the trends worth betting on.",
                      },
                      {
                        title: "Build exam stamina",
                        body: "Sitting a timed 2-hour paper trains focus and pacing in a way topic drills cannot. Stamina is a skill — it needs practice.",
                      },
                      {
                        title: "Benchmark yourself",
                        body: "A mock test score maps to a real percentile band. Know where you stand months before the exam, while there is still time to course-correct.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        style={{
                          background: "#F8FAFC",
                          borderRadius: 12,
                          padding: "16px 16px",
                          borderLeft: "3px solid #14B8A6",
                        }}
                      >
                        <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 6 }}>
                          {item.title}
                        </div>
                        <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : mode === "learn" ? (
            <div>
              {activeSubject?.children
                ?.slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map((topic) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    isOpen={isOpen(topic.id)}
                    onToggle={() => {
                      const willClose = isOpen(topic.id);
                      toggle(topic.id);
                      if (!willClose) {
                        setActiveTopicId(topic.id);
                      } else if (activeTopicId === topic.id) {
                        setActiveTopicId(null);
                      }
                      setSelected(null);
                    }}
                    onSelectNode={(node) => {
                      handleSelectNode(node);
                      trackEvent("subtopic_clicked", {
                        subtopic_id: String(node.id),
                        subtopic_name: node.title,
                        topic_id: String(topic.id),
                        subject: meta?.abbr ?? "",
                      });
                    }}
                    selectedId={selected?.id ?? null}
                    progress={progress}
                    accentColor={meta?.color ?? "#1E3A5F"}
                    chipColor={meta?.chip ?? "#566B87"}
                  />
                ))}
            </div>
          ) : (
            <div>
              {getPracticeSubject(activeSubjectId)?.topics.map((topic) => (
                <PracticeTopicRow
                  key={topic.slug}
                  topic={topic}
                  section={meta?.abbr === "QA" ? "Quant" : meta?.abbr ?? "Quant"}
                  accentColor={meta?.color ?? "#1E3A5F"}
                  chipColor={meta?.chip ?? "#566B87"}
                  isOpen={openPracticeTopics[topic.slug] ?? false}
                  onToggle={() =>
                    setOpenPracticeTopics((prev) => ({
                      ...prev,
                      [topic.slug]: !prev[topic.slug],
                    }))
                  }
                />
              ))}
              {!getPracticeSubject(activeSubjectId) && (
                <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 8 }}>
                  Practice questions coming soon for this section.
                </p>
              )}
            </div>
          )}
        </ErrorBoundary>

        {/* Community feedback */}
        <div
          style={{
            marginTop: 48,
            borderRadius: 16,
            background: "linear-gradient(135deg, #1E3A5F 0%, #0F766E 100%)",
            padding: "28px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="font-extrabold" style={{ fontSize: 18, color: "#fff", margin: "0 0 4px" }}>
              Got feedback or found an issue?
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
              Share what&apos;s working, what&apos;s broken, or what you wish existed.
            </p>
          </div>
          <a
            href="https://t.me/studynaksha"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold flex-shrink-0"
            style={{
              display: "inline-block",
              padding: "11px 22px",
              borderRadius: 8,
              background: "#fff",
              color: "#1E3A5F",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Join on Telegram →
          </a>
        </div>

        {/* FAQ */}
        <div
          style={{
            marginTop: 24,
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
