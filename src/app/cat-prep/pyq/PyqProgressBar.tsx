// PyqProgressBar — client wrapper rendering the PYQ-solved progress bar (needs auth state, so can't be the server page)
"use client";

import ModeProgressBar from "../components/ModeProgressBar";
import { usePyqSolvedSummary } from "../lib/usePyqSolvedSummary";

export default function PyqProgressBar() {
  const { solved, target } = usePyqSolvedSummary();

  return (
    <ModeProgressBar
      current={solved}
      total={target}
      label="PYQ solved"
      infoText="Solving around 20 official CAT questions is generally enough hands-on exposure to prepare for the real format. Counts questions answered in both Practice and Mock Test mode."
    />
  );
}
