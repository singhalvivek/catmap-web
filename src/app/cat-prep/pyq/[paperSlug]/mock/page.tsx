import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPyqMockTest } from "@/lib/pyqQueries";
import { getPyqPaper, pyqPaperLabel } from "@/constants/pyqPapers";
import PyqMockPageClient from "./PyqMockPageClient";

type Props = { params: Promise<{ paperSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paperSlug } = await params;
  const meta = getPyqPaper(paperSlug);
  if (!meta) return { title: "PYQ Mock Test | StudyNaksha" };
  const label = pyqPaperLabel(meta);
  const title = `${label} — Mock Test | StudyNaksha`;
  const description = `Attempt ${label} as a timed, sectioned mock test — just like the real CAT exam.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function PyqMockPage({ params }: Props) {
  const { paperSlug } = await params;
  const meta = getPyqPaper(paperSlug);
  if (!meta) notFound();

  const test = await fetchPyqMockTest(paperSlug);
  if (!test) notFound();

  return <PyqMockPageClient test={test} paperSlug={paperSlug} paperLabel={pyqPaperLabel(meta)} />;
}
