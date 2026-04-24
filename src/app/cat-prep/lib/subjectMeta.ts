// subjectMeta — colour/label metadata for CAT subject nodes keyed by node id
export type SubjectMeta = {
  abbr: string;
  label: string;
  color: string;
  light: string;
};

export const SUBJECT_META: Record<number, SubjectMeta> = {
  // keyed by node id (matches data.json: QA=2, DILR=3, VARC=4)
  2: {
    abbr: "QA",
    label: "Quantitative Aptitude",
    color: "#1E3A5F",
    light: "#EEF2FF",
  },
  3: {
    abbr: "DILR",
    label: "Data Interpretation & Logical Reasoning",
    color: "#0F766E",
    light: "#F0FDFA",
  },
  4: {
    abbr: "VARC",
    label: "Verbal Ability & Reading Comprehension",
    color: "#92400E",
    light: "#FFFBEB",
  },
};

/** Reverse lookup: abbr string → SubjectMeta (e.g. "QA" → QA meta) */
export const SUBJECT_META_BY_ABBR: Record<string, SubjectMeta> = Object.values(
  SUBJECT_META
).reduce<Record<string, SubjectMeta>>(
  (acc, meta) => ({ ...acc, [meta.abbr]: meta }),
  {}
);
