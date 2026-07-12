import { notFound } from "next/navigation";
import type { Metadata } from "next";
import data from "../../data.json";
import descriptions from "../../description.json";
import faqs from "../../faq.json";
import { buildTree } from "../../lib/buildTree";
import { ALL_RESOURCES } from "../../lib/allResources";
import { findTopicBySlug, findSubtopicBySlug, buildNodePageMeta, toSlug, buildLearningResourceSchema } from "../../lib/nodeMetadata";
import { Node } from "../../models/node";
import { Description } from "../../models/description";
import type { Faq as FaqType } from "../../models/faq";
import { ProgressProvider } from "../../lib/ProgressContext";
import RoadmapContent from "../../components/RoadmapContent";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";

type Props = { params: Promise<{ topic: string; subtopic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, subtopic } = await params;
  const topicNode = findTopicBySlug(topic);
  if (!topicNode) return { title: "CAT Prep | StudyNaksha" };
  const subtopicNode = findSubtopicBySlug(topicNode.id, subtopic);
  if (!subtopicNode) return { title: "CAT Prep | StudyNaksha" };
  const meta = buildNodePageMeta(subtopicNode.id);
  if (!meta) return { title: "CAT Prep | StudyNaksha" };
  const canonical = `${ENV.SITE_URL}/cat-prep/${toSlug(topicNode.title)}/${toSlug(subtopicNode.title)}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function SubtopicPage({ params }: Props) {
  const { topic, subtopic } = await params;
  const topicNode = findTopicBySlug(topic);
  if (!topicNode) notFound();
  const subtopicNode = findSubtopicBySlug(topicNode.id, subtopic);
  if (!subtopicNode) notFound();

  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  const meta = buildNodePageMeta(subtopicNode.id);
  const topicSlug = toSlug(topicNode.title);
  const canonical = `${ENV.SITE_URL}/cat-prep/${topicSlug}/${toSlug(subtopicNode.title)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: topicNode.title, item: `${ENV.SITE_URL}/cat-prep/${topicSlug}` },
        { "@type": "ListItem", position: 3, name: subtopicNode.title, item: canonical },
      ],
    },
    ...(meta ? [buildLearningResourceSchema(meta.title, meta.description, canonical)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProgressProvider>
        <RoadmapContent
          subjects={subjects}
          allDescriptions={descriptions as Description[]}
          allResources={ALL_RESOURCES}
          allFaqs={faqs as FaqType[]}
          initialNode={subtopicNode}
          initialExpandedTopicId={topicNode.id}
        />
      </ProgressProvider>
    </>
  );
}
