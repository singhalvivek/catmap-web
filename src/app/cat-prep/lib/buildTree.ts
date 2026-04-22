import { Node } from "../models/node";

// Converts flat list of nodes into nested tree structure
export function buildTree(nodes: Node[]) {
  const map: Record<number, Node & { children: Node[] }> = {};
  const roots: (Node & { children: Node[] })[] = [];

  // Initialize map with empty children
  nodes.forEach((n) => {
    map[n.id] = { ...n, children: [] };
  });

  // Attach each node to its parent
  nodes.forEach((n) => {
    if (!n.parent_id) {
      roots.push(map[n.id]);
    } else {
      map[n.parent_id]?.children.push(map[n.id]);
    }
  });

  return roots;
}
