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

export function buildNodePageMeta(nodeId: number): NodePageMeta | null {
  const node = findNodeById(nodeId);
  if (!node || node.type === "SUBJECT") return null;

  const parent = node.parent_id != null ? findNodeById(node.parent_id) : undefined;
  const grandparent = parent?.parent_id != null ? findNodeById(parent.parent_id) : undefined;

  let title: string;
  if (node.type === "SUBTOPIC" && parent && grandparent?.type === "SUBJECT") {
    title = `${node.title} — ${parent.title} (${grandparent.title}) for CAT`;
  } else if (node.type === "SUBTOPIC" && parent) {
    title = `${node.title} — ${parent.title} for CAT`;
  } else {
    title = `${node.title} for CAT`;
  }

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
