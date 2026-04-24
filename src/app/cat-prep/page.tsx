import data from "./data.json";
import descriptions from "./description.json";
import resources from "./resources.json";
import faqs from "./faq.json";

import { buildTree } from "./lib/buildTree";
import { Node } from "./models/node";
import { Description } from "./models/description";
import { Resource } from "./models/resource";
import type { Faq as FaqType } from "./models/faq";

import { ProgressProvider } from "./lib/ProgressContext";
import RoadmapContent from "./components/RoadmapContent";

export default function CatPrepPage() {
  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  return (
    <ProgressProvider>
      <RoadmapContent
        subjects={subjects}
        allDescriptions={descriptions as Description[]}
        allResources={resources as Resource[]}
        allFaqs={faqs as FaqType[]}
      />
    </ProgressProvider>
  );
}
