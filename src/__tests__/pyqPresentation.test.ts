import { describe, it, expect } from "vitest";
import {
  buildComprehensionGroups,
  indexGroupsByQuestionNumber,
  letterFromIndex,
} from "../lib/pyqPresentation";
import type { PyqComprehension } from "../app/cat-prep/models/pyq";

function comp(id: string): PyqComprehension {
  return { id, text: `passage ${id}`, imageUrls: [] };
}

function q(questionNumber: number, comprehension: PyqComprehension | null = null) {
  return { questionNumber, comprehension };
}

describe("buildComprehensionGroups", () => {
  it("puts consecutive questions sharing a comprehension into one group", () => {
    const rc = comp("rc1");
    const groups = buildComprehensionGroups([q(1, rc), q(2, rc), q(3, rc)]);
    expect(groups).toHaveLength(1);
    expect(groups[0].questions.map((x) => x.questionNumber)).toEqual([1, 2, 3]);
    expect(groups[0].comprehensionText).toBe("passage rc1");
  });

  it("gives each standalone question its own group", () => {
    const groups = buildComprehensionGroups([q(1), q(2), q(3)]);
    expect(groups).toHaveLength(3);
    expect(groups.every((g) => g.comprehensionId === null)).toBe(true);
  });

  it("starts a new group when the comprehension changes", () => {
    const [rc1, rc2] = [comp("rc1"), comp("rc2")];
    const groups = buildComprehensionGroups([q(1, rc1), q(2, rc1), q(3, rc2), q(4, rc2)]);
    expect(groups.map((g) => g.questions.length)).toEqual([2, 2]);
    expect(groups.map((g) => g.comprehensionId)).toEqual(["rc1", "rc2"]);
  });

  it("does not merge non-consecutive questions that share a comprehension", () => {
    // A standalone question between two RC questions splits them, matching how the
    // paper is actually ordered — the passage renders again above the second block.
    const rc = comp("rc1");
    const groups = buildComprehensionGroups([q(1, rc), q(2), q(3, rc)]);
    expect(groups.map((g) => g.questions.map((x) => x.questionNumber))).toEqual([[1], [2], [3]]);
  });

  it("returns no groups for an empty section", () => {
    expect(buildComprehensionGroups([])).toEqual([]);
  });
});

describe("indexGroupsByQuestionNumber", () => {
  it("maps every question in a group back to that same group object", () => {
    const rc = comp("rc1");
    const groups = buildComprehensionGroups([q(1, rc), q(2, rc), q(3)]);
    const index = indexGroupsByQuestionNumber(groups);
    expect(index.get(1)).toBe(index.get(2));
    expect(index.get(3)).not.toBe(index.get(1));
    expect(index.size).toBe(3);
  });
});

describe("letterFromIndex", () => {
  it("maps option indices to A-D", () => {
    expect([0, 1, 2, 3].map(letterFromIndex)).toEqual(["A", "B", "C", "D"]);
  });
});
