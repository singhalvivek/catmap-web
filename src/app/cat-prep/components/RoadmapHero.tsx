// RoadmapHero — the banner above every roadmap surface: title, nav, and the mode's progress
import RoadmapNav from "./RoadmapNav";
import ModeProgressBar from "./ModeProgressBar";
import DailyDoseStreakBanner from "./DailyDoseStreakBanner";
import type { Mode } from "../models/mode";

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
    subtitle: "Every official CAT paper from 1990 to 2025, in one place.",
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
    <div
      style={{
        background: "linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 100%)",
        padding: "36px 24px 40px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          className="font-semibold mb-1"
          style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.5px" }}
        >
          CAT
        </div>
        <h1
          className="font-extrabold text-trust-navy"
          style={{ fontSize: "clamp(24px,4vw,36px)", margin: "0 0 6px", letterSpacing: "-0.5px" }}
        >
          {copy.title}
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 16px" }}>{copy.subtitle}</p>

        {showNav && <RoadmapNav />}

        {/* Overall progress — contextual to the active mode. */}
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
  );
}
