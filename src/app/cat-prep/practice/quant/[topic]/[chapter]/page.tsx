import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPracticeQuestions } from "@/lib/practiceQueries";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";
import { buildLearningResourceSchema } from "@/app/cat-prep/lib/nodeMetadata";
import QuestionPlayer from "./QuestionPlayer";
import Link from "next/link";

type Props = { params: Promise<{ topic: string; chapter: string }> };

export function generateStaticParams() {
  const quantSubject = PRACTICE_SUBJECTS.find((s) => s.section === "Quant");
  if (!quantSubject) return [];
  return quantSubject.topics.flatMap((topic) =>
    topic.chapters.map((chapter) => ({ topic: topic.slug, chapter: chapter.slug }))
  );
}

function resolveChapterMeta(topicSlug: string, chapterSlug: string) {
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "Quant");
  const topic = subject?.topics.find((t) => t.slug === topicSlug);
  const chapter = topic?.chapters.find((c) => c.slug === chapterSlug);
  return { topic, chapter };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, chapter } = await params;
  const meta = resolveChapterMeta(topic, chapter);
  if (!meta.chapter || !meta.topic) return { title: "Practice Questions | StudyNaksha" };
  const title = `${meta.chapter.name} Practice — ${meta.topic.name} | StudyNaksha`;
  const description = `Practice ${meta.chapter.questionCount}+ CAT-level ${meta.chapter.name} questions. Free, self-paced ${meta.topic.name} practice on StudyNaksha.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/practice/quant/${topic}/${chapter}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function QuantChapterPage({ params }: Props) {
  const { topic: topicSlug, chapter: chapterSlug } = await params;
  const { topic, chapter } = resolveChapterMeta(topicSlug, chapterSlug);

  if (!topic || !chapter) notFound();

  // topic.name and chapter.name match the MongoDB field values exactly
  const questions = await fetchPracticeQuestions("Quant", topic.name, chapter.name);
  if (!questions.length) notFound();

  const pageUrl = `${ENV.SITE_URL}/cat-prep/practice/quant/${topicSlug}/${chapterSlug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: "Quant Practice", item: `${ENV.SITE_URL}/cat-prep/practice/quant` },
        { "@type": "ListItem", position: 3, name: topic.name, item: `${ENV.SITE_URL}/cat-prep/practice/quant/${topicSlug}` },
        { "@type": "ListItem", position: 4, name: chapter.name, item: pageUrl },
      ],
    },
    buildLearningResourceSchema(
      `${chapter.name} Practice — ${topic.name}`,
      `Practice ${chapter.questionCount}+ CAT-level ${chapter.name} questions. Free, self-paced ${topic.name} practice on StudyNaksha.`,
      pageUrl
    ),
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: `${chapter.name} Practice — ${topic.name}`,
      educationalLevel: "graduate",
      about: { "@type": "Thing", name: "CAT Exam" },
      provider: { "@type": "Organization", name: "StudyNaksha", url: ENV.SITE_URL },
      numberOfQuestions: questions.length,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      {/* Header breadcrumb */}
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 100%)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "#94A3B8", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <span style={{ color: "#64748B" }}>Practice</span>
            {" / "}
            <span style={{ color: "#64748B" }}>{topic.name}</span>
            {" / "}
            <span style={{ color: "#1E3A5F", fontWeight: 600 }}>{chapter.name}</span>
          </div>
          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(20px,3vw,28px)", margin: 0, letterSpacing: "-0.3px" }}
          >
            {chapter.name}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4, marginBottom: 0 }}>
            {topic.name} · {questions.length} questions
          </p>
        </div>
      </div>

      {/* Player — owns its own max-width and layout */}
      <QuestionPlayer
        questions={questions}
        backHref="/cat-prep"
        backLabel="Back to Roadmap"
        storageKey={`quant-${topicSlug}-${chapterSlug}`}
      />
    </div>
    </>
  );
}
