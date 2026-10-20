// RoadmapContent — client-side roadmap UI; receives pre-built tree data from server page
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
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
import ContinueLearning from "./ContinueLearning";
import ContinuePractice from "./ContinuePractice";
import DetailsPanel from "./details/DetailsPanel";
import PracticeTopicRow from "./PracticeTopicRow";

import PyqPapersList from "./PyqPapersList";
import { useProgressContext } from "../lib/ProgressContext";
import { useTopicExpandState } from "../lib/useTopicExpandState";
import { usePracticeMasterySummary } from "../lib/usePracticeMasterySummary";
import { usePyqSolvedSummary } from "../lib/usePyqSolvedSummary";
import {
  getPracticeSubject,
  RC_CHAPTER_SLUG,
  type PracticeSubject,
} from "@/constants/practiceChapters";
import { TREE_LAYOUT, type TreeLayout } from "../lib/treeLayout";
import { useScrollReveal } from "@/app/lib/useScrollReveal";
import { PYQ_YEARS_COVERED } from "@/constants/pyqPapers";
import type { PyqPaperSummary } from "../models/pyq";
import type { Mode } from "../models/mode";
import RoadmapHero from "./RoadmapHero";

export type { Mode };

/** Both layouts arrive as they are scrolled to; each has its own motion in globals.css. */
const ROW_SELECTOR = ".topic-list > .topic-row";

/**
 * Practice is a catalogue — a topic holds chapters you can drill in any order — so it reads
 * as containment and is fixed to the nested layout, whatever Learn happens to be set to.
 * A route would be a lie about it, and the route layout also reserves a gutter and a station
 * disc that these rows never fill.
 */
const PRACTICE_LAYOUT: TreeLayout = "tree";

/** The first chapter of a practice subject, with the route that opens it. */
function firstChapterOf(subject: PracticeSubject | undefined) {
  if (!subject) return null;
  for (const topic of subject.topics) {
    const chapter = topic.chapters[0];
    if (!chapter) continue;
    const href =
      subject.section === "Quant"
        ? `/cat-prep/practice/quant/${topic.slug}/${chapter.slug}`
        : subject.section === "DILR"
          ? `/cat-prep/practice/dilr/${chapter.slug}/1`
          : chapter.slug === RC_CHAPTER_SLUG
            ? `/cat-prep/practice/varc/${RC_CHAPTER_SLUG}/1`
            : `/cat-prep/practice/varc/${chapter.slug}`;
    return { name: chapter.name, questionCount: chapter.questionCount, href };
  }
  return null;
}

export default function RoadmapContent({
  subjects,
  allDescriptions,
  allResources,
  allFaqs,
  initialNode = null,
  initialExpandedTopicId = null,
  initialMode = "learn",
  initialPapers = null,
  beforeFooter = null,
}: {
  subjects: Node[];
  allDescriptions: Description[];
  allResources: Resource[];
  allFaqs: FaqType[];
  initialNode?: Node | null;
  initialExpandedTopicId?: number | null;
  initialMode?: Mode;
  initialPapers?: PyqPaperSummary[] | null;
  /** Server-rendered page content placed just above the footer. */
  beforeFooter?: ReactNode;
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
  // Never setState-d: this is a per-route constant, not state.
  const mode = initialMode;
  const [openPracticeTopics, setOpenPracticeTopics] = useState<Record<string, boolean>>({});
  /*
   * Papers are server-rendered. There used to be a client fetch of /api/pyq/papers behind a
   * ref guard, but the only route that renders this mode awaits the papers and passes them,
   * so the guard was always true and the fetch never ran. The "Loading papers" branch and
   * its catch were unreachable with it.
   */
  const pyqPapers = initialPapers ?? [];

  const { progress, isLoggedIn } = useProgressContext();
  const { isOpen, toggle } = useTopicExpandState(subjects, initialExpandedTopicId);
  const practiceMastery = usePracticeMasterySummary();
  const pyqSolved = usePyqSolvedSummary(mode === "pyq");

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

  /*
   * The route builds itself as it is scrolled into view. The reset key re-observes when
   * the list remounts under a new subject, which it does on every tab switch — without
   * it the new subject would inherit the previous one as a set of unobserved rows and
   * never animate.
   */
  useScrollReveal({
    selector: ROW_SELECTOR,
    resetKey: mode + ":" + activeSubjectId,
  });

  /*
   * The tabs sit above both Learn and Practice and have to measure whichever surface they
   * are on. Learn counts syllabus subtopics marked complete; Practice counts units — a
   * Quant chapter, a DILR set, an RC passage — fully attempted.
   */
  const subjectPercent = useCallback(
    (subject: Node): number => {
      if (mode === "practice") {
        const section = getPracticeSubject(subject.id)?.section;
        const tally = section ? practiceMastery.bySection[section] : undefined;
        if (!tally || tally.total === 0) return 0;
        return Math.round((tally.done / tally.total) * 100);
      }
      const subs = (subject.children ?? []).flatMap((t) => t.children ?? []);
      if (subs.length === 0) return 0;
      const read = subs.filter(
        (n) => (progress[n.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
      ).length;
      return Math.round((read / subs.length) * 100);
    },
    [mode, practiceMastery, progress]
  );

  const practiceSubject = getPracticeSubject(activeSubjectId);

  /** The first chapter of the active practice subject, for the first-run prompt. */
  const firstPracticeChapter = firstChapterOf(practiceSubject);

  const activeSubject = subjects.find((s) => s.id === activeSubjectId);
  const meta = SUBJECT_META[activeSubjectId];

  const { totalSubs, doneSubs } = useMemo(() => {
    const allSubs = subjects.flatMap((s) => (s.children ?? []).flatMap((t) => t.children ?? []));
    const done = allSubs.filter(
      (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
    ).length;
    return { totalSubs: allSubs.length, doneSubs: done };
  }, [subjects, progress]);

  // First subtopic of the active subject, in order_index order — the roadmap's own idea of
  // "the beginning", not merely the first element in the file.
  const firstSubtopic = useMemo(() => {
    const topics = [...(activeSubject?.children ?? [])].sort(
      (a, b) => a.order_index - b.order_index
    );
    for (const topic of topics) {
      const subs = [...(topic.children ?? [])].sort((a, b) => a.order_index - b.order_index);
      if (subs.length > 0) return subs[0];
    }
    return null;
  }, [activeSubject]);

  const lessonCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const r of allResources) {
      counts[r.parent_id] = (counts[r.parent_id] ?? 0) + (r.items?.length ?? 1);
    }
    return counts;
  }, [allResources]);

  const faqSlice = allFaqs.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <Header />

      <RoadmapHero
        mode={mode}
        showNav={Boolean(meta && activeSubject)}
        learn={{ done: doneSubs, total: totalSubs }}
        practice={{ done: practiceMastery.done, total: practiceMastery.total }}
        pyq={{ solved: pyqSolved.solved, target: pyqSolved.target }}
      />

      {/* Main content */}
      <div
        className="flex-1"
        style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "32px 24px" }}
      >
        {/* Continue Learning strip */}
        {mode === "learn" && (
          <ContinueLearning subjects={subjects} progress={progress} onSelectNode={handleSelectNode} />
        )}

        {/*
          First-run guidance. A visitor with no progress previously landed on eleven
          collapsed rows and a 0/61 bar, with nothing indicating where to begin — the most
          common thing a new reader needs and the one thing the page did not say. It
          disappears the moment they have ticked anything, so it never nags a returning user.
        */}
        {mode === "learn" && doneSubs === 0 && firstSubtopic && (
          <div className="start-here">
            <div>
              <p className="ed-kicker" style={{ margin: "0 0 8px" }}>
                New here
              </p>
              <p className="display start-here__title">
                Start with {firstSubtopic.title}
              </p>
              <p className="start-here__sub">
                The syllabus is ordered, so working top to bottom is a reasonable plan. You
                do not need an account to read anything.
              </p>
            </div>
            <button
              type="button"
              className="ed-btn"
              data-weight="primary"
              onClick={() => handleSelectNode(firstSubtopic)}
            >
              Open it
            </button>
          </div>
        )}

        {/*
          The same first-run guidance Learn gets, on the same condition. Practice had none:
          a visitor arriving with nothing attempted met collapsed rows and a 0/95 bar, and
          on DILR and VARC the whole surface is a single collapsed row whose label repeats
          the tab they just pressed.
        */}
        {mode === "practice" && practiceMastery.done === 0 && firstPracticeChapter && (
          <div className="start-here">
            <div>
              <p className="ed-kicker" style={{ margin: "0 0 8px" }}>
                New here
              </p>
              <p className="display start-here__title">
                Start with {firstPracticeChapter.name}
              </p>
              <p className="start-here__sub">
                {firstPracticeChapter.questionCount} questions, with the answer and a worked
                explanation after each one. Nothing here needs an account.
              </p>
            </div>
            <Link className="ed-btn" data-weight="primary" href={firstPracticeChapter.href}>
              Open it
            </Link>
          </div>
        )}

        {/* Daily Dose promo — surfaces the section from the Learn home */}
        {mode === "learn" && <DailyDoseCard />}

        {/* Continue Practice strip */}
        {mode === "practice" && <ContinuePractice />}

        {/* Subject tabs — hidden in PYQ & Daily Dose (not organized by subject) */}
        {mode !== "pyq" && mode !== "daily-dose" && (
          <div className="subject-tabs">
            {subjects.map((subject) => {
              const subMeta = SUBJECT_META[subject.id];
              if (!subMeta) return null;
              return (
                <SubjectTab
                  key={subject.id}
                  isActive={activeSubjectId === subject.id}
                  onClick={() => {
                    setActiveSubjectId(subject.id);
                    setSelected(null);
                    setActiveTopicId(null);
                    trackEvent("subject_tab_changed", { subject: subMeta.abbr });
                  }}
                  percent={subjectPercent(subject)}
                  measure={mode === "practice" ? "practised" : "read"}
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
            (
              <>
                {/* Stat strip */}
                <div
                  className="flex gap-8 flex-wrap"
                  style={{
                    marginBottom: 24,
                    paddingBottom: 20,
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  {[
                    { value: pyqPapers.length, label: "past papers" },
                    // Was the literal "1990–2025" labelled "years covered", which claimed 36
                    // years for a set holding 24 — 1992–1995 and 2009–2016 have no paper. Derived
                    // now, so it also cannot go stale the day a 2026 paper lands.
                    { value: PYQ_YEARS_COVERED.length, label: "exam years" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-extrabold" style={{ fontSize: 22, lineHeight: 1 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/*
                  Two cards used to sit here explaining, in two four-line paragraphs, exactly
                  what the two controls on every row already say. One line does it, and the
                  list starts higher up the page for it.
                */}
                <p className="pyq-modes">
                  Open a paper to work through it at your own pace with answers and
                  explanations, or sit it as a timed mock under exam conditions.
                </p>

                {/* Paper list */}
                <PyqPapersList papers={pyqPapers} solvedByPaper={pyqSolved.byPaper} />

                {/* Why solve section */}
                <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--rule)" }}>
                  <h2
                    className="font-extrabold"
                    style={{ fontSize: 20, margin: "0 0 8px", letterSpacing: "-0.3px" }}
                  >
                    Why solve CAT previous year papers?
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 24px", lineHeight: 1.6 }}>
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
                          background: "var(--paper-sunk)",
                          padding: "16px 16px",
                          borderLeft: "3px solid var(--accent)",
                        }}
                      >
                        <div className="font-bold" style={{ fontSize: 13, marginBottom: 6 }}>
                          {item.title}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.55 }}>{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : mode === "learn" ? (
            // Keyed on the subject so switching tabs remounts the list and the crossfade
            // replays — otherwise the rows swap contents in place with no transition.
            <div className="topic-list" data-layout={TREE_LAYOUT} key={activeSubjectId}>
              {activeSubject?.children
                ?.slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map((topic, ti, arr) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    lessonCounts={lessonCounts}
                    station={ti + 1}
                    isLastTopic={ti === arr.length - 1}
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
                  />
                ))}
            </div>
          ) : !practiceSubject ? (
            <p className="ed-empty">No practice sets for this subject yet.</p>
          ) : (
            <div className="topic-list" data-layout={PRACTICE_LAYOUT} key={activeSubjectId}>
              {practiceSubject.topics.map((topic, ti) => (
                <PracticeTopicRow
                  key={topic.slug}
                  index={ti}
                  topic={topic}
                  summary={practiceMastery}
                  section={practiceSubject.section}
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
                <p style={{ color: "var(--ink-faint)", fontSize: 14, marginTop: 8 }}>
                  Practice questions coming soon for this section.
                </p>
              )}
            </div>
          )}
        </ErrorBoundary>

        {/* Community feedback */}
        <div
          className="ed-invert"
          style={{
            marginTop: 48,
            padding: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="display" style={{ fontSize: 22, color: "var(--paper)", margin: "0 0 6px" }}>
              Got feedback or found an issue?
            </p>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Share what&apos;s working, what&apos;s broken, or what you wish existed.
            </p>
          </div>
          <a
            href="https://t.me/studynaksha"
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn"
            style={{ background: "var(--accent-bright)", color: "var(--ink)", flexShrink: 0 }}
          >
            Join on Telegram →
          </a>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 44, borderTop: "3px solid var(--ink)", paddingTop: 18 }}>
          <p className="ed-kicker" style={{ margin: "0 0 10px" }}>
            Before you ask
          </p>
          <h3 className="display" style={{ fontSize: 28, color: "var(--ink)", margin: "0 0 20px" }}>
            Questions about CAT preparation
          </h3>
          <div>
            {faqSlice.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.id} className="ed-row">
                  <h4 style={{ margin: 0 }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 14,
                        padding: "16px 4px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          fontSize: 19,
                          lineHeight: 1,
                          fontWeight: 400,
                          color: "var(--ink-faint)",
                        }}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h4>
                  {/* Grid collapse: the old max-height 200px cap clipped longer answers. */}
                  <div className="ed-collapse" data-open={isOpen}>
                    <div>
                      <p
                        style={{
                          padding: "0 4px 18px",
                          fontSize: 15,
                          color: "var(--ink-soft)",
                          lineHeight: 1.7,
                          margin: 0,
                          maxWidth: "68ch",
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page-specific content, above the footer. Server-rendered by the route and passed
          through as a slot — this component owns <Footer />, so anything a page renders
          as a sibling of <RoadmapContent> lands below it. */}
      {beforeFooter}

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
