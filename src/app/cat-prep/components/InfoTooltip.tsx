// InfoTooltip — "i" button with a click-to-toggle popover that auto-positions toward the side with more room
"use client";

import { useEffect, useRef, useState } from "react";

const TOOLTIP_WIDTH = 220;

export default function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  // computed at click time so it's always based on the current viewport layout
  const [popoverPos, setPopoverPos] = useState<React.CSSProperties>({ right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const next = !open;
    if (next && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;
      // prefer expanding toward whichever side has more room
      setPopoverPos(spaceLeft >= TOOLTIP_WIDTH || spaceLeft > spaceRight ? { right: 0 } : { left: 0 });
    }
    setOpen(next);
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // auto-dismiss after 4 s so it doesn't linger over content
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
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
            position: "absolute",
            top: "calc(100% + 8px)",
            ...popoverPos,
            zIndex: 30,
            width: TOOLTIP_WIDTH,
            // safety net: never wider than the viewport minus some breathing room
            maxWidth: "calc(100vw - 32px)",
            padding: "9px 11px",
            borderRadius: 8,
            background: "#1E3A5F",
            color: "#fff",
            fontSize: 11,
            lineHeight: 1.5,
            boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
