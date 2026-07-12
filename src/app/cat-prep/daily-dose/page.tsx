import type { Metadata } from "next";
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

const TITLE = "Daily Dose — Daily Essay & Daily Challenge | StudyNaksha";
const DESCRIPTION =
  "Your daily CAT habit in one place: read today's Aeon essay for VARC and take a timed Daily Challenge. Build a streak and stay exam-warm.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function DailyDosePage() {
  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  return (
    <ProgressProvider>
      <RoadmapContent
        subjects={subjects}
        allDescriptions={descriptions as Description[]}
        allResources={ALL_RESOURCES}
        allFaqs={faqs as FaqType[]}
        initialMode="daily-dose"
      />
    </ProgressProvider>
  );
}
