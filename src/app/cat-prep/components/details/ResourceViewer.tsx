// ResourceViewer — embedded iframe viewer; splits into player + scrollable video list for YouTube playlists
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Resource } from "../../models/resource";
import { extractPlaylistId, extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from "../../lib/youtubeUtils";
import { YOUTUBE_API_KEY } from "@/config/env";

type ResourceViewerProps = {
  resource: Resource;
  onBack: () => void;
};

type PlaylistItem = {
  videoId: string;
  title: string;
  thumbnail: string;
};

type YouTubePlaylistResponse = {
  items?: Array<{
    snippet: {
      title: string;
      resourceId: { videoId: string };
      thumbnails?: { medium?: { url: string }; default?: { url: string } };
    };
  }>;
};

// Shown in place of the player when a video's uploader has disabled embedding.
// Honest > broken: we own the interruption and ask them to come right back.
function EmbedBlockedNotice({ videoId }: { videoId: string | null }) {
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
        padding: 24,
        background: "#FFFDF8",
      }}
    >
      <div aria-hidden style={{ fontSize: 30 }}>📺</div>
      <div className="font-bold text-trust-navy" style={{ fontSize: 15 }}>
        Its creator turned off in-site playback
      </div>
      <p style={{ fontSize: 13, color: "#64748B", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
        Please watch and finish this video and don&apos;t get lost, we are waiting for you.
      </p>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 6,
          display: "inline-block",
          padding: "9px 18px",
          borderRadius: 8,
          background: "#14B8A6",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Watch on YouTube ↗
      </a>
    </div>
  );
}

export default function ResourceViewer({ resource, onBack }: ResourceViewerProps) {
  const playlistId =
    resource.type === "VIDEO" ? extractPlaylistId(resource.link) : null;
  const initialVideoId =
    resource.type === "VIDEO" || resource.type === "SERIES"
      ? extractYouTubeId(resource.link)
      : null;
  // A SERIES carries its own ordered items — same player+list UI as a YouTube
  // playlist, but sourced from resource.items instead of the Data API.
  const seriesItems = resource.type === "SERIES" ? resource.items ?? null : null;

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(() => !!playlistId && !!YOUTUBE_API_KEY);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [prevPlaylistId, setPrevPlaylistId] = useState(playlistId);

  if (prevPlaylistId !== playlistId) {
    setPrevPlaylistId(playlistId);
    setLoadingItems(!!playlistId && !!YOUTUBE_API_KEY);
    setItemsError(null);
    setPlaylistItems([]);
    setSelectedVideoId(null);
  }

  useEffect(() => {
    if (!playlistId || !YOUTUBE_API_KEY) return;
    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data: YouTubePlaylistResponse & { error?: { message: string } }) => {
        if (data.error) throw new Error(data.error.message);
        setPlaylistItems(
          (data.items ?? []).map((item) => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail:
              item.snippet.thumbnails?.medium?.url ??
              item.snippet.thumbnails?.default?.url ??
              "",
          }))
        );
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("YouTube playlist fetch failed:", msg);
        setItemsError(msg);
      })
      .finally(() => setLoadingItems(false));
  }, [playlistId]);

  const activeVideoId = selectedVideoId ?? initialVideoId;

  function buildEmbedUrl() {
    const ap = autoplay ? "&autoplay=1" : "";
    if (activeVideoId && playlistId)
      return `https://www.youtube.com/embed/${activeVideoId}?list=${playlistId}${ap}`;
    if (activeVideoId)
      return `https://www.youtube.com/embed/${activeVideoId}${ap ? `?${ap.slice(1)}` : ""}`;
    return getYouTubeEmbedUrl(resource.link) ?? resource.link;
  }

  const iframeSrc = buildEmbedUrl();
  const isPlaylist = playlistId !== null;

  // Unified list for both playlists (API-fetched) and series (from resource.items)
  const listItems: PlaylistItem[] = seriesItems
    ? seriesItems.map((it, i) => ({
        videoId: extractYouTubeId(it.url) ?? "",
        title: it.title || `Video ${i + 1}`,
        thumbnail: getYouTubeThumbnail(it.url) ?? "",
      }))
    : playlistItems;
  const showList = isPlaylist || seriesItems !== null;

  // Videos flagged embeddable:false in videoSeries.json can't play in an iframe —
  // swap the player for an honest notice + link out instead of a broken frame.
  const embedFlag = new Map<string, boolean>();
  if (seriesItems) {
    for (const it of seriesItems) {
      const vid = extractYouTubeId(it.url);
      if (vid) embedFlag.set(vid, it.embeddable !== false);
    }
  }
  const activeEmbeddable = activeVideoId ? embedFlag.get(activeVideoId) ?? true : true;

  function handleVideoSelect(videoId: string) {
    setSelectedVideoId(videoId);
    setAutoplay(true);
  }

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #E2E8F0",
          background: "#FFFDF8",
        }}
      >
        <button
          onClick={onBack}
          aria-label="Back to resources"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#1E3A5F",
            fontSize: 13,
            fontFamily: "inherit",
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span aria-hidden>←</span> Back
        </button>

        <div
          className="font-semibold text-trust-navy flex-1 min-w-0"
          style={{
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={resource.title}
        >
          {resource.title}
        </div>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#14B8A6",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            flexShrink: 0,
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #14B8A6",
            whiteSpace: "nowrap",
          }}
        >
          ↗ Open in New Tab
        </a>
      </div>

      {showList ? (
        <>
          {/* Player — aspect-ratio keeps it proportional at any panel width */}
          <div
            className="flex-shrink-0 w-full"
            style={{ aspectRatio: "16/9", position: "relative" }}
          >
            {activeEmbeddable ? (
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                title={resource.title}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <EmbedBlockedNotice videoId={activeVideoId} />
            )}
          </div>

          {/* Playlist items */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ borderTop: "1px solid #E2E8F0" }}
          >
            <div
              className="font-bold uppercase"
              style={{
                padding: "10px 16px 6px",
                fontSize: 11,
                color: "#1E3A5F",
                letterSpacing: "0.5px",
              }}
            >
              {seriesItems
                ? `Series · ${listItems.length} videos`
                : loadingItems
                ? "Playlist"
                : listItems.length > 0
                ? `Playlist · ${listItems.length} videos`
                : "Playlist"}
            </div>

            {isPlaylist && loadingItems && (
              <div
                style={{ padding: 20, textAlign: "center", color: "#94A3B8", fontSize: 13 }}
              >
                Loading videos…
              </div>
            )}

            {isPlaylist && !loadingItems && (itemsError || playlistItems.length === 0) && (
              <div style={{ padding: "12px 16px" }}>
                {itemsError && (
                  <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>
                    {itemsError}
                  </p>
                )}
                <a
                  href={`https://www.youtube.com/playlist?list=${playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#14B8A6",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View all videos on YouTube ↗
                </a>
                {!YOUTUBE_API_KEY && (
                  <p style={{ marginTop: 6, fontSize: 12, color: "#94A3B8" }}>
                    Add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local and restart the dev server.
                  </p>
                )}
              </div>
            )}

            {!loadingItems &&
              listItems.map((item, idx) => {
                const isActive =
                  selectedVideoId === item.videoId ||
                  (!selectedVideoId && initialVideoId === item.videoId);
                return (
                  <button
                    key={item.videoId}
                    onClick={() => handleVideoSelect(item.videoId)}
                    className="flex items-center gap-3 w-full text-left"
                    style={{
                      padding: "8px 16px",
                      background: isActive ? "#F0FDFA" : "transparent",
                      border: "none",
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Index number */}
                    <span
                      style={{
                        fontSize: 11,
                        color: isActive ? "#14B8A6" : "#94A3B8",
                        width: 18,
                        textAlign: "right",
                        flexShrink: 0,
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {isActive ? "▶" : idx + 1}
                    </span>

                    {/* Thumbnail */}
                    {item.thumbnail ? (
                      <div
                        style={{
                          position: "relative",
                          width: 80,
                          height: 45,
                          flexShrink: 0,
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 80,
                          height: 45,
                          flexShrink: 0,
                          borderRadius: 4,
                          background: "#FEF2F2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        ▶
                      </div>
                    )}

                    {/* Title */}
                    <div
                      className="line-clamp-2"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: isActive ? "#0F766E" : "#1E3A5F",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {item.title}
                    </div>
                  </button>
                );
              })}
          </div>
        </>
      ) : (
        /* Regular video or article — full height iframe */
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <iframe
            src={iframeSrc}
            title={resource.title}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
