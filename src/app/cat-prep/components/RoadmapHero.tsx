// RoadmapHero — the banner above every roadmap surface: title, nav, and the mode's progress
import RoadmapNav from "./RoadmapNav";
import ModeProgressBar from "./ModeProgressBar";
import DailyDoseStreakBanner from "./DailyDoseStreakBanner";
import type { Mode } from "../models/mode";
import { HOME_COUNTS, PYQ_YEAR_RANGE } from "@/app/lib/homeCounts";

/**
 * Copy per mode, as data. This replaced two parallel four-branch ternaries inline in the
 * markup — the kind of repeated conditional the no-magic-strings rule exists to prevent,
 * and the reason adding a fifth surface previously meant editing two expressions in two
 * places and hoping they stayed aligned.
 */
const MODE_COPY: Record<Mode, { title: string; subtitle: string }> = {
  learn: {
    title: "CAT Preparation Roadmap",
    subtitle: "Follow structured learning paths across all three sections",
  },
  practice: {
    title: "CAT Practice",
    subtitle: "Topic-wise practice questions across VARC, DILR and Quant",
  },
  "daily-dose": {
    title: "Your Daily Dose",
    subtitle: "One essay, one challenge — a small daily habit that compounds.",
  },
  pyq: {
    title: "CAT Previous Year Papers",
    // Was "Every official CAT paper from 1990 to 2025", which is not true: there are 39
    // papers covering 24 years, with 1992-95 and 2009-16 absent. The count is derived so
    // it cannot drift from the data the page lists.
    subtitle: `${HOME_COUNTS.pyqPapers} official papers, ${PYQ_YEAR_RANGE}. Read one with full solutions, or sit it timed.`,
  },
};

export type RoadmapHeroProps = {
  mode: Mode;
  /** The nav only renders once a subject is resolved, as it did before the extraction. */
  showNav: boolean;
  learn: { done: number; total: number };
  practice: { done: number; total: number };
  pyq: { solved: number; target: number };
};

export default function RoadmapHero({ mode, showNav, learn, practice, pyq }: RoadmapHeroProps) {
  const copy = MODE_COPY[mode];

  return (
    <>
      <div className="roadmap-hero">
        <div className="roadmap-hero__inner">
          <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
            CAT preparation
          </p>
          <h1 className="display roadmap-hero__title">{copy.title}</h1>
          <p className="roadmap-hero__subtitle">{copy.subtitle}</p>

          {/* Overall progress — contextual to the active mode. */}
          <div className="roadmap-hero__progress">
        {mode === "daily-dose" ? (
          <DailyDoseStreakBanner />
        ) : mode === "learn" ? (
          <ModeProgressBar
            current={learn.done}
            total={learn.total}
            label="subtopics"
            infoText="Counts subtopics you've marked complete in Learn mode."
          />
        ) : mode === "practice" ? (
          <ModeProgressBar
            current={practice.done}
            total={practice.total}
            label="subtopics practiced"
            infoText="A subtopic counts once you've attempted every question in it — 20 for a Quant chapter, 4 for a DILR set or RC passage."
          />
        ) : (
          <ModeProgressBar
            current={pyq.solved}
            total={pyq.target}
            label="PYQ solved"
            infoText="~20 official questions gives solid hands-on exposure to the real CAT format. Both Practice and Mock Test answers count."
          />
        )}
          </div>
        </div>
      </div>

      {/*
        Sticky surface switcher, a SIBLING of the hero rather than a child of it: a sticky
        element only sticks within its parent's box, so nested in the hero it unpinned the
        moment the hero scrolled past. Here the parent is the page root, so it stays under
        the masthead the whole way down — previously the only way back to Practice or Past
        papers from deep in a surface was scrolling to the top.
      */}
      {showNav && (
        <div className="roadmap-navbar">
          <div className="roadmap-navbar__inner">
            <RoadmapNav />
          </div>
        </div>
      )}
    </>
  );
}
