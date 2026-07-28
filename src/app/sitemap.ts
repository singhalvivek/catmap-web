// sitemap — Next.js sitemap.xml route; lists all public pages with change frequency
import type { MetadataRoute } from "next";
import { ENV } from "@/config/env";
import { getDb } from "@/lib/mongodb";
import data from "@/app/cat-prep/data.json";
import type { Node } from "@/app/cat-prep/models/node";
import { toSlug } from "@/app/cat-prep/lib/nodeMetadata";
import { PRACTICE_SUBJECTS, RC_CHAPTER_SLUG } from "@/constants/practiceChapters";
import { PYQ_PAPERS } from "@/constants/pyqPapers";
import { fetchDilrSetNumbersByChapter } from "@/lib/practiceQueries";

const allNodes = data as Node[];

// Mongo stores the chapter's display name; the URL uses the constants slug. Match on the
// name only — the same lookup the route performs. An earlier version fell back to
// comparing slugs, which inverted the intent: on a rename it found the sets under the new
// Mongo name and emitted URLs the route still resolves through the *constants* name, so
// every one of them 404'd. Dropping the entries is the safe direction, and
// `npm run check:content` reports the drift rather than letting it pass silently.
function dilrSetNumbersFor(setsByChapter: Map<string, number[]>, chapterName: string): number[] {
  return setsByChapter.get(chapterName) ?? [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const db = await getDb();
  const [rcCount, dilrSetsByChapter] = await Promise.all([
    db.collection("percentyl_rcs").countDocuments(),
    fetchDilrSetNumbersByChapter(),
  ]);

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

  // Every set that exists, not one per chapter. The chapter name in Mongo is resolved
  // back to its constants slug, so a chapter without a constants entry is skipped
  // rather than becoming a sitemap URL that 404s.
  const dilrSubject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const dilrEntries: MetadataRoute.Sitemap = dilrSubject
    ? dilrSubject.topics
        .flatMap((t) => t.chapters)
        .flatMap((chapter) => {
          const setNumbers = dilrSetNumbersFor(dilrSetsByChapter, chapter.name);
          return setNumbers.map((setNumber) => ({
            url: `${ENV.SITE_URL}/cat-prep/practice/dilr/${chapter.slug}/${setNumber}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.5,
          }));
        })
    : [];

  // Past essay pages are deliberately NOT listed. Each holds an Aeon title, author and
  // a ~150-character excerpt — roughly 190 characters, none of it ours — plus community
  // responses that currently number six across all 37 essays. Asking Google to index 30-odd
  // near-empty pages wrapped around someone else's writing spends crawl budget that
  // belongs to the PYQ papers, and invites a thin-content judgement on the whole domain.
  // The daily-dose hubs below are the right level of granularity for this section.
  // They stay prerendered and reachable from the archive for people; they just aren't
  // put forward for indexing.

  // Para Jumbles, Para Summary and Odd One Out. Reading Comprehension is excluded — its
  // questions live in another collection and it has its own per-passage route below.
  const varcSubject = PRACTICE_SUBJECTS.find((s) => s.section === "VARC");
  const varcEntries: MetadataRoute.Sitemap = (varcSubject?.topics.flatMap((t) => t.chapters) ?? [])
    .filter((chapter) => chapter.slug !== RC_CHAPTER_SLUG)
    .map((chapter) => ({
      url: `${ENV.SITE_URL}/cat-prep/practice/varc/${chapter.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const rcEntries: MetadataRoute.Sitemap = Array.from({ length: rcCount }, (_, i) => ({
    url: `${ENV.SITE_URL}/cat-prep/practice/varc/reading-comprehensions/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const pyqEntries: MetadataRoute.Sitemap = PYQ_PAPERS.map((p) => ({
    url: `${ENV.SITE_URL}/cat-prep/pyq/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    { url: ENV.SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${ENV.SITE_URL}/cat-prep`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ENV.SITE_URL}/cat-prep/how-to-prepare`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${ENV.SITE_URL}/cat-prep/practice`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${ENV.SITE_URL}/cat-prep/pyq`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${ENV.SITE_URL}/cat-prep/daily-dose`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${ENV.SITE_URL}/cat-prep/daily-dose/essay`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${ENV.SITE_URL}/cat-prep/daily-dose/challenge`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${ENV.SITE_URL}/sitemap-page`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...pyqEntries,
    ...topicEntries,
    ...subtopicEntries,
    ...quantEntries,
    ...dilrEntries,
    ...varcEntries,
    ...rcEntries,
  ];
}
