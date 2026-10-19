// useScrollReveal — hysteresis IntersectionObserver that drives the .is-visible reveal classes
"use client";

import { useEffect, useRef } from "react";

/** Reveal a little before the element is fully on screen, so it is never caught mid-fade. */
const DEFAULT_MARGIN = "0px 0px -12% 0px";

/** Visible fraction at which an element reveals. It only resets at a ratio of 0. */
const DEFAULT_RATIO = 0.12;

/**
 * The hidden state lives behind [data-anim="on"], which is set here rather than rendered on
 * the server: the CSS that hides things can only exist once the script that un-hides them is
 * running. Two surfaces can observe at once, so the flag is reference counted — otherwise
 * the first to unmount would strip the attribute out from under the second.
 */
let animUsers = 0;

function claimAnimFlag() {
  animUsers += 1;
  document.documentElement.setAttribute("data-anim", "on");
}

function releaseAnimFlag() {
  animUsers = Math.max(0, animUsers - 1);
  if (animUsers === 0) document.documentElement.removeAttribute("data-anim");
}

type RevealCallback = (el: HTMLElement) => void;

export function useScrollReveal({
  selector,
  ratio = DEFAULT_RATIO,
  margin = DEFAULT_MARGIN,
  resetKey,
  onReveal,
  onReset,
}: {
  selector: string;
  ratio?: number;
  margin?: string;
  /** Re-queries the DOM when this changes — for lists that remount under a new key. */
  resetKey?: string | number;
  onReveal?: RevealCallback;
  onReset?: RevealCallback;
}) {
  /*
   * The callbacks are held in refs rather than listed as dependencies. Both call sites pass
   * inline closures, so depending on them directly would tear down and re-observe every
   * element on every parent render — and on this page the parent re-renders on each
   * progress write.
   */
  const revealRef = useRef<RevealCallback | undefined>(onReveal);
  const resetRef = useRef<RevealCallback | undefined>(onReset);
  useEffect(() => {
    revealRef.current = onReveal;
    resetRef.current = onReset;
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    claimAnimFlag();

    /*
     * Hysteresis: reveal once the element is `ratio` visible, but only reset once it is
     * fully out of view. A single threshold would flip the class back and forth while
     * scrolling slowly across the boundary. Nothing is ever unobserved, so the reveal
     * replays every time the element comes back — scrolling up and down keeps the page
     * alive instead of playing once and dying.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            el.classList.remove("is-visible");
            resetRef.current?.(el);
            return;
          }

          if (entry.intersectionRatio < ratio) return;
          el.classList.add("is-visible");
          revealRef.current?.(el);
        });
      },
      { threshold: [0, ratio], rootMargin: margin }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      releaseAnimFlag();
    };
  }, [selector, ratio, margin, resetKey]);
}
