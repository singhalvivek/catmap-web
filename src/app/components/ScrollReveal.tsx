// ScrollReveal — mounts the shared reveal observer on a server-rendered page
"use client";

import { useScrollReveal } from "@/app/lib/useScrollReveal";

const REVEAL_SELECTOR =
  ".reveal, .reveal-rule, .reveal-bar, .reveal-left, .reveal-pop, .reveal-mask";

/**
 * Renders nothing. The reveal classes are inert without the [data-anim="on"] flag this
 * sets, so a static page can carry them safely and only animates once this has mounted.
 * The home page uses SectionTracker instead, which does this plus its own analytics.
 */
export default function ScrollReveal() {
  useScrollReveal({ selector: REVEAL_SELECTOR });
  return null;
}
