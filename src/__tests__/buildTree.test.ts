import { describe, it, expect } from "vitest";
import { buildTree } from "../app/cat-prep/lib/buildTree";
import type { Node } from "../app/cat-prep/models/node";

const flat: Node[] = [
  { id: 1, parent_id: null, title: "Subject A", type: "SUBJECT", order_index: 1 },
  { id: 2, parent_id: 1,    title: "Topic A1",  type: "TOPIC",   order_index: 1 },
  { id: 3, parent_id: 1,    title: "Topic A2",  type: "TOPIC",   order_index: 2 },
  { id: 4, parent_id: 2,    title: "Sub A1a",   type: "SUBTOPIC",order_index: 1 },
  { id: 5, parent_id: 2,    title: "Sub A1b",   type: "SUBTOPIC",order_index: 2 },
];

describe("buildTree", () => {
  it("returns only root nodes at the top level", () => {
    const roots = buildTree(flat);
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe(1);
  });

  it("attaches children to the correct parent", () => {
    const roots = buildTree(flat);
    const subject = roots[0];
    expect(subject.children).toHaveLength(2);
    expect(subject.children!.map((c) => c.id)).toEqual([2, 3]);
  });

  it("nests subtopics under their topic", () => {
    const roots = buildTree(flat);
    const topic = roots[0].children![0];
    expect(topic.id).toBe(2);
    expect(topic.children).toHaveLength(2);
    expect(topic.children!.map((c) => c.id)).toEqual([4, 5]);
  });

  it("returns an empty array for empty input", () => {
    expect(buildTree([])).toEqual([]);
  });

  it("handles nodes whose parent does not exist without throwing", () => {
    const orphan: Node[] = [
      { id: 10, parent_id: 99, title: "Orphan", type: "SUBTOPIC", order_index: 1 },
    ];
    expect(() => buildTree(orphan)).not.toThrow();
    expect(buildTree(orphan)).toEqual([]);
  });

  it("handles multiple root nodes", () => {
    const multiRoot: Node[] = [
      { id: 1, parent_id: null, title: "Root 1", type: "SUBJECT", order_index: 1 },
      { id: 2, parent_id: null, title: "Root 2", type: "SUBJECT", order_index: 2 },
    ];
    expect(buildTree(multiRoot)).toHaveLength(2);
  });
});
