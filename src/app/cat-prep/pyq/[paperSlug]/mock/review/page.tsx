import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPyqMockReviewTest } from "@/lib/pyqQueries";
import { getPyqPaper, pyqPaperLabel } from "@/constants/pyqPapers";
import PyqMockReviewPageClient from "./PyqMockReviewPageClient";

type Props = { params: Promise<{ paperSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paperSlug } = await params;
  const meta = getPyqPaper(paperSlug);
  if (!meta) return { title: "PYQ Mock Review" };
  const label = pyqPaperLabel(meta);
  return { title: `${label} — Mock Review` };
}

export default async function PyqMockReviewPage({ params }: Props) {
  const { paperSlug } = await params;
  const meta = getPyqPaper(paperSlug);
  if (!meta) notFound();

  const test = await fetchPyqMockReviewTest(paperSlug);
  if (!test) notFound();

  return <PyqMockReviewPageClient test={test} paperSlug={paperSlug} paperLabel={pyqPaperLabel(meta)} />;
}
