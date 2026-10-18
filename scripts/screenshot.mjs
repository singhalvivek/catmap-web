// screenshot.mjs — capture the running dev server at several viewports, for visual review
//
// Usage:  npm run dev           (in one terminal)
//         npm run shot          (in another)
//         npm run shot -- /cat-prep/pyq /cat-prep/practice
//
// Writes PNGs to .screenshots/ (git-ignored). Needs Chromium:
//         npx playwright install chromium
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.SHOT_BASE_URL ?? "http://localhost:3000";
const OUT = process.env.SHOT_OUT ?? ".screenshots";

const routes = process.argv.slice(2);
const ROUTES = routes.length > 0 ? routes : ["/", "/cat-prep"];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

/** "/" -> "home"; "/cat-prep/pyq" -> "cat-prep-pyq" */
function slugify(route) {
  const trimmed = route.replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "home" : trimmed.replace(/\//g, "-");
}

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

try {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
      });

      try {
        await page.goto(`${BASE}${route}`, {
          waitUntil: "networkidle",
          timeout: 120000,
        });
        // Fonts resolve after networkidle; without this the serif can capture as fallback.
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);

        const stem = `${OUT}/${slugify(route)}-${viewport.name}`;
        await page.screenshot({ path: `${stem}-top.png` });

        // Scroll reveals replay, so they also un-reveal once an element is fully out of
        // view — walking the page is not enough for a fullPage shot, because everything
        // resets on the way back up. The hidden state is scoped to [data-anim="on"], so
        // dropping that attribute settles every element into its revealed position.
        await page.evaluate(() => {
          document.documentElement.removeAttribute("data-anim");
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${stem}-full.png`, fullPage: true });

        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const overflows = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth
        );
        console.log(
          `${route} @ ${viewport.width}px — ${height}px tall${overflows ? "  ⚠ HORIZONTAL OVERFLOW" : ""}`
        );
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`\nWrote PNGs to ${OUT}/`);
