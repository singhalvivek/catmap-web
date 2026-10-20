// contrast.mjs — measure rendered text contrast against WCAG AA, on the running server
//
// Usage:  npm start                 (in one terminal)
//         npm run contrast          (in another)
//         npm run contrast -- /cat-prep/pyq
//
// Measures what the browser actually paints, rather than what the source says: it reads the
// computed colour of every leaf text node and walks up for the first non-transparent
// background. That is the only way to catch a token that is fine on paper and fails on the
// ink footer, which is exactly how the footer kickers sat at 2.59:1 unnoticed.
//
// Exits non-zero if anything is below AA, so it can gate a build.
import { chromium } from "playwright";

const BASE = process.env.SHOT_BASE_URL ?? "http://localhost:3000";

const DEFAULT_ROUTES = [
  "/",
  "/cat-prep",
  "/cat-prep/practice",
  "/cat-prep/pyq",
  "/cat-prep/daily-dose",
  "/cat-prep/how-to-prepare",
  "/cat-prep/daily-dose/essay",
  "/cat-prep/daily-dose/essay/archive",
  "/cat-prep/practice/varc/reading-comprehensions/1",
  "/cat-prep/practice/dilr/arrangements/1",
];

const routes = process.argv.slice(2);
const ROUTES = routes.length > 0 ? routes : DEFAULT_ROUTES;

function luminance([r, g, b]) {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG 1.4.3: 3:1 for large text (24px, or 18.66px bold), 4.5:1 otherwise. */
function threshold(size, weight) {
  const large = size >= 24 || (size >= 18.66 && Number(weight) >= 700);
  return large ? 3 : 4.5;
}

async function collect(page) {
  return page.evaluate(() => {
    const parse = (s) => (s.match(/\d+/g) ?? []).slice(0, 3).map(Number);

    function groundOf(el) {
      let node = el;
      while (node) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return parse(c);
        node = node.parentElement;
      }
      return [255, 255, 255];
    }

    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const text = (el.textContent ?? "").trim();
      // Leaf nodes only: a parent's colour is not what its children paint with.
      if (!text || el.children.length > 0) continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (Number(cs.opacity) === 0) continue;

      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;

      out.push({
        text: text.slice(0, 40),
        fg: parse(cs.color),
        bg: groundOf(el),
        size: parseFloat(cs.fontSize),
        weight: cs.fontWeight,
      });
    }
    return out;
  });
}

const browser = await chromium.launch();
let failures = 0;
let measured = 0;

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Let client-rendered states settle; several surfaces fetch before they paint.
    await page.waitForTimeout(900);

    const nodes = await collect(page);
    const bad = nodes
      .map((n) => ({ ...n, r: ratio(n.fg, n.bg) }))
      .filter((n) => n.r < threshold(n.size, n.weight))
      .sort((a, b) => a.r - b.r);

    measured += nodes.length;
    failures += bad.length;

    console.log(
      `${route} — ${bad.length === 0 ? "clean" : `${bad.length} below AA`} of ${nodes.length} text nodes`
    );
    for (const n of bad.slice(0, 10)) {
      console.log(
        `   ${n.r.toFixed(2)}:1  ${n.size}px/${n.weight}  needs ${threshold(n.size, n.weight)}:1  "${n.text}"`
      );
    }
    if (bad.length > 10) console.log(`   …and ${bad.length - 10} more`);
  } catch (err) {
    console.log(`${route} — could not measure: ${err.message}`);
    failures++;
  }
  await page.close();
}

await browser.close();
console.log(`\n${measured} text nodes measured, ${failures} below AA.`);
process.exit(failures === 0 ? 0 : 1);
