// treeLayout — how the syllabus renders; a switch so alternatives can be compared as pixels
//
// "tree" — topics and subtopics nested on drawn connectors. Shows CONTAINMENT: what sits
//          inside what. Compact, scannable, reads as a syllabus outline.
//
// "path" — the same data as a route. Topics become numbered stations on a line that fills
//          with your progress, so the page answers "how far am I and what is next" at a
//          glance rather than "what exists". Taller, and more motivating when a reader has
//          actually started. Closer to the product's own name — naksha means map.
export type TreeLayout = "tree" | "path";

export const TREE_LAYOUT: TreeLayout = "path";
