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
import NodeContent from "../../components/NodeContent";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";

type Props = { params: Promise<{ topic: string; subtopic: string }> };

export function generateStaticParams() {
  const allNodes = data as Node[];
  return allNodes
    .filter((n) => n.type === "SUBTOPIC")
    .flatMap((n) => {
      const parent = allNodes.find((p) => p.id === n.parent_id);
      if (!parent) return [];
      return [{ topic: toSlug(parent.title), subtopic: toSlug(n.title) }];
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, subtopic } = await params;
  const topicNode = findTopicBySlug(topic);
  if (!topicNode) return { title: "CAT Prep" };
  const subtopicNode = findSubtopicBySlug(topicNode.id, subtopic);
  if (!subtopicNode) return { title: "CAT Prep" };
  const meta = buildNodePageMeta(subtopicNode.id);
  if (!meta) return { title: "CAT Prep" };
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

  // Passing initialNode makes RoadmapContent render DetailsPanel during prerender, which
  // already emits this node's description and resource list — so NodeContent contributes
  // only the sibling links here, and passes them through the beforeFooter slot because
  // RoadmapContent owns <Footer /> and a sibling element would land beneath it.
  const allNodes = data as Node[];
  const siblings = allNodes.filter(
    (n) => n.type === "SUBTOPIC" && n.parent_id === topicNode.id && n.id !== subtopicNode.id
  );

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
          beforeFooter={
            <NodeContent
              node={subtopicNode}
              parent={topicNode}
              showDetails={false}
              resources={[]}
              related={siblings}
              relatedTopicSlug={topicSlug}
              relatedHeading={`More ${topicNode.title} topics`}
            />
          }
        />
      </ProgressProvider>
    </>
  );
}
