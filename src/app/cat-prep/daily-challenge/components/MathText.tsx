// MathText — renders scraped plain text that may contain literal "$$...$$"/"$...$" LaTeX,
// typeset by the globally-loaded MathJax (see layout.tsx). Escaped first so stray "<"/">"
// (e.g. inequalities) aren't parsed as HTML before MathJax sees them.
"use client";

import { useEffect, useRef } from "react";

type MathJaxInstance = {
  typesetPromise?: (els: HTMLElement[]) => Promise<void>;
  startup?: { promise?: Promise<void> };
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function MathText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const html = escapeHtml(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mjax = (window as Window & { MathJax?: MathJaxInstance }).MathJax;
    if (!mjax) return;
    const run = () => {
      if (typeof mjax.typesetPromise === "function") mjax.typesetPromise([el]).catch(() => {});
    };
    if (mjax.startup?.promise) {
      mjax.startup.promise.then(run).catch(() => {});
    } else {
      run();
    }
  }, [html]);

  return <span ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
