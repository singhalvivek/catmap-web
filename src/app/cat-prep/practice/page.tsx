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

import { ProgressProvider } from "../lib/ProgressContext";
import RoadmapContent from "../components/RoadmapContent";

export const metadata: Metadata = {
  title: "CAT Practice Questions | StudyNaksha",
  description:
    "Topic-wise CAT practice questions across VARC, DILR and Quant. Work through chapter-level drills to build mastery before tackling full PYQ papers.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/practice` },
};

export default function CatPracticePage() {
  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  return (
    <ProgressProvider>
      <RoadmapContent
        subjects={subjects}
        allDescriptions={descriptions as Description[]}
        allResources={ALL_RESOURCES}
        allFaqs={faqs as FaqType[]}
        initialMode="practice"
      />
    </ProgressProvider>
  );
}
