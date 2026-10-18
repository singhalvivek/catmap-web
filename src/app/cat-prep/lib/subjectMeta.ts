// subjectMeta — identity for each CAT subject node: label, abbreviation and visual treatment
//
// The old palette gave each subject a three-colour identity (QA navy, DILR teal, VARC amber,
// each with a light and a chip tint). The editorial language is ink plus one accent and has
// no slot for three competing hues — and one of them, DILR's #0F766E, is close enough to the
// brand accent to read as "correct" on a screen that also shows correctness.
//
// IDENTITY_MODE below selects how a subject is distinguished. The options are rendered and
// compared as pixels rather than argued as hex values; whichever is chosen applies to every
// consumer at once, so the identity cannot drift between SubjectTab, ProgressRing,
// SubtopicChip and the home page's roadmap plate.

export type SubjectIdentityMode = "retoned" | "ink" | "ring-only";

/**
 * "retoned"   — three identities kept, retoned into the editorial palette.
 * "ink"       — one ink identity; the subject is carried by its abbreviation and a rule
 *               weight instead of by hue.
 * "ring-only" — ink everywhere except the progress ring, which keeps a per-subject hue.
 *
 * Currently "ring-only", which is also what the three modes render identically today: the
 * only consumers converted so far (SubjectTab, ProgressRing) take `ring`, which is always
 * per-subject. The modes diverge in `chip` and `light`, consumed by SubtopicChip and the
 * selected-topic tints — all of which convert in phase 8. The choice is therefore made
 * there, against a screen where it is actually visible, rather than guessed here.
 */
export const IDENTITY_MODE: SubjectIdentityMode = "ring-only";

export type SubjectMeta = {
  abbr: string;
  label: string;
  /** Line and type colour for the subject when the mode uses one. */
  color: string;
  /** Page-ground tint for a selected subject. */
  light: string;
  /** Fill for subtopic and chapter chips belonging to this subject. */
  chip: string;
  /** Always per-subject, so "ring-only" has something to colour. */
  ring: string;
};

const INK = "#101a2b";
const PAPER_SUNK = "#f4efe3";
const INK_SOFT = "#35425a";

/**
 * Retoned hues. Each is measured at >= 4.5:1 on --paper so it can carry type, and they are
 * separated by more than luminance so they survive greyscale and print.
 */
const RETONED = {
  qa: { color: "#1f3f6b", light: "#eef1f7", chip: "#3d5a84" },
  dilr: { color: "#0a675f", light: "#e9f2f0", chip: "#2f7f78" },
  varc: { color: "#8a5200", light: "#faf0da", chip: "#a2702c" },
} as const;

function treatment(key: keyof typeof RETONED) {
  const retoned = RETONED[key];
  if (IDENTITY_MODE === "retoned") return retoned;
  if (IDENTITY_MODE === "ring-only") {
    return { color: INK, light: PAPER_SUNK, chip: INK_SOFT };
  }
  return { color: INK, light: PAPER_SUNK, chip: INK_SOFT };
}

export const SUBJECT_META: Record<number, SubjectMeta> = {
  // keyed by node id (matches data.json: QA=2, DILR=3, VARC=4)
  2: {
    abbr: "QA",
    label: "Quantitative Aptitude",
    ring: RETONED.qa.color,
    ...treatment("qa"),
  },
  3: {
    abbr: "DILR",
    label: "Data Interpretation & Logical Reasoning",
    ring: RETONED.dilr.color,
    ...treatment("dilr"),
  },
  4: {
    abbr: "VARC",
    label: "Verbal Ability & Reading Comprehension",
    ring: RETONED.varc.color,
    ...treatment("varc"),
  },
};

/** Reverse lookup: abbr string → SubjectMeta (e.g. "QA" → QA meta) */
export const SUBJECT_META_BY_ABBR: Record<string, SubjectMeta> = Object.values(
  SUBJECT_META
).reduce<Record<string, SubjectMeta>>(
  (acc, meta) => ({ ...acc, [meta.abbr]: meta }),
  {}
);
