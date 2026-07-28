// nodeMetadata — slug helpers, SEO title/description builders, and shared schema.org schema factories
import data from "../data.json";
import descriptions from "../description.json";
import type { Node } from "../models/node";
import type { Description } from "../models/description";
import { ENV } from "@/config/env";

const allNodes = data as Node[];
const allDescs = descriptions as Description[];

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findNodeById(id: number): Node | undefined {
  return allNodes.find((n) => n.id === id);
}

export function findTopicBySlug(slug: string): Node | undefined {
  return allNodes.find((n) => n.type === "TOPIC" && toSlug(n.title) === slug);
}

export function findSubtopicBySlug(topicId: number, slug: string): Node | undefined {
  return allNodes.find(
    (n) => n.type === "SUBTOPIC" && n.parent_id === topicId && toSlug(n.title) === slug
  );
}

export type NodePageMeta = { title: string; description: string };

// Google renders roughly 60 characters of a title, and the layout template appends
// " | StudyNaksha" (14) to whatever is returned here.
const TITLE_BUDGET = 60 - " | StudyNaksha".length;

export function buildNodePageMeta(nodeId: number): NodePageMeta | null {
  const node = findNodeById(nodeId);
  if (!node || node.type === "SUBJECT") return null;

  const parent = node.parent_id != null ? findNodeById(node.parent_id) : undefined;

  // The subject name used to be interpolated into every subtopic title, producing
  // titles up to 137 characters — "… — Critical Reasoning (Verbal Ability and Reading
  // Comprehension) for CAT | StudyNaksha" — of which a searcher saw the first 60.
  // The node's own name is the part that distinguishes the page, so it leads, and the
  // parent is added only when it still fits.
  const base = `${node.title} for CAT`;
  const withParent = parent ? `${node.title} — ${parent.title} for CAT` : base;
  const title =
    node.type === "SUBTOPIC" && withParent.length <= TITLE_BUDGET ? withParent : base;

  const rawDesc = allDescs.find((d) => d.parent_id === nodeId)?.text;
  const description = rawDesc
    ? rawDesc.length > 130
      ? `${rawDesc.slice(0, 130)}... Free CAT prep resources on StudyNaksha.`
      : `${rawDesc} Free CAT prep resources on StudyNaksha.`
    : `Study ${node.title} for CAT on StudyNaksha. Curated resources and structured learning path — free.`;

  return { title, description };
}

export function buildLearningResourceSchema(
  name: string,
  description: string,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url,
    isAccessibleForFree: true,
    inLanguage: "en-IN",
    provider: { "@type": "Organization", name: "StudyNaksha", url: ENV.SITE_URL },
  };
}
