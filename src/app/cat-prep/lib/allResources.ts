// allResources — the single merged resource list used by every roadmap page.
// Combines curated resources.json with the per-instructor SERIES built from
// videoSeries.json (keyed by subtopic node id). Import ALL_RESOURCES everywhere
// a page renders <RoadmapContent> so Ravi's series show on every route, not just "/".
import resources from "../resources.json";
import videoSeries from "../videoSeries.json";
import { Resource, SeriesItem } from "../models/resource";

type VideoSeriesDoc = {
  instructor: string;
  subject: string;
  series: { id: number; name: string; items: SeriesItem[] }[];
};

function seriesToResources(doc: VideoSeriesDoc): Resource[] {
  return doc.series
    .filter((s) => s.items.length > 0)
    .map((s, i) => ({
      id: 100000 + i, // dedicated id range, never collides with resources.json
      parent_id: s.id,
      title: `${doc.instructor} — ${s.name}`,
      type: "SERIES" as const,
      link: s.items[0].url,
      order_index: -1, // show the instructor series above other resources
      instructor: doc.instructor,
      items: s.items,
    }));
}

export const ALL_RESOURCES: Resource[] = [
  ...seriesToResources(videoSeries as VideoSeriesDoc),
  ...(resources as Resource[]),
];
