// RoadmapPreview — builds the real roadmap data for all three sections, from data.json
import data from "@/app/cat-prep/data.json";
import type { Node } from "@/app/cat-prep/models/node";
import { buildTree } from "@/app/cat-prep/lib/buildTree";
import { toSlug } from "@/app/cat-prep/lib/nodeMetadata";
import { SUBJECT_META } from "@/app/cat-prep/lib/subjectMeta";
import RoadmapPlate, { type PlateSubject } from "./RoadmapPlate";

/** buildTree types only the root as having children, so a recursive walk needs its own type. */
type TreeNode = Node & { children?: TreeNode[] };

/** buildTree pushes children in data.json array order, which is not order_index order —
 *  node 52 "Averages" was appended late with order_index 1. The roadmap sorts before
 *  rendering, so this must too, or the hero contradicts the page it is advertising. */
function ordered(node: TreeNode): TreeNode[] {
  return [...(node.children ?? [])].sort((a, b) => a.order_index - b.order_index);
}

/** Subtopics listed per open topic before the count takes over. */
const SUBTOPICS_SHOWN = 4;

export default function RoadmapPreview() {
  const tree = buildTree(data as Node[]) as TreeNode[];
  // Root (id 1, "CAT Preparation") is itself a SUBJECT; its children are the exam sections.
  const sections = ordered(tree[0] as TreeNode);
  if (sections.length === 0) return null;

  const subjects: PlateSubject[] = sections.map((section) => ({
    id: section.id,
    title: section.title,
    abbr: SUBJECT_META[section.id]?.abbr ?? section.title,
    topics: ordered(section).map((topic) => {
      const subs = ordered(topic);
      const shown = subs.slice(0, SUBTOPICS_SHOWN);
      return {
        id: topic.id,
        title: topic.title,
        href: `/cat-prep/${toSlug(topic.title)}`,
        total: subs.length,
        hidden: subs.length - shown.length,
        subtopics: shown.map((sub) => ({
          id: sub.id,
          title: sub.title,
          href: `/cat-prep/${toSlug(topic.title)}/${toSlug(sub.title)}`,
        })),
      };
    }),
  }));

  return <RoadmapPlate subjects={subjects} />;
}
