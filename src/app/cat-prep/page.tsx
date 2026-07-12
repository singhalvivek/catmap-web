import type { Metadata } from "next";
import data from "./data.json";
import descriptions from "./description.json";
import faqs from "./faq.json";

import { buildTree } from "./lib/buildTree";
import { ALL_RESOURCES } from "./lib/allResources";
import { Node } from "./models/node";
import { Description } from "./models/description";
import type { Faq as FaqType } from "./models/faq";

import { ProgressProvider } from "./lib/ProgressContext";
import RoadmapContent from "./components/RoadmapContent";
import { JsonLd } from "@/app/components/JsonLd";

const TITLE = "Free CAT Preparation Roadmap | StudyNaksha";
const DESCRIPTION =
  "A free, structured, distraction-free CAT prep roadmap built from the best open resources. Quant, DILR & VARC — no coaching fees.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function CatPrepPage() {
  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs as FaqType[]).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <ProgressProvider>
        <RoadmapContent
          subjects={subjects}
          allDescriptions={descriptions as Description[]}
          allResources={ALL_RESOURCES}
          allFaqs={faqs as FaqType[]}
        />
      </ProgressProvider>
    </>
  );
}
