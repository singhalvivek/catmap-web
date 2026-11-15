// useDialog — shared dialog behaviour: Escape to close, focus trap, and focus restoration
"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Everything a modal needs and neither of this site's two had: Escape closes it, Tab is
 * trapped inside it, focus moves into it on open, and focus returns to whatever opened it
 * on close. Without the trap, Tab walks straight out of an open dialog and into the page
 * behind it, which a keyboard or screen-reader user cannot tell has happened.
 *
 * Returns the ref to attach to the dialog's own element.
 */
export function useDialog(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  /*
   * onClose is held in a ref so the effect below can run on mount and unmount only. Both
   * call sites pass a freshly created arrow, so depending on it directly tore the effect
   * down on EVERY parent render while the dialog was open — and the teardown restores
   * focus to whatever opened the dialog, so focus jumped out of the panel and back in on
   * each one. Typing in the feedback form was enough to trigger it.
   */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;

    const node = ref.current;
    if (node) {
      const first = node.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? node).focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;

      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Wrap at both ends, so Tab cannot leave the dialog for the page behind it.
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      restoreTo.current?.focus?.();
    };
  }, []);

  return ref;
}
