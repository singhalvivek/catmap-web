// RoadmapNav — hero button row for switching the roadmap view mode (Learn / Practice / PYQ / How to Prepare)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { key: "learn", label: "Learn", href: "/cat-prep" },
  { key: "practice", label: "Practice", href: "/cat-prep/practice" },
  { key: "daily-dose", label: "Daily Dose", href: "/cat-prep/daily-dose" },
  { key: "pyq", label: "PYQ", href: "/cat-prep/pyq" },
  { key: "how-to-prepare", label: "How to Prepare", href: "/cat-prep/how-to-prepare" },
] as const;

type NavKey = (typeof ITEMS)[number]["key"];

const PILL_STYLE = {
  padding: "9px 20px",
  borderRadius: 999,
  fontSize: 14,
  fontFamily: "inherit",
  transition: "all 0.18s",
  cursor: "pointer",
  display: "inline-block",
  textDecoration: "none",
} as const;

function getActiveKey(pathname: string): NavKey {
  if (pathname === "/cat-prep/pyq" || pathname.startsWith("/cat-prep/pyq/")) return "pyq";
  if (pathname === "/cat-prep/practice" || pathname.startsWith("/cat-prep/practice/")) return "practice";
  if (pathname === "/cat-prep/daily-dose" || pathname.startsWith("/cat-prep/daily-dose/")) return "daily-dose";
  if (pathname === "/cat-prep/how-to-prepare") return "how-to-prepare";
  return "learn";
}

export default function RoadmapNav() {
  const pathname = usePathname();
  const active = getActiveKey(pathname);

  return (
    <div className="flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
      {ITEMS.map((item) => {
        const isActive = active === item.key;
        // Teal-accented sections: How to Prepare and Daily Dose
        const isTeal = item.key === "how-to-prepare" || item.key === "daily-dose";
        return (
          <Link
            key={item.key}
            href={item.href}
            className="font-bold"
            style={{
              ...PILL_STYLE,
              border: `1.5px solid ${isTeal ? "#14B8A6" : isActive ? "#1E3A5F" : "rgba(30,58,95,0.18)"}`,
              background: isActive ? (isTeal ? "#14B8A6" : "#1E3A5F") : "#fff",
              color: isActive ? "#fff" : isTeal ? "#0F766E" : "#1E3A5F",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
