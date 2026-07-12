import { describe, it, expect } from "vitest";
import { interleaveImages } from "../lib/interleaveImages";

const P = "para0\n\npara1\n\npara2\n\npara3\n\npara4\n\npara5\n\npara6"; // 7 paragraphs

describe("interleaveImages", () => {
  it("places each image after the given number of paragraphs (javelin passage)", () => {
    // Real CAT 2021 Slot 3 javelin set: 7 paragraphs, tables at positions [4, 5]
    const items = interleaveImages(P, ["first.png", "third.png"], [4, 5]);
    const shape = items.map((i) => (i.kind === "text" ? i.value : `IMG:${i.url}`));
    expect(shape).toEqual([
      "para0",
      "para1",
      "para2",
      "para3", // "...first round" caption
      "IMG:first.png",
      "para4", // "...third round" caption
      "IMG:third.png",
      "para5",
      "para6",
    ]);
  });

  it("emits an image at position 0 before the first paragraph", () => {
    const items = interleaveImages("a\n\nb", ["x.png"], [0]);
    expect(items.map((i) => (i.kind === "text" ? i.value : "IMG"))).toEqual(["IMG", "a", "b"]);
  });

  it("emits trailing images when position equals the paragraph count", () => {
    const items = interleaveImages("a\n\nb", ["x.png"], [2]);
    expect(items.map((i) => (i.kind === "text" ? i.value : "IMG"))).toEqual(["a", "b", "IMG"]);
  });

  it("interleaves several images at distinct positions (explanation)", () => {
    const text = Array.from({ length: 16 }, (_, i) => `s${i}`).join("\n\n"); // 16 paragraphs
    const items = interleaveImages(text, ["a", "b", "c", "d"], [2, 4, 7, 15]);
    const imgAfter = items
      .map((it, idx) => ({ it, idx }))
      .filter((x) => x.it.kind === "image")
      .map((x) => (items[x.idx - 1] as { value: string }).value);
    // each image sits right after paragraph (position - 1)
    expect(imgAfter).toEqual(["s1", "s3", "s6", "s14"]);
  });

  it("falls back to text-then-appended-images when positions are missing", () => {
    const items = interleaveImages("a\n\nb", ["x.png", "y.png"]);
    expect(items.map((i) => (i.kind === "text" ? i.value : `IMG:${i.url}`))).toEqual([
      "a\n\nb",
      "IMG:x.png",
      "IMG:y.png",
    ]);
  });

  it("falls back when positions length does not match image count", () => {
    const items = interleaveImages("a\n\nb", ["x.png", "y.png"], [1]); // mismatch
    expect(items.map((i) => (i.kind === "text" ? i.value : "IMG"))).toEqual(["a\n\nb", "IMG", "IMG"]);
  });

  it("handles image-only blocks (no paragraphs)", () => {
    const items = interleaveImages("", ["x.png"], [0]);
    expect(items).toEqual([{ kind: "image", url: "x.png", key: "img-0" }]);
  });
});
