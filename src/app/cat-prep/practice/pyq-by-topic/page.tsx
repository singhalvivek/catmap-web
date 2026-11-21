// page — /cat-prep/practice/pyq-by-topic: every past-paper question on one topic, from the years you pick
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/cat-prep/components/Header";
import Footer from "@/app/cat-prep/components/Footer";
import { ENV } from "@/config/env";
import { LEARN_INDEX, PRACTICE_INDEX, PYQ_TOPIC_PRACTICE } from "@/constants/routes";
import { PYQ_TOPIC_EARLIEST_YEAR, PYQ_TOPIC_LATEST_YEAR } from "@/constants/pyqTopics";
import { fetchPyqTopicPaperCounts, fetchPyqTopicPapers } from "@/lib/pyqQueries";
import {
  countsByYear,
  paginatePyqTopicPapers,
  parsePageIndex,
  parsePyqTopicSelection,
  topicPaperSizes,
} from "@/lib/pyqTopicQuery";
import PyqTopicPicker from "./PyqTopicPicker";
import PyqTopicSet from "./PyqTopicSet";

type Props = {
  searchParams: Promise<{
    topic?: string | string[];
    year?: string | string[];
    page?: string | string[];
  }>;
};

const title = "CAT Previous Year Questions by Topic";
const description = `Practise real CAT questions one topic at a time — Arithmetic, Algebra, Para Summary, Para Jumbles, Reading Comprehension, DILR puzzles and more — from the ${PYQ_TOPIC_EARLIEST_YEAR}–${PYQ_TOPIC_LATEST_YEAR} papers, with answers and explanations.`;

// Every selection is a query string on this one URL, so they all point search engines here.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${ENV.SITE_URL}${PYQ_TOPIC_PRACTICE}` },
  openGraph: { title, description },
  twitter: { title, description },
};

function sumSizes(papers: { size: number }[]): number {
  return papers.reduce((sum, p) => sum + p.size, 0);
}

export default async function PyqByTopicPage({ searchParams }: Props) {
  const params = await searchParams;
  const { topic, years } = parsePyqTopicSelection(params);
  const paperCounts = await fetchPyqTopicPaperCounts();

  // Pages are laid out from the counts, so only the page being read is fetched in full.
  const sizes = topic ? topicPaperSizes(paperCounts[topic.slug] ?? {}, years) : [];
  const pages = paginatePyqTopicPapers(sizes);
  const pageIndex = parsePageIndex(params.page, pages.length);
  const pageSizes = pages[pageIndex] ?? [];
  const papers = topic
    ? await fetchPyqTopicPapers(topic, years, pageSizes.map((p) => p.paperSlug))
    : [];
  const firstQuestion = sumSizes(pages.slice(0, pageIndex).flat()) + 1;

  // Remounts the picker on every new selection, and the set on every page too, so
  // neither carries state (an open picker, a stale MathJax pass) over from before.
  const selectionKey = `${topic?.slug ?? ""}:${years.join(",")}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--rule)", padding: "24px 24px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 6 }}>
            <Link href={LEARN_INDEX} style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <Link href={PRACTICE_INDEX} style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
              Practice
            </Link>
            {" / "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>PYQs by topic</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(26px,3.4vw,34px)", color: "var(--ink)", margin: 0 }}>
            Past-paper questions by topic
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6, marginBottom: 0, maxWidth: "62ch", lineHeight: 1.6 }}>
            Pick a topic and the years. You get every CAT question on it from those papers, with
            the answer and explanation after each one. Answers you give here also show up in the
            full paper.
          </p>
        </div>
      </div>

      {/* Same padding-outside, width-inside nesting as the header above, so the two align. */}
      <main style={{ flex: 1, padding: "24px 24px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <PyqTopicPicker
            key={`picker:${selectionKey}`}
            counts={countsByYear(paperCounts)}
            initialTopic={topic?.slug ?? null}
            initialYears={years}
            collapsed={papers.length > 0}
          />
          {topic && years.length > 0 && (
            <PyqTopicSet
              key={`set:${selectionKey}:${pageIndex}`}
              topic={topic}
              years={years}
              papers={papers}
              page={{
                index: pageIndex,
                count: pages.length,
                firstQuestion,
                lastQuestion: firstQuestion + sumSizes(pageSizes) - 1,
                totalQuestions: sumSizes(sizes),
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
