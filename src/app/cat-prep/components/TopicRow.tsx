// TopicRow — expandable row for a TOPIC node; opens to show its subtopic chips
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import SubtopicChip from "./SubtopicChip";
import { trackEvent } from "@/app/components/analytics";
import { TREE_LAYOUT, bendPath, stationX } from "../lib/treeLayout";

function progressState(pct: number): string {
  if (pct === 100) return "correct";
  if (pct > 0) return "caution";
  return "inert";
}

export default function TopicRow({
  topic,
  onSelectNode,
  selectedId,
  progress,
  lessonCounts,
  station,
  isLastTopic = false,
  isOpen,
  onToggle,
}: {
  topic: Node;
  /** Openable lesson links per subtopic id, for the branch's right-hand column. */
  lessonCounts?: Record<number, number>;
  /** 1-based position, shown as the station number in the path layout. */
  station?: number;
  /** Last topic of the subject — the path terminates rather than continuing. */
  isLastTopic?: boolean;
  onSelectNode: (node: Node) => void;
  selectedId: number | null;
  progress: Record<number, ProgressStatus>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const subtopics = (topic.children ?? []).slice().sort((a, b) => a.order_index - b.order_index);

  const done = subtopics.filter(
    (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
  ).length;
  const pct = subtopics.length > 0 ? Math.round((done / subtopics.length) * 100) : 0;
  const state = progressState(pct);

  const onRoute = TREE_LAYOUT === "path" && station !== undefined;

  return (
    <div
      className="topic-row"
      data-open={isOpen}
      data-state={state}
      data-last-topic={isLastTopic}
      style={
        onRoute
          ? ({
              "--sx": stationX(station),
              "--sx2": stationX(station + 1),
              // Staggers the arrival of rows that are already on screen at first paint.
              // Rows met by scrolling are staggered by the scrolling itself.
              "--si": station - 1,
              "--pct": pct,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/*
        The leg of the route from this station down to the next: a drawn bend of fixed
        height, then a straight run at the arriving x. It hangs below the row by half a
        station, which is why nothing in the row may clip its overflow.
      */}
      {onRoute && !isLastTopic && (
        <span className="topic-row__road" aria-hidden="true">
          <svg className="topic-row__bend" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={bendPath(station)} />
          </svg>
          <span className="topic-row__run" />
        </span>
      )}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            trackEvent("topic_expanded", { topic_id: String(topic.id), topic_name: topic.title });
          }
          onToggle();
        }}
        aria-expanded={isOpen}
        className="topic-row__header"
      >
        <span className="topic-row__lead">
          <span className="topic-row__dot" data-state={state} aria-hidden="true">
            <span className="topic-row__ring" />
            <span className="topic-row__station">{station}</span>
          </span>
          <span className="topic-row__title">{topic.title}</span>
          <span className="topic-row__count">{subtopics.length} subtopics</span>
        </span>

        <span className="topic-row__meta">
          {/*
            Only show the meter once there is something to meter. Eleven rows each reading
            "0%" beside an empty bar is noise that tells a new reader nothing, and it made
            the list look like a broken dashboard rather than a contents page.
          */}
          {subtopics.length > 0 && pct > 0 && (
            <>
              <span
                className="ed-meter topic-row__meter"
                data-state={state}
                /*
                  No role="progressbar" here. role="button" takes presentational children,
                  so every descendant of this header button is mapped to presentation and
                  the aria-value* were discarded before a screen reader ever saw them. The
                  percentage beside it is real text, and the row's own name carries the
                  topic, so the meter is decoration and says so.
                */
                aria-hidden="true"
                style={{ "--meter-value": pct } as React.CSSProperties}
              >
                <span className="ed-meter__fill" />
              </span>
              <span className="topic-row__pct">{pct}%</span>
            </>
          )}
          <span className="topic-row__toggle" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path
                d="M3 1.5 L7 5 L3 8.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </button>

      {/*
        Grid-rows collapse rather than a max-height cap. The previous 400px ceiling would
        clip a topic whose chips wrapped past it — the same defect the FAQ accordion had.
      */}
      <div className="ed-collapse" data-open={isOpen}>
        <div>
          <div className="topic-row__chips" data-layout={TREE_LAYOUT}>
            {subtopics.map((s, i) => (
              <SubtopicChip
                key={s.id}
                index={i}
                lessonCount={lessonCounts?.[s.id] ?? 0}
                isLast={i === subtopics.length - 1}
                node={s}
                isSelected={selectedId === s.id}
                onClick={onSelectNode}
                progress={progress}
              />
            ))}
            {subtopics.length === 0 && (
              <span style={{ fontSize: 15, color: "var(--ink-faint)" }}>
                Subtopics coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
