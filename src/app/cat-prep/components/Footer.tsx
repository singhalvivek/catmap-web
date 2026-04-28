// Footer — site footer with logo, platform links, and community links
"use client";

import Link from "next/link";
import SNLogo from "./SNLogo";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#1E3A5F",
        color: "rgba(255,255,255,0.7)",
        padding: "48px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <SNLogo size={28} />
              <span
                className="font-extrabold text-white"
                style={{ fontSize: 16 }}
              >
                StudyNaksha
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
              Structured roadmaps for competitive exam preparation. 100% free,
              community-driven.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div
              className="font-bold uppercase mb-3"
              style={{
                fontSize: 11,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Platform
            </div>
            {[
              { label: "CAT Roadmap", href: "/cat-prep" },
              { label: "Browse All", href: "/" },
              { label: "Suggest Edits", href: "/cat-prep" },
            ].map(({ label, href }) => (
              <div key={label} className="mb-2">
                <Link
                  href={href}
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Community */}
          <div>
            <div
              className="font-bold uppercase mb-3"
              style={{
                fontSize: 11,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Community
            </div>
            {["Join Waitlist", "Give Feedback", "Open Source"].map((l) => (
              <div key={l} className="mb-2">
                <span
                  className="cursor-default"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © 2025 StudyNaksha · Open learning · Community improved · Free resources
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Made with care for CAT aspirants
          </span>
        </div>
      </div>
    </footer>
  );
}
