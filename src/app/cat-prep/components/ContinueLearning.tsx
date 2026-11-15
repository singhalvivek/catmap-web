// ContinueLearning — amber strip of in-progress subtopic chips; hidden when none are in progress
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import { SubjectMeta, SUBJECT_META } from "../lib/subjectMeta";

type InProgressEntry = {
  node: Node;
  meta: SubjectMeta;
  topicTitle: string;
};

export default function ContinueLearning({
  subjects,
  progress,
  onSelectNode,
}: {
  subjects: Node[];
  progress: Record<number, ProgressStatus>;
  onSelectNode: (node: Node) => void;
}) {
  const inProgress: InProgressEntry[] = subjects.flatMap((subject) => {
    const meta = SUBJECT_META[subject.id];
    if (!meta) return [];
    return (subject.children ?? []).flatMap((topic) =>
      (topic.children ?? [])
        .filter((sub) => (progress[sub.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.IN_PROGRESS)
        .map((sub) => ({ node: sub, meta, topicTitle: topic.title }))
    );
  });

  if (inProgress.length === 0) return null;

  return (
    <section className="continue" aria-label="Continue learning">
      <div className="continue__head">
        <p className="ed-kicker" style={{ margin: 0 }}>
          Continue learning
        </p>
        <span className="continue__count">{inProgress.length} in progress</span>
      </div>

      <div className="continue__items">
        {inProgress.map(({ node, meta, topicTitle }) => (
          // The two inline hover handlers this replaced mutated e.currentTarget.style on
          // every pointer event, for every item.
          <button
            key={node.id}
            type="button"
            onClick={() => onSelectNode(node)}
            className="continue__item"
          >
            <span className="continue__item-title">{node.title}</span>
            <span className="continue__item-meta">
              {meta.abbr} &middot; {topicTitle}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
