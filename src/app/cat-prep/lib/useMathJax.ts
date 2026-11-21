// useMathJax — re-typesets a container's "$$…$$" LaTeX after hydration and whenever `deps` change
"use client";

import { useEffect } from "react";

type MathJaxInstance = {
  typesetPromise?: (els: HTMLElement[]) => Promise<void>;
  startup?: { promise?: Promise<void> };
};

// Cracku's scraped text is plain (not HTML) but may contain literal "$$...$$" LaTeX.
// MathJax is loaded globally in layout.tsx and typesets the document on startup, which
// covers the server-rendered pass; this re-typesets the container after hydration so
// content that changes (a revealed explanation, a client-rendered set) is picked up too.
export function useMathJax(containerRef: React.RefObject<HTMLElement | null>, deps: unknown) {
  useEffect(() => {
    const el = containerRef.current;
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
  }, [containerRef, deps]);
}
