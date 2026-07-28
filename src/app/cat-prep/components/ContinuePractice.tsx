// ContinuePractice — blue strip of in-progress practice chips; reads localStorage; hidden when none are started
"use client";

import { useState } from "react";
import Link from "next/link";
import { PRACTICE_SUBJECTS, RC_CHAPTER_SLUG } from "@/constants/practiceChapters";
import { loadLocalProgress, PROGRESS_PREFIX } from "@/app/cat-prep/lib/practiceProgressStore";

const VARC_CHAPTERS =
  PRACTICE_SUBJECTS.find((s) => s.section === "VARC")
    ?.topics.flatMap((t) => t.chapters)
    .filter((c) => c.slug !== RC_CHAPTER_SLUG) ?? [];

type EntryConfig = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  total?: number;
  color: string;
  bgColor: string;
  borderColor: string;
};

type InProgressEntry = EntryConfig & { answered: number };

function buildQuantEntries(): EntryConfig[] {
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "Quant");
  if (!subject) return [];
  return subject.topics.flatMap((topic) =>
    topic.chapters.map((chapter) => ({
      key: `quant-${topic.slug}-${chapter.slug}`,
      title: chapter.name,
      subtitle: `${topic.name} · QA`,
      href: `/cat-prep/practice/quant/${topic.slug}/${chapter.slug}`,
      total: chapter.questionCount,
      color: "#1E3A5F",
      bgColor: "#EEF2FF",
      borderColor: "#C7D2FE",
    }))
  );
}

function parseDilrKey(rawKey: string): { chapterSlug: string; setNum: number } | null {
  if (!rawKey.startsWith("dilr-")) return null;
  const subject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const chapters = subject?.topics.flatMap((t) => t.chapters) ?? [];
  for (const ch of chapters) {
    const prefix = `dilr-${ch.slug}-`;
    if (rawKey.startsWith(prefix)) {
      const setNum = parseInt(rawKey.slice(prefix.length), 10);
      if (!isNaN(setNum) && setNum > 0) return { chapterSlug: ch.slug, setNum };
    }
  }
  return null;
}

function buildEntries(): InProgressEntry[] {
  if (typeof window === "undefined") return [];

  const PREFIX = PROGRESS_PREFIX;
  const result: InProgressEntry[] = [];

  for (const config of buildQuantEntries()) {
    const progress = loadLocalProgress(config.key);
    if (!progress) continue;
    const answered = Object.keys(progress.answers).length;
    if (answered === 0) continue;
    if (config.total && answered >= config.total) continue;
    result.push({ ...config, answered });
  }

  const dilrSubject = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  const dilrChapterMap = Object.fromEntries(
    (dilrSubject?.topics.flatMap((t) => t.chapters) ?? []).map((c) => [c.slug, c.name])
  );

  for (let i = 0; i < localStorage.length; i++) {
    const lsKey = localStorage.key(i);
    if (!lsKey?.startsWith(PREFIX)) continue;
    const rawKey = lsKey.slice(PREFIX.length);

    const dilr = parseDilrKey(rawKey);
    if (dilr) {
      const progress = loadLocalProgress(rawKey);
      const answered = progress ? Object.keys(progress.answers).length : 0;
      if (answered === 0) continue;
      const chapterName = dilrChapterMap[dilr.chapterSlug] ?? dilr.chapterSlug;
      result.push({
        key: rawKey,
        title: `${chapterName} — Set ${dilr.setNum}`,
        subtitle: "DILR",
        href: `/cat-prep/practice/dilr/${dilr.chapterSlug}/${dilr.setNum}`,
        color: "#0F766E",
        bgColor: "#F0FDFA",
        borderColor: "#99F6E4",
        answered,
      });
      continue;
    }

    if (rawKey.startsWith("varc-rc-")) {
      const rcNum = parseInt(rawKey.slice("varc-rc-".length), 10);
      if (isNaN(rcNum) || rcNum < 1) continue;
      const progress = loadLocalProgress(rawKey);
      const answered = progress ? Object.keys(progress.answers).length : 0;
      if (answered === 0) continue;
      result.push({
        key: rawKey,
        title: `RC ${rcNum}`,
        subtitle: "Reading Comprehension · VARC",
        href: `/cat-prep/practice/varc/${RC_CHAPTER_SLUG}/${rcNum}`,
        color: "#92400E",
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        answered,
      });
      continue;
    }

    // Para Jumbles / Para Summary / Odd One Out write `varc-<slug>`. Without this they
    // matched none of the branches above and were silently dropped, so those three
    // chapters were the only practice surfaces with no resume path.
    if (rawKey.startsWith("varc-")) {
      const chapter = VARC_CHAPTERS.find((c) => rawKey === `varc-${c.slug}`);
      if (!chapter) continue;
      const progress = loadLocalProgress(rawKey);
      const answered = progress ? Object.keys(progress.answers).length : 0;
      if (answered === 0) continue;
      result.push({
        key: rawKey,
        title: chapter.name,
        subtitle: "VARC",
        href: `/cat-prep/practice/varc/${chapter.slug}`,
        color: "#92400E",
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        answered,
      });
    }
  }

  return result;
}

export default function ContinuePractice() {
  const [entries] = useState<InProgressEntry[]>(() => buildEntries());

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #BFDBFE",
        padding: "16px 20px",
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>📝</span>
        <span className="font-extrabold" style={{ fontSize: 14, color: "#1D4ED8" }}>
          Continue Practice
        </span>
        <span className="font-medium" style={{ fontSize: 11, color: "#94A3B8", marginLeft: "auto" }}>
          {entries.length} in progress
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <Link
            key={entry.key}
            href={entry.href}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "8px 12px",
              borderRadius: 10,
              border: `1.5px solid ${entry.borderColor}`,
              background: entry.bgColor,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(0.96)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "";
              (e.currentTarget as HTMLAnchorElement).style.transform = "";
            }}
          >
            <div className="font-bold" style={{ fontSize: 13, color: entry.color }}>
              {entry.title}
            </div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.answered}{entry.total ? `/${entry.total}` : ""}
              </span>
              {" done · "}
              {entry.subtitle}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
