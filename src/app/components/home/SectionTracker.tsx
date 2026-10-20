// SectionTracker — scroll-reveal animation plus section-view and scroll-depth analytics
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/components/analytics";
import { useScrollReveal } from "@/app/lib/useScrollReveal";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

/** Reveal a little before the element is fully on screen, so it is never caught mid-fade. */
const REVEAL_MARGIN = "0px 0px -12% 0px";

const REVEAL_SELECTOR =
  ".reveal, .reveal-fade, .reveal-rule, .reveal-bar, .reveal-left, .reveal-pop, .reveal-mask";

/** Visible fraction at which an element reveals. It only resets at a ratio of 0. */
const REVEAL_RATIO = 0.12;

/** Pixels of drift per pixel scrolled, for elements marked data-parallax. */
const PARALLAX_RATE = 0.06;

const COUNTUP_MS = 1100;

/** Decelerating curve, matching --ease-out-expo so the digits feel like the rest. */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Counts an element's number up from zero. The element's server-rendered text is the
 * source of truth and is restored exactly on the final frame, so a figure can never be
 * left showing a rounded intermediate value.
 */
function runCountUp(el: HTMLElement) {
  const finalText = el.textContent ?? "";
  const match = finalText.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return;

  const grouped = digits.includes(",");
  const start = performance.now();

  function frame(now: number) {
    const t = Math.min(1, (now - start) / COUNTUP_MS);
    if (t >= 1) {
      el.textContent = finalText;
      return;
    }
    const value = Math.round(target * easeOutExpo(t));
    el.textContent =
      prefix + (grouped ? value.toLocaleString("en-IN") : String(value)) + suffix;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/** A reveal target may itself be the figure, or merely contain it. */
function countUpTarget(el: HTMLElement): HTMLElement | null {
  return el.matches(".countup") ? el : el.querySelector<HTMLElement>(".countup");
}

type Props = {
  /** Identifies which home page fired the event, so preview traffic stays separable. */
  page: string;
};

/**
 * Renders nothing. It observes `[data-section]` elements that the server rendered, which is
 * why the content components no longer need to be client components to be measured.
 */
export default function SectionTracker({ page }: Props) {
  /*
   * Scroll reveal. The observer itself lives in useScrollReveal, which the syllabus route
   * on /cat-prep also uses; what is specific to the home page is the count-up riding along
   * with it, so only that stays here.
   */
  useScrollReveal({
    selector: REVEAL_SELECTOR,
    ratio: REVEAL_RATIO,
    margin: REVEAL_MARGIN,
    onReveal: (el) => {
      // Digits start running with the reveal, offset by that element’s own stagger.
      const counter = countUpTarget(el);
      if (!counter || counter.dataset.counted) return;
      counter.dataset.counted = "true";
      const delay = Number.parseInt(el.style.getPropertyValue("--reveal-delay"), 10);
      window.setTimeout(() => runCountUp(counter), Number.isFinite(delay) ? delay : 0);
    },
    onReset: (el) => {
      // Let the digits run again next time this comes back into view.
      const counter = countUpTarget(el);
      if (counter) delete counter.dataset.counted;
    },
  });

  useEffect(() => {
    const fired = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section");
          if (!id || fired.has(id)) return;
          fired.add(id);
          trackEvent("section_viewed", { section_id: id, page });
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    const fired = new Set<number>();
    const root = document.documentElement;
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    function measure() {
      frame = 0;
      const total = root.scrollHeight;
      if (total <= 0) return;

      // Reading progress: how much of the page has passed the bottom of the viewport.
      const scrollable = total - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1;
      root.style.setProperty("--read-progress", ratio.toFixed(4));

      /*
       * Continuous drift, so the page keeps responding between reveal thresholds rather
       * than sitting still. Measured against the element's own position in the viewport,
       * so it reads as depth rather than as a fixed offset that grows down the page.
       */
      if (!reduced) {
        const mid = window.innerHeight / 2;
        for (const el of parallax) {
          const box = el.getBoundingClientRect();
          const rate = Number(el.dataset.parallax) || PARALLAX_RATE;
          const offset = (box.top + box.height / 2 - mid) * -rate;
          el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        }
      }

      const pct = Math.round(((window.scrollY + window.innerHeight) / total) * 100);
      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackEvent("scroll_depth", { depth_percent: threshold, page });
        }
      }
    }

    // Coalesce to one measurement per frame — scroll fires far more often than that.
    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(measure);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--read-progress");
      parallax.forEach((el) => el.style.removeProperty("--parallax-y"));
    };
  }, [page]);

  return null;
}
