// treeLayout — how the syllabus renders, plus the geometry of the route the "path" layout draws
//
// "tree" — topics and subtopics nested on drawn connectors. Shows CONTAINMENT: what sits
//          inside what. Compact, scannable, reads as a syllabus outline.
//
// "path" — the same data as a route. Topics become numbered stations on a line that weaves
//          down the page and fills with your progress, so the page answers "how far am I
//          and what is next" at a glance rather than "what exists". Taller, and more
//          motivating once a reader has started. Closer to the product's own name — naksha
//          means map.
export type TreeLayout = "tree" | "path";

export const TREE_LAYOUT: TreeLayout = "path";

/**
 * Station centres, as a percentage of the route column's width. They alternate so the line
 * weaves instead of ruling straight down — a straight vertical line is a margin, a line
 * that bends is a road, and that is most of the difference between this and a numbered
 * list.
 */
const STATION_X = [22, 74] as const;

export function stationX(station: number): number {
  return STATION_X[(station - 1) % STATION_X.length];
}

/**
 * The bend that carries the road from one station across to the next, drawn in a 0–100 box
 * of fixed height. Only the bend is drawn; the rest of the leg is a straight rule at the
 * arriving x. One stretched S across the whole leg was the obvious alternative and it fails
 * on an expanded topic: 44px of drift over 400px of height is four degrees off vertical,
 * which is to say straight. A fixed bend weaves the same whatever the row is doing.
 */
export function bendPath(station: number): string {
  const from = stationX(station);
  const to = stationX(station + 1);
  return `M${from} 0 C ${from} 44, ${to} 56, ${to} 100`;
}
