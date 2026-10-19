// treeLayout — how a topic renders its subtopics; a switch so alternatives can be compared
//
// The syllabus is ordered, and "the syllabus in order" is the product's actual claim. A
// wrapped grid of equal chips reads as an unordered SET: nothing tells a reader that
// Linear Equations comes before Quadratic Equations, or where in the path they are.
//
//  "chips" — the original wrap of equal pills. Compact, no sequence, ragged rows.
//  "list"  — one numbered row per subtopic on a connecting spine. Sequence explicit,
//            status aligned in a column, scans like a contents page.
//  "split" — the same ordered rows in two columns on desktop, one on mobile. Half the
//            height of "list" while keeping the numbering.
export type TreeLayout = "chips" | "list" | "split";

export const TREE_LAYOUT: TreeLayout = "list";
