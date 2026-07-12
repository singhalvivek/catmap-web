// ResourceList — resources section: read-only thumbnail cards for curated videos and articles
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Resource } from "../../models/resource";
import { getYouTubeThumbnail } from "../../lib/youtubeUtils";

function ResourceThumbnail({ resource }: { resource: Resource }) {
  const [imgError, setImgError] = useState(false);
  const hasVideoThumb = resource.type === "VIDEO" || resource.type === "SERIES";
  const ytThumbnail =
    hasVideoThumb && !imgError ? getYouTubeThumbnail(resource.link) : null;

  const containerClass =
    "relative w-full aspect-video flex-shrink-0 md:w-28 md:aspect-auto md:self-stretch md:min-h-[72px] overflow-hidden";

  if (ytThumbnail) {
    return (
      <div className={containerClass}>
        <Image
          src={ytThumbnail}
          alt={resource.title}
          fill
          sizes="(max-width: 768px) 100vw, 112px"
          style={{ objectFit: "cover" }}
          onError={() => setImgError(true)}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(220,38,38,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff",
              paddingLeft: 2,
            }}
          >
            ▶
          </div>
        </div>
      </div>
    );
  }

  const isVideo = resource.type === "VIDEO" || resource.type === "SERIES";
  return (
    <div
      aria-hidden
      className={`${containerClass} flex items-center justify-center text-2xl`}
      style={{ background: isVideo ? "#FEF2F2" : "#EEF2FF" }}
    >
      {isVideo ? "▶" : "📄"}
    </div>
  );
}

export default function ResourceList({
  originalResources,
  onOpen,
}: {
  originalResources: Resource[];
  onOpen: (resource: Resource) => void;
}) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        className="font-bold uppercase mb-2.5"
        style={{ fontSize: 12, color: "#1E3A5F", letterSpacing: "0.5px" }}
      >
        Resources
      </div>

      {originalResources.length === 0 ? (
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: "#F8FAFC",
            border: "1.5px dashed #CBD5E1",
            textAlign: "center",
            color: "#94A3B8",
            fontSize: 13,
          }}
        >
          No resources yet — message us to suggest one!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {originalResources.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpen(r)}
              className="flex flex-col md:flex-row text-left w-full"
              style={{
                padding: 0,
                borderRadius: 10,
                border: "1.5px solid #E8EAF0",
                background: "#fff",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1.5px solid #14B8A6";
                e.currentTarget.style.background = "#F0FDFA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1.5px solid #E8EAF0";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <ResourceThumbnail resource={r} />
              <div
                className="flex items-center gap-3 flex-1"
                style={{ padding: "10px 14px", minWidth: 0 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="font-semibold text-trust-navy"
                    style={{
                      fontSize: 13,
                      marginBottom: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.type === "SERIES" ? r.instructor ?? "Video series" : r.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    {r.type === "SERIES"
                      ? `Series · ${r.items?.length ?? 0} videos`
                      : r.type}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="font-bold"
                  style={{ color: "#14B8A6", fontSize: 13, flexShrink: 0 }}
                >
                  ▶
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
