import data from "./data.json";

type Node = {
  id: number;
  parent_id: number | "";
  title: string;
  type: string;
  order_index: number;
};

function buildTree(nodes: Node[]) {
  const map: Record<number, any> = {};
  const roots: any[] = [];

  nodes.forEach((n) => {
    map[n.id] = { ...n, children: [] };
  });

  nodes.forEach((n) => {
    if (n.parent_id === "" || n.parent_id === null) {
      roots.push(map[n.id]);
    } else {
      map[n.parent_id]?.children.push(map[n.id]);
    }
  });

  return roots;
}

function Tree({ nodes }: { nodes: any[] }) {
  return (
    <ul className="ml-4 list-disc">
      {nodes
        .sort((a, b) => a.order_index - b.order_index)
        .map((node) => (
          <li key={node.id}>
            <span className="font-medium">
              {node.title} <span className="text-xs text-gray-500">({node.type})</span>
            </span>
            {node.children.length > 0 && <Tree nodes={node.children} />}
          </li>
        ))}
    </ul>
  );
}

export default function CatPrepPage() {
  const tree = buildTree(data as Node[]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">CAT Preparation</h1>
      <Tree nodes={tree} />
    </div>
  );
}
