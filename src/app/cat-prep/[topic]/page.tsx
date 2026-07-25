import { notFound } from "next/navigation";
import type { Metadata } from "next";
import data from "../data.json";
import descriptions from "../description.json";
import faqs from "../faq.json";
import { buildTree } from "../lib/buildTree";
import { ALL_RESOURCES } from "../lib/allResources";
import { findTopicBySlug, buildNodePageMeta, toSlug, buildLearningResourceSchema } from "../lib/nodeMetadata";
import { Node } from "../models/node";
import { Description } from "../models/description";
import type { Faq as FaqType } from "../models/faq";
import { ProgressProvider } from "../lib/ProgressContext";
import RoadmapContent from "../components/RoadmapContent";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return (data as Node[])
    .filter((n) => n.type === "TOPIC")
    .map((n) => ({ topic: toSlug(n.title) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const node = findTopicBySlug(topic);
  if (!node) return { title: "CAT Prep | StudyNaksha" };
  const meta = buildNodePageMeta(node.id);
  if (!meta) return { title: "CAT Prep | StudyNaksha" };
  const canonical = `${ENV.SITE_URL}/cat-prep/${toSlug(node.title)}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const node = findTopicBySlug(topic);
  if (!node) notFound();

  const tree = buildTree(data as Node[]);
  const subjects = tree[0]?.children ?? [];

  const meta = buildNodePageMeta(node.id);
  const canonical = `${ENV.SITE_URL}/cat-prep/${toSlug(node.title)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: node.title, item: canonical },
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
          initialExpandedTopicId={node.id}
        />
      </ProgressProvider>
    </>
  );
}
