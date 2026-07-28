// NodeContent — server-rendered description, resource list and sibling links for one roadmap node
import Link from "next/link";
import type { Node } from "../models/node";
import type { Resource } from "../models/resource";
import { toSlug } from "../lib/nodeMetadata";

type Props = {
  node: Node;
  /** Absent for a topic; the parent topic for a subtopic. */
  parent?: Node;
  description?: string;
  resources: Resource[];
  /** Sibling subtopics for a subtopic page, child subtopics for a topic page. */
  related: Node[];
  relatedTopicSlug: string;
  relatedHeading: string;
};

const RESOURCE_LABEL: Record<Resource["type"], string> = {
  VIDEO: "Video",
  ARTICLE: "Article",
  SERIES: "Video series",
};

export default function NodeContent({
  node,
  parent,
  description,
  resources,
  related,
  relatedTopicSlug,
  relatedHeading,
}: Props) {
  const context = parent ? `${parent.title} · CAT` : "CAT";

  return (
    <section className="mx-auto w-full max-w-[1120px] border-t border-slate-200 px-6 pb-16 pt-10">
      <h2 className="m-0 mb-1 text-xl font-extrabold tracking-tight text-trust-navy">
        {node.title} for CAT
      </h2>
      <p className="m-0 mb-5 text-[13px] font-semibold uppercase tracking-wide text-slate-400">{context}</p>

      {description && (
        <p className="m-0 mb-8 max-w-[70ch] text-[15px] leading-[1.8] text-slate-700">{description}</p>
      )}

      {resources.length > 0 && (
        <>
          <h3 className="m-0 mb-3 text-[15px] font-bold text-trust-navy">
            Free resources for {node.title}
          </h3>
          <ul className="m-0 mb-9 list-none p-0">
            {resources.map((r) => (
              <li key={r.id} className="mb-2">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[14px] font-semibold text-teal-700 no-underline hover:underline"
                >
                  {r.title}
                </a>
                <span className="ml-2 text-[12px] text-slate-400">
                  {RESOURCE_LABEL[r.type]}
                  {r.instructor ? ` · ${r.instructor}` : ""}
                  {r.items?.length ? ` · ${r.items.length} videos` : ""}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {related.length > 0 && (
        <>
          <h3 className="m-0 mb-3 text-[15px] font-bold text-trust-navy">{relatedHeading}</h3>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {related.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/cat-prep/${relatedTopicSlug}/${toSlug(n.title)}`}
                  className="inline-block rounded-lg border-[1.5px] border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-trust-navy no-underline"
                >
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
