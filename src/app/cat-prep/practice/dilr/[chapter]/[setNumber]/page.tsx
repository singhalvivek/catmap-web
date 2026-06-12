import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchDilrSet, fetchDilrSets } from "@/lib/practiceQueries";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import DilrPlayer from "./DilrPlayer";
import Link from "next/link";

type Props = { params: Promise<{ chapter: string; setNumber: string }> };

function resolveChapterName(slug: string): string | undefined {
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const chapter = subject?.topics.flatMap((t) => t.chapters).find((c) => c.slug === slug);
  return chapter?.name;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter, setNumber } = await params;
  const chapterName = resolveChapterName(chapter) ?? chapter;
  return {
    title: `${chapterName} Set ${setNumber} — DILR Practice | StudyNaksha`,
  };
}

export default async function DilrSetPage({ params }: Props) {
  const { chapter: chapterSlug, setNumber } = await params;

  const chapterName = resolveChapterName(chapterSlug);
  if (!chapterName) notFound();

  const num = parseInt(setNumber, 10);
  if (isNaN(num) || num < 1) notFound();

  const [set, allSets] = await Promise.all([
    fetchDilrSet(chapterName, num),
    fetchDilrSets(chapterName),
  ]);

  if (!set) notFound();

  return (
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
            Set {num} of {allSets.length}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <DilrPlayer
          set={set}
          chapterSlug={chapterSlug}
          totalSets={allSets.length}
          storageKey={`dilr-${chapterSlug}-${num}`}
        />
      </div>
    </div>
  );
}
