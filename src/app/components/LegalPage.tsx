// LegalPage — shared layout for the privacy policy and terms of service pages
import type { ReactNode } from "react";
import Header from "@/app/cat-prep/components/Header";
import Footer from "@/app/cat-prep/components/Footer";
import { GITHUB_ISSUES_URL, WHATSAPP_URL } from "@/constants/contact";

/** Both documents carry the same date; bump it whenever either one changes. */
export const LEGAL_LAST_UPDATED = "17 November 2026";

export function LegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <Header />

      <div className="roadmap-hero">
        <div className="roadmap-hero__inner">
          <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
            Last updated {LEGAL_LAST_UPDATED}
          </p>
          <h1 className="display roadmap-hero__title">{title}</h1>
          <p className="roadmap-hero__subtitle">{summary}</p>
        </div>
      </div>

      <div className="guide">
        {children}

        <LegalSection heading="Contact">
          <p className="guide-prose">
            Questions or requests about this document, or about your data, can be sent on{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              WhatsApp
            </a>{" "}
            or raised as an issue on{" "}
            <a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              GitHub
            </a>
            . We aim to reply within 30 days.
          </p>
        </LegalSection>
      </div>

      <Footer />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="guide-section">
      <h2 className="display guide-heading">{heading}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </section>
  );
}

export const linkStyle = { color: "var(--accent-text)" } as const;
