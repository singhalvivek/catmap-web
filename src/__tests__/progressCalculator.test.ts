import { describe, it, expect } from "vitest";
import { calculateNodeProgress } from "../app/cat-prep/lib/progressCalculator";
import { ProgressStatus } from "../app/cat-prep/models/progress";
import type { Node } from "../app/cat-prep/models/node";

const subject: Node = {
  id: 1, parent_id: null, title: "Subject", type: "SUBJECT", order_index: 1,
  children: [
    {
      id: 2, parent_id: 1, title: "Topic", type: "TOPIC", order_index: 1,
      children: [
        { id: 10, parent_id: 2, title: "Sub 1", type: "SUBTOPIC", order_index: 1 },
        { id: 11, parent_id: 2, title: "Sub 2", type: "SUBTOPIC", order_index: 2 },
        { id: 12, parent_id: 2, title: "Sub 3", type: "SUBTOPIC", order_index: 3 },
        { id: 13, parent_id: 2, title: "Sub 4", type: "SUBTOPIC", order_index: 4 },
      ],
    },
  ],
};

describe("calculateNodeProgress", () => {
  it("returns 0% when no subtopics are completed", () => {
    const result = calculateNodeProgress(subject, {});
    expect(result.total).toBe(4);
    expect(result.completed).toBe(0);
    expect(result.percent).toBe(0);
  });

  it("counts only COMPLETED status, not IN_PROGRESS", () => {
    const progress = {
      10: ProgressStatus.COMPLETED,
      11: ProgressStatus.IN_PROGRESS,
    };
    const result = calculateNodeProgress(subject, progress);
    expect(result.completed).toBe(1);
    expect(result.percent).toBe(25);
  });

  it("returns 100% when all subtopics are completed", () => {
    const progress = {
      10: ProgressStatus.COMPLETED,
      11: ProgressStatus.COMPLETED,
      12: ProgressStatus.COMPLETED,
      13: ProgressStatus.COMPLETED,
    };
    const result = calculateNodeProgress(subject, progress);
    expect(result.percent).toBe(100);
  });

  it("returns 75% for 3 of 4 subtopics completed", () => {
    const progress = {
      10: ProgressStatus.COMPLETED,
      11: ProgressStatus.COMPLETED,
      12: ProgressStatus.COMPLETED,
    };
    const result = calculateNodeProgress(subject, progress);
    expect(result.percent).toBe(75);
  });

  it("counts the subtopic itself when called directly on a SUBTOPIC node", () => {
    const leaf: Node = { id: 10, parent_id: 2, title: "Sub 1", type: "SUBTOPIC", order_index: 1 };

    const done = calculateNodeProgress(leaf, { 10: ProgressStatus.COMPLETED });
    expect(done.total).toBe(1);
    expect(done.completed).toBe(1);
    expect(done.percent).toBe(100);

    const notDone = calculateNodeProgress(leaf, {});
    expect(notDone.total).toBe(1);
    expect(notDone.completed).toBe(0);
    expect(notDone.percent).toBe(0);
  });

  it("aggregates subtopics across multiple nested topics", () => {
    const twoTopics: Node = {
      id: 1, parent_id: null, title: "Subject", type: "SUBJECT", order_index: 1,
      children: [
        {
          id: 2, parent_id: 1, title: "Topic A", type: "TOPIC", order_index: 1,
          children: [
            { id: 10, parent_id: 2, title: "Sub 1", type: "SUBTOPIC", order_index: 1 },
            { id: 11, parent_id: 2, title: "Sub 2", type: "SUBTOPIC", order_index: 2 },
          ],
        },
        {
          id: 3, parent_id: 1, title: "Topic B", type: "TOPIC", order_index: 2,
          children: [
            { id: 12, parent_id: 3, title: "Sub 3", type: "SUBTOPIC", order_index: 1 },
            { id: 13, parent_id: 3, title: "Sub 4", type: "SUBTOPIC", order_index: 2 },
          ],
        },
      ],
    };
    const progress = {
      10: ProgressStatus.COMPLETED,
      12: ProgressStatus.COMPLETED,
    };
    const result = calculateNodeProgress(twoTopics, progress);
    expect(result.total).toBe(4);
    expect(result.completed).toBe(2);
    expect(result.percent).toBe(50);
  });
});
