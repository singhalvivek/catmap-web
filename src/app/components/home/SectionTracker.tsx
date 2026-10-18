// SectionTracker — scroll-reveal animation plus section-view and scroll-depth analytics
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/components/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

/** Reveal a little before the element is fully on screen, so it is never caught mid-fade. */
const REVEAL_MARGIN = "0px 0px -12% 0px";

const REVEAL_SELECTOR =
  ".reveal, .reveal-rule, .reveal-bar, .reveal-left, .reveal-pop, .reveal-mask";

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

type Props = {
  /** Identifies which home page fired the event, so preview traffic stays separable. */
  page: string;
};

/**
 * Renders nothing. It observes `[data-section]` elements that the server rendered, which is
 * why the content components no longer need to be client components to be measured.
 */
export default function SectionTracker({ page }: Props) {
  // Scroll reveal. The data-anim flag is set here rather than rendered on the server, so
  // the hidden CSS state can only ever exist once this effect has run and can undo it.
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (targets.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    root.setAttribute("data-anim", "on");

    /*
     * Hysteresis: reveal once the element is 12% visible, but only reset once it is fully
     * out of view. A single threshold would flip the class back and forth while scrolling
     * slowly across the boundary. Elements are never unobserved, so the reveal replays
     * every time the element comes back — scrolling up and down keeps the page alive.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            el.classList.remove("is-visible");
            const counter = el.matches(".countup")
              ? el
              : el.querySelector<HTMLElement>(".countup");
            // Let the digits run again next time this comes back into view.
            if (counter) delete counter.dataset.counted;
            return;
          }

          if (entry.intersectionRatio < REVEAL_RATIO) return;
          el.classList.add("is-visible");

          // Digits start running with the reveal, offset by that element's own stagger.
          const counter = el.matches(".countup")
            ? el
            : el.querySelector<HTMLElement>(".countup");
          if (counter && !counter.dataset.counted) {
            counter.dataset.counted = "true";
            const delay = Number.parseInt(el.style.getPropertyValue("--reveal-delay"), 10);
            window.setTimeout(
              () => runCountUp(counter),
              Number.isFinite(delay) ? delay : 0
            );
          }
        });
      },
      { threshold: [0, REVEAL_RATIO], rootMargin: REVEAL_MARGIN }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.removeAttribute("data-anim");
    };
  }, []);

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
