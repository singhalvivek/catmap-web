// PracticeChapterChip — link chip that navigates to a practice chapter
import Link from "next/link";
import type { PracticeChapter } from "@/constants/practiceChapters";

export default function PracticeChapterChip({
  chapter,
  href,
}: {
  chapter: PracticeChapter;
  href: string;
}) {
  return (
    // No isHovered state: 28 of these render at once and every one re-rendered on pointer
    // move to simulate a :hover that CSS does for free. The component is also no longer a
    // client component as a result.
    <Link href={href} className="ed-chip" style={{ whiteSpace: "nowrap" }}>
      {chapter.name}
      <span style={{ fontSize: 12, color: "var(--ink-faint)", fontVariantNumeric: "tabular-nums" }}>
        {chapter.questionCount}Q
      </span>
    </Link>
  );
}
