// resource — learning resource domain type and ResourceType union
export type ResourceType = "VIDEO" | "ARTICLE" | "SERIES";

// SeriesItem — one video within a SERIES resource (an instructor's ordered set)
export type SeriesItem = {
  title: string;
  url: string;
  // false when the uploader disabled embedding — the viewer shows a "watch on YouTube" notice
  embeddable?: boolean;
};

export type Resource = {
  id: number;
  parent_id: number;
  title: string;
  type: ResourceType;
  link: string;
  order_index: number;
  // SERIES only: the teacher whose set this is, and the ordered videos
  instructor?: string;
  items?: SeriesItem[];
};
