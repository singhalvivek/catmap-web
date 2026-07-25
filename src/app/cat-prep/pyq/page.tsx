import type { Metadata } from "next";
import { ENV } from "@/config/env";
import data from "../data.json";
import descriptions from "../description.json";
import faqs from "../faq.json";

import { buildTree } from "../lib/buildTree";
import { ALL_RESOURCES } from "../lib/allResources";
import { Node } from "../models/node";
import { Description } from "../models/description";
import type { Faq as FaqType } from "../models/faq";

import { fetchPyqPapersIndex } from "@/lib/pyqQueries";
import { ProgressProvider } from "../lib/ProgressContext";
import RoadmapContent from "../components/RoadmapContent";

export const metadata: Metadata = {
  title: "CAT Previous Year Question Papers (PYQ) 1990–2025 | StudyNaksha",
  description:
    "Free CAT previous year question papers from 1990 to 2025 with detailed solutions. Practice question by question or attempt a full timed mock test. Covers VARC, DILR and Quant sections.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/pyq` },
};

export default async function PyqIndexPage() {
  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];
  const papers = await fetchPyqPapersIndex();

  return (
    <ProgressProvider>
      <RoadmapContent
        subjects={subjects}
        allDescriptions={descriptions as Description[]}
        allResources={ALL_RESOURCES}
        allFaqs={faqs as FaqType[]}
        initialMode="pyq"
        initialPapers={papers}
      />
    </ProgressProvider>
  );
}
