// PyqTopicCard — Practice-surface promo tile linking to past-paper questions by topic
import Link from "next/link";
import { PYQ_TOPIC_PRACTICE } from "@/constants/routes";
import { PYQ_TOPIC_EARLIEST_YEAR, PYQ_TOPIC_LATEST_YEAR } from "@/constants/pyqTopics";

export default function PyqTopicCard() {
  return (
    <div className="dd-promo">
      <div>
        <p className="ed-kicker" style={{ margin: "0 0 8px" }}>
          Past papers by topic
        </p>
        <p className="display dd-promo__title">Drill one topic across real CAT papers</p>
        <p className="dd-promo__sub">
          Pick a topic — Arithmetic, Para Summary, Puzzles — and the years, and get every
          question on it from the {PYQ_TOPIC_EARLIEST_YEAR}–{PYQ_TOPIC_LATEST_YEAR} papers.
        </p>
      </div>
      <Link href={PYQ_TOPIC_PRACTICE} className="ed-btn" data-weight="secondary">
        Pick a topic
      </Link>
    </div>
  );
}
