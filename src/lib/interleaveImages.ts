// interleaveImages — pure ordering logic shared by InlineImageText.
//
// `imagePositions[i]` is the number of paragraphs (the "\n\n"-separated segments of
// `text`) that precede image `i`, so an image with position k renders after the first
// k paragraphs. Returns text/image items in final render order.
//
// When positions are absent or don't line up with the image list (a doc not yet
// backfilled), it falls back to the legacy layout: the whole text, then every image
// appended at the end.

export type InlineItem =
  | { kind: "text"; value: string; key: string }
  | { kind: "image"; url: string; key: string };

export function interleaveImages(
  text: string,
  imageUrls: string[],
  imagePositions?: number[]
): InlineItem[] {
  const urls = imageUrls ?? [];
  const positions = imagePositions ?? [];
  const aligned = urls.length > 0 && positions.length === urls.length;
  const items: InlineItem[] = [];

  if (!aligned) {
    if (text) items.push({ kind: "text", value: text, key: "text" });
    urls.forEach((url, i) => items.push({ kind: "image", url, key: `img-${i}` }));
    return items;
  }

  const paragraphs = text ? text.split("\n\n") : [];
  const emitImagesAt = (paraCount: number) =>
    urls.forEach((url, i) => {
      if (positions[i] === paraCount) items.push({ kind: "image", url, key: `img-${i}` });
    });

  for (let j = 0; j < paragraphs.length; j++) {
    emitImagesAt(j);
    const segment = paragraphs[j];
    if (segment && segment.trim()) items.push({ kind: "text", value: segment, key: `para-${j}` });
  }
  // Trailing images (position at or past the last paragraph).
  urls.forEach((url, i) => {
    if (positions[i] >= paragraphs.length) items.push({ kind: "image", url, key: `img-${i}` });
  });

  return items;
}
