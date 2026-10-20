// ContinuePractice — resume strip for part-finished practice; hidden when nothing is started
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { PRACTICE_SUBJECTS, RC_CHAPTER_SLUG } from "@/constants/practiceChapters";
import {
  loadLocalProgress,
  PROGRESS_PREFIX,
  subscribePracticeProgress,
} from "@/app/cat-prep/lib/practiceProgressStore";

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
        answered,
      });
    }
  }

  return result;
}

/*
 * Same store, same reason as usePracticeMasterySummary: a useState initializer runs during
 * the hydration render, so the server rendered nothing here and the first client render
 * rendered the strip — and it never recomputed, so answering a question and coming back
 * showed the counts from before.
 */
const NO_ENTRIES: InProgressEntry[] = [];
let snapshot: InProgressEntry[] | null = null;

function getSnapshot(): InProgressEntry[] {
  if (snapshot === null) snapshot = buildEntries();
  return snapshot;
}

function getServerSnapshot(): InProgressEntry[] {
  return NO_ENTRIES;
}

function subscribe(onChange: () => void): () => void {
  const invalidate = () => {
    snapshot = null;
    onChange();
  };
  const unsubscribe = subscribePracticeProgress(invalidate);
  window.addEventListener("storage", invalidate);
  return () => {
    unsubscribe();
    window.removeEventListener("storage", invalidate);
  };
}

export default function ContinuePractice() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (entries.length === 0) return null;

  return (
    // The .continue primitive, which ContinueLearning already uses. This was the last strip
    // carrying the pre-U002 treatment: a blue-tinted box shadow, an emoji, and two inline
    // handlers that mutated e.currentTarget.style on every pointer event, for every item.
    <section className="continue" aria-label="Continue practice">
      <div className="continue__head">
        <p className="ed-kicker" style={{ margin: 0 }}>
          Continue practice
        </p>
        <span className="continue__count">{entries.length} in progress</span>
      </div>

      <div className="continue__items">
        {entries.map((entry) => (
          <Link key={entry.key} href={entry.href} className="continue__item">
            <span className="continue__item-title">{entry.title}</span>
            <span className="continue__item-meta">
              {entry.answered}
              {entry.total ? `/${entry.total}` : ""} done &middot; {entry.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
