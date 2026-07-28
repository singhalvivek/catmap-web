import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchDilrSet, fetchDilrSetNumbersByChapter } from "@/lib/practiceQueries";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";
import { buildLearningResourceSchema } from "@/app/cat-prep/lib/nodeMetadata";
import DilrPlayer from "./DilrPlayer";
import Link from "next/link";

type Props = { params: Promise<{ chapter: string; setNumber: string }> };

// Every set that has data, not just set 1 — 18 of 20 sets used to render on demand.
export async function generateStaticParams() {
  const dilrSubject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  if (!dilrSubject) return [];
  const setsByChapter = await fetchDilrSetNumbersByChapter();
  return dilrSubject.topics.flatMap((t) =>
    t.chapters.flatMap((chapter) =>
      (setsByChapter.get(chapter.name) ?? []).map((setNumber) => ({
        chapter: chapter.slug,
        setNumber: String(setNumber),
      }))
    )
  );
}

function resolveChapterName(slug: string): string | undefined {
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const chapter = subject?.topics.flatMap((t) => t.chapters).find((c) => c.slug === slug);
  return chapter?.name;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter, setNumber } = await params;
  const chapterName = resolveChapterName(chapter) ?? chapter;
  // Leads with "CAT DILR" — the old title buried the only searched term at the end.
  const title = `CAT DILR Practice: ${chapterName} Set ${setNumber}`;
  const description = `Solve a CAT DILR ${chapterName.toLowerCase()} set with full reasoning and step-by-step solutions. Free practice, no sign-up needed.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/practice/dilr/${chapter}/${setNumber}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function DilrSetPage({ params }: Props) {
  const { chapter: chapterSlug, setNumber } = await params;

  const chapterName = resolveChapterName(chapterSlug);
  if (!chapterName) notFound();

  const num = parseInt(setNumber, 10);
  if (isNaN(num) || num < 1) notFound();

  // Only the count is needed here. fetchDilrSets loaded every set's passage, questions and
  // SVG blobs to produce it — tolerable when 2 pages were prerendered, wasteful now that
  // all 20 are. The aggregation this route already uses for generateStaticParams returns
  // the same number from one $group.
  const [set, setsByChapter] = await Promise.all([
    fetchDilrSet(chapterName, num),
    fetchDilrSetNumbersByChapter(),
  ]);
  const totalSets = setsByChapter.get(chapterName)?.length ?? 0;

  if (!set) notFound();

  const pageUrl = `${ENV.SITE_URL}/cat-prep/practice/dilr/${chapterSlug}/${num}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: "DILR Practice", item: `${ENV.SITE_URL}/cat-prep/practice/dilr` },
        { "@type": "ListItem", position: 3, name: `${chapterName} Set ${num}`, item: pageUrl },
      ],
    },
    buildLearningResourceSchema(
      `${chapterName} Set ${num} — DILR Practice`,
      `Solve ${chapterName} Set ${num} for CAT DILR prep. Free practice sets with detailed solutions on StudyNaksha.`,
      pageUrl
    ),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      <div
        style={{
          background: "linear-gradient(160deg, #F0FDFA 0%, #EEF2FF 100%)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "#94A3B8", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <span style={{ color: "#64748B" }}>Practice</span>
            {" / "}
            <span style={{ color: "#64748B" }}>DILR</span>
            {" / "}
            <span style={{ color: "#0F766E", fontWeight: 600 }}>{chapterName}</span>
          </div>
          <h1
            className="font-extrabold"
            style={{ fontSize: "clamp(18px,3vw,26px)", margin: 0, color: "#0F766E", letterSpacing: "-0.3px" }}
          >
            {chapterName}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4, marginBottom: 0 }}>
            Set {num} of {totalSets}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <DilrPlayer
          set={set}
          chapterSlug={chapterSlug}
          totalSets={totalSets}
          storageKey={`dilr-${chapterSlug}-${num}`}
        />
      </div>
    </div>
    </>
  );
}
