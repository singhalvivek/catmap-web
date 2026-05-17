// youtubeUtils — extracts YouTube video/playlist IDs, thumbnail URL, and embed URL from various link formats

const VIDEO_PATTERNS = [
  /[?&]v=([^&]+)/,        // youtube.com/watch?v=ID
  /youtu\.be\/([^?/]+)/,  // youtu.be/ID
  /\/embed\/([^?/]+)/,    // youtube.com/embed/ID
  /\/live\/([^?/]+)/,     // youtube.com/live/ID (live streams)
];

const PLAYLIST_PATTERN = /[?&]list=([^&]+)/;

export function extractYouTubeId(url: string): string | null {
  for (const pattern of VIDEO_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractPlaylistId(url: string): string | null {
  const match = url.match(PLAYLIST_PATTERN);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  const playlistId = extractPlaylistId(url);

  if (videoId) {
    return playlistId
      ? `https://www.youtube.com/embed/${videoId}?list=${playlistId}`
      : `https://www.youtube.com/embed/${videoId}`;
  }

  // Pure playlist URL (no video ID) — embed the whole playlist
  if (playlistId) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }

  return null;
}
