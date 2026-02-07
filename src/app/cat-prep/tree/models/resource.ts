// Represents a learning resource (video / article) linked to a node
export type Resource = {
  id: number;
  parent_id: number;        // id of node in data.json this resource belongs to
  youtubevideo_title: string;
  type: "VIDEO" | "ARTICLE";
  link: string;
  order_index: number;
};
