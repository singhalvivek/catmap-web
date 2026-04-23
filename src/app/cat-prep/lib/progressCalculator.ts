// progressCalculator — computes completion percentage for a tree node from the progress map
import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";

export function calculateNodeProgress(
  node: Node,
  progress: Record<number, ProgressStatus>
): {
  total: number;
  completed: number;
  percent: number;
} {
  const subtopics: Node[] = [];

  function collectSubtopics(n: Node) {
    if (n.type === "SUBTOPIC") {
      subtopics.push(n);
    }
    n.children?.forEach(collectSubtopics);
  }

  collectSubtopics(node);

  const total = subtopics.length;
  const completed = subtopics.filter(
    (sub) => progress[sub.id] === ProgressStatus.COMPLETED
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, percent };
}
