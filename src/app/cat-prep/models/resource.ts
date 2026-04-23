export type ResourceType = "VIDEO" | "ARTICLE";

export type Resource = {
  id: number;
  parent_id: number;
  title: string;
  type: ResourceType;
  link: string;
  order_index: number;
};
