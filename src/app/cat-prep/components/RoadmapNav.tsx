// RoadmapNav — surface switcher shown on every roadmap page (Learn / Practice / Daily Dose / PYQ / How to Prepare)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { key: "learn", label: "Learn", href: "/cat-prep" },
  { key: "practice", label: "Practice", href: "/cat-prep/practice" },
  { key: "daily-dose", label: "Daily Dose", href: "/cat-prep/daily-dose" },
  { key: "pyq", label: "Past papers", href: "/cat-prep/pyq" },
  { key: "how-to-prepare", label: "How to prepare", href: "/cat-prep/how-to-prepare" },
] as const;

type NavKey = (typeof ITEMS)[number]["key"];

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
    // Spacing belongs to the caller, not the nav — it used to carry marginBottom: 20 of its
    // own, which meant every surface inherited a gap it could not adjust.
    <nav aria-label="CAT surfaces" className="roadmap-nav">
      {ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="roadmap-nav__item"
            /*
             * aria-current is the whole point of this attribute and the repo had zero uses
             * of it anywhere: the active surface was conveyed by colour alone, so a screen
             * reader announced five identical links.
             */
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
