// InfoTooltip — "i" button with a click-to-toggle popover pinned to the viewport (fixed) so it is never clipped by overflow:hidden ancestors
"use client";

import { useEffect, useId, useRef, useState } from "react";

const TOOLTIP_WIDTH = 220;
const EDGE_MARGIN = 12; // min gap from viewport edges

export default function InfoTooltip({ text }: { text: string }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const next = !open;
    if (next && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top = rect.bottom + 8;
      // right-align tooltip to button, then clamp both edges to viewport
      const tooltipRight = Math.min(rect.right, window.innerWidth - EDGE_MARGIN);
      const left = Math.max(EDGE_MARGIN, tooltipRight - TOOLTIP_WIDTH);
      setPos({ top, left });
    }
    setOpen(next);
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // auto-dismiss after 4 s
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(t);
  }, [open]);

  // Escape closes it. Previously the only ways out were clicking elsewhere or waiting out
  // the timer, neither of which a keyboard user can reach.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="What does this mean?"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={handleToggle}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `1.5px solid ${open ? "var(--ink)" : "var(--rule-hard)"}`,
          background: open ? "var(--ink)" : "var(--paper)",
          color: open ? "var(--paper)" : "var(--ink-soft)",
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1,
          cursor: "pointer",
          fontFamily: "inherit",
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        i
      </button>

      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            position: "fixed",
            ...pos,
            zIndex: 9999,
            width: TOOLTIP_WIDTH,
            boxSizing: "border-box",
            padding: "10px 12px",
            background: "var(--ink)",
            color: "var(--paper)",
            fontSize: 12,
            lineHeight: 1.55,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            boxShadow: "4px 4px 0 var(--accent)",
          }}
        >
          {text}
        </div>
      )}
    </>
  );
}
