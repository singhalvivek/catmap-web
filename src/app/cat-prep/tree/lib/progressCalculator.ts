import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import { auth } from "@/lib/firebase";

/**
 * Get progress of a node based on completed SUBTOPIC descendants
 */
export function calculateNodeProgress(node: Node): {
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
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return { total, completed: 0, percent: 0 };
  }

  let completed = 0;

  subtopics.forEach((sub) => {
    let saved: string | null = null;

    if (typeof window !== "undefined") {
      saved = localStorage.getItem(`progress_${currentUser.uid}_${sub.id}`);
    }

    if (saved === ProgressStatus.COMPLETED) {
      completed++;
    }
  });

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, percent };
}