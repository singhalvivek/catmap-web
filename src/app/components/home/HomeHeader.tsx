// HomeHeader — slim home page masthead; links into the surfaces rather than a single CTA
import Link from "next/link";
import Wordmark from "@/app/components/Wordmark";

const NAV = [
  { label: "Past papers", href: "/cat-prep/pyq" },
  { label: "Practice", href: "/cat-prep/practice" },
  { label: "Syllabus", href: "/cat-prep" },
];

export default function HomeHeader() {
  return (
    // Double rule under the masthead: the newspaper device, and the thing that makes the
    // top of the page read as deliberate rather than as an empty bar.
    <header className="site-header">
      <div
        className="ed-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          height: 70,
        }}
      >
        <Wordmark />

        <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="home-nav-link"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
