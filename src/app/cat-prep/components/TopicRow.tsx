// TopicRow — expandable row for a TOPIC node; opens to show its subtopic chips
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import SubtopicChip from "./SubtopicChip";
import { trackEvent } from "@/app/components/analytics";

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
  isOpen,
  onToggle,
}: {
  topic: Node;
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

  return (
    <div className="topic-row" data-open={isOpen}>
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
          <span className="topic-row__dot" data-state={state} aria-hidden="true" />
          <span className="topic-row__title">{topic.title}</span>
          <span className="topic-row__count">{subtopics.length} subtopics</span>
        </span>

        <span className="topic-row__meta">
          {subtopics.length > 0 && (
            <>
              <span
                className="ed-meter topic-row__meter"
                data-state={state}
                role="progressbar"
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={subtopics.length}
                aria-valuetext={`${done} of ${subtopics.length} subtopics complete`}
                style={{ "--meter-value": pct } as React.CSSProperties}
              >
                <span className="ed-meter__fill" />
              </span>
              <span className="topic-row__pct">{pct}%</span>
            </>
          )}
          <span className="topic-row__toggle" aria-hidden="true">
            {isOpen ? "−" : "+"}
          </span>
        </span>
      </button>

      {/*
        Grid-rows collapse rather than a max-height cap. The previous 400px ceiling would
        clip a topic whose chips wrapped past it — the same defect the FAQ accordion had.
      */}
      <div className="ed-collapse" data-open={isOpen}>
        <div>
          <div className="topic-row__chips">
            {subtopics.map((s) => (
              <SubtopicChip
                key={s.id}
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
