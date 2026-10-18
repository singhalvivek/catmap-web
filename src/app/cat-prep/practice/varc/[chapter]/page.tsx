// page — /cat-prep/practice/varc/[chapter]; Para Jumbles, Para Summary and Odd One Out practice
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchPracticeQuestions } from "@/lib/practiceQueries";
import { PRACTICE_SUBJECTS, RC_CHAPTER_SLUG } from "@/constants/practiceChapters";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";
import { buildLearningResourceSchema } from "@/app/cat-prep/lib/nodeMetadata";
import QuestionPlayer from "@/app/cat-prep/practice/quant/[topic]/[chapter]/QuestionPlayer";

type Props = { params: Promise<{ chapter: string }> };

// Reading Comprehension has its own route a level deeper, so it is excluded here and
// redirected instead of 404ing when someone lands on the bare chapter URL.
function varcChapters() {
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "VARC");
  return (subject?.topics.flatMap((t) => t.chapters) ?? []).filter((c) => c.slug !== RC_CHAPTER_SLUG);
}

export function generateStaticParams() {
  return varcChapters().map((c) => ({ chapter: c.slug }));
}

function resolveChapter(slug: string) {
  return varcChapters().find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = resolveChapter(slug);
  if (!chapter) return { title: "VARC Practice" };
  const title = `CAT ${chapter.name} Practice with Solutions`;
  const description = `Practise ${chapter.questionCount} CAT-level ${chapter.name.toLowerCase()} questions for VARC, each with a detailed explanation. Free, no sign-up needed.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/practice/varc/${slug}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function VarcChapterPage({ params }: Props) {
  const { chapter: slug } = await params;

  if (slug === RC_CHAPTER_SLUG) redirect(`/cat-prep/practice/varc/${RC_CHAPTER_SLUG}/1`);

  const chapter = resolveChapter(slug);
  if (!chapter) notFound();

  // These chapters are stored with topic equal to chapter — unlike Quant, where the
  // topic is a real grouping — so the chapter name is passed for both.
  const questions = await fetchPracticeQuestions("VARC", chapter.name, chapter.name);
  if (!questions.length) notFound();

  const pageUrl = `${ENV.SITE_URL}/cat-prep/practice/varc/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: "Practice", item: `${ENV.SITE_URL}/cat-prep/practice` },
        { "@type": "ListItem", position: 3, name: `${chapter.name} Practice`, item: pageUrl },
      ],
    },
    buildLearningResourceSchema(
      `CAT ${chapter.name} Practice`,
      `Practise ${chapter.questionCount} CAT-level ${chapter.name.toLowerCase()} questions for VARC, each with a detailed explanation.`,
      pageUrl
    ),
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: `CAT ${chapter.name} Practice`,
      educationalLevel: "graduate",
      about: { "@type": "Thing", name: "CAT Exam" },
      provider: { "@type": "Organization", name: "StudyNaksha", url: ENV.SITE_URL },
      numberOfQuestions: questions.length,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
        <div
          style={{
            background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
            padding: "24px 24px 28px",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 6 }}>
              <Link href="/cat-prep" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
                CAT Prep
              </Link>
              {" / "}
              <span style={{ color: "var(--ink-soft)" }}>Practice</span>
              {" / "}
              <span style={{ color: "var(--ink-soft)" }}>VARC</span>
              {" / "}
              <span style={{ color: "var(--accent-text)", fontWeight: 600 }}>{chapter.name}</span>
            </div>
            <h1
              className="font-extrabold"
              style={{ fontSize: "clamp(20px,3vw,28px)", margin: 0, color: "var(--accent-text)", letterSpacing: "-0.3px" }}
            >
              {chapter.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, marginBottom: 0 }}>
              VARC · {questions.length} questions with explanations
            </p>
          </div>
        </div>

        <Suspense>
          <QuestionPlayer
            questions={questions}
            backHref="/cat-prep"
            backLabel="Back to Roadmap"
            storageKey={`varc-${slug}`}
          />
        </Suspense>
      </div>
    </>
  );
}
