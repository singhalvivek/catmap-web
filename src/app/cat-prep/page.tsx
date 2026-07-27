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

// Deliberately different from the home page, which used to carry a byte-identical title
// and description: two of the site's most important URLs were competing for the same
// query and inviting Google to treat one as a duplicate of the other. The home page
// sells the idea; this page is the syllabus tree, so it targets the syllabus queries.
const TITLE = "Full CAT Syllabus & Study Roadmap | StudyNaksha";
const DESCRIPTION =
  "The full CAT syllabus as a structured roadmap: every Quant, DILR and VARC topic with curated video lessons, practice questions and previous-year papers. Free, no sign-up.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: { absolute: TITLE }, description: DESCRIPTION },
  twitter: { title: { absolute: TITLE }, description: DESCRIPTION },
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
