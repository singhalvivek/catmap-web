// sitemap — Next.js sitemap.xml route; lists all public pages with change frequency
import type { MetadataRoute } from "next";
import { ENV } from "@/config/env";
import data from "@/app/cat-prep/data.json";
import type { Node } from "@/app/cat-prep/models/node";
import { toSlug } from "@/app/cat-prep/lib/nodeMetadata";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";

const allNodes = data as Node[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const topicEntries: MetadataRoute.Sitemap = allNodes
    .filter((n) => n.type === "TOPIC")
    .map((n) => ({
      url: `${ENV.SITE_URL}/cat-prep/${toSlug(n.title)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const subtopicEntries: MetadataRoute.Sitemap = allNodes
    .filter((n) => n.type === "SUBTOPIC")
    .flatMap((n) => {
      const parent = allNodes.find((p) => p.id === n.parent_id);
      if (!parent) return [];
      return [
        {
          url: `${ENV.SITE_URL}/cat-prep/${toSlug(parent.title)}/${toSlug(n.title)}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        },
      ];
    });

  const quantSubject = PRACTICE_SUBJECTS.find((s) => s.section === "Quant");
  const quantEntries: MetadataRoute.Sitemap = quantSubject
    ? quantSubject.topics.flatMap((topic) =>
        topic.chapters.map((chapter) => ({
          url: `${ENV.SITE_URL}/cat-prep/practice/quant/${topic.slug}/${chapter.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      )
    : [];

  const dilrSubject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const dilrEntries: MetadataRoute.Sitemap = dilrSubject
    ? dilrSubject.topics
        .flatMap((t) => t.chapters)
        .map((chapter) => ({
          url: `${ENV.SITE_URL}/cat-prep/practice/dilr/${chapter.slug}/1`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }))
    : [];

  return [
    { url: ENV.SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${ENV.SITE_URL}/cat-prep`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ENV.SITE_URL}/cat-prep/daily-challenge`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...topicEntries,
    ...subtopicEntries,
    ...quantEntries,
    ...dilrEntries,
  ];
}
