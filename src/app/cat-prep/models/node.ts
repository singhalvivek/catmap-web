// Represents a single syllabus node (subject / topic / subtopic)
export type Node = {
  id: number;
  parent_id: number | null | "";
  title: string;
  type: string;
  order_index: number;
  children?: Node[];
};
