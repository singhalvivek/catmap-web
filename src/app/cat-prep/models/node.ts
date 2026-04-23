export type NodeType = "SUBJECT" | "TOPIC" | "SUBTOPIC";

export type Node = {
  id: number;
  parent_id: number | null;
  title: string;
  type: NodeType;
  order_index: number;
  children?: Node[];
};
