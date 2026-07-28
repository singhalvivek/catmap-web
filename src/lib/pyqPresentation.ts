// pyqPresentation — pure display helpers shared by the PYQ browse player and the server-rendered paper
import type { PyqComprehension } from "@/app/cat-prep/models/pyq";

type Groupable = { questionNumber: number; comprehension: PyqComprehension | null };

export type PyqComprehensionGroup<Q extends Groupable> = {
  comprehensionId: string | null;
  comprehensionText: string | null;
  comprehensionImages: string[];
  comprehensionImagePositions?: number[];
  questions: Q[];
};

// Consecutive questions sharing one comprehension become a single group, so a passage
// renders once above the questions that use it. Standalone questions are groups of one.
export function buildComprehensionGroups<Q extends Groupable>(
  questions: Q[]
): PyqComprehensionGroup<Q>[] {
  const groups: PyqComprehensionGroup<Q>[] = [];
  for (const q of questions) {
    const last = groups[groups.length - 1];
    if (q.comprehension && last && last.comprehensionId === q.comprehension.id) {
      last.questions.push(q);
    } else {
      groups.push({
        comprehensionId: q.comprehension?.id ?? null,
        comprehensionText: q.comprehension?.text ?? null,
        comprehensionImages: q.comprehension?.imageUrls ?? [],
        comprehensionImagePositions: q.comprehension?.imagePositions,
        questions: [q],
      });
    }
  }
  return groups;
}

// The player navigates one question at a time, so it needs to look a group up by the
// question it is currently showing rather than iterate groups in order.
export function indexGroupsByQuestionNumber<Q extends Groupable>(
  groups: PyqComprehensionGroup<Q>[]
): Map<number, PyqComprehensionGroup<Q>> {
  const byQuestionNumber = new Map<number, PyqComprehensionGroup<Q>>();
  for (const group of groups) {
    for (const q of group.questions) byQuestionNumber.set(q.questionNumber, group);
  }
  return byQuestionNumber;
}

export function letterFromIndex(index: number): string {
  return String.fromCharCode(65 + index);
}
