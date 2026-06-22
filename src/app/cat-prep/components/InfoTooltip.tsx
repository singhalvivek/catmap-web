// InfoTooltip — "i" button with a click-to-toggle popover pinned to the viewport (fixed) so it is never clipped by overflow:hidden ancestors
"use client";

import { useEffect, useRef, useState } from "react";

const TOOLTIP_WIDTH = 220;
const EDGE_MARGIN = 12; // min gap from viewport edges

export default function InfoTooltip({ text }: { text: string }) {
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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="What does this mean?"
        onClick={handleToggle}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1.5px solid #94A3B8",
          background: open ? "#1E3A5F" : "#fff",
          color: open ? "#fff" : "#94A3B8",
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
          style={{
            position: "fixed",
            ...pos,
            zIndex: 9999,
            width: TOOLTIP_WIDTH,
            boxSizing: "border-box",
            padding: "9px 11px",
            borderRadius: 8,
            background: "#1E3A5F",
            color: "#fff",
            fontSize: 11,
            lineHeight: 1.5,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
          }}
        >
          {text}
        </div>
      )}
    </>
  );
}
