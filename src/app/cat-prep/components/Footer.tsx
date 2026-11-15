// Footer — shared site footer: wordmark, the five surfaces, and project links
"use client";

import Link from "next/link";
import Wordmark from "@/app/components/Wordmark";

const GITHUB_URL = "https://github.com/singhalvivek/catmap-web";

const SURFACE_LINKS = [
  { label: "Syllabus & lessons", href: "/cat-prep" },
  { label: "Past exam papers", href: "/cat-prep/pyq" },
  { label: "Practice questions", href: "/cat-prep/practice" },
  { label: "Daily Dose", href: "/cat-prep/daily-dose" },
  { label: "How to prepare", href: "/cat-prep/how-to-prepare" },
];

const PROJECT_LINKS = [
  { label: "All pages", href: "/sitemap-page" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="ed-shell" style={{ paddingTop: 56, paddingBottom: 28 }}>
        <div className="site-footer__top">
          {/* Brand */}
          <div>
            <div className="site-footer__brand">
              <Wordmark onDark strapline={false} />
            </div>
            <p className="site-footer__blurb">
              A free, structured route through the CAT syllabus, with every official past
              paper we have and a question set for each chapter.
            </p>
            <Link href="/cat-prep" className="site-footer__cta">
              Open the syllabus
            </Link>
          </div>

          <nav aria-label="Study">
            <p className="ed-kicker site-footer__kicker">Study</p>
            <ul className="site-footer__list">
              {SURFACE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Project">
            <p className="ed-kicker site-footer__kicker">Project</p>
            <ul className="site-footer__list">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__link"
                >
                  Source code
                </a>
              </li>
              {PROJECT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} StudyNaksha</span>
          <span>Free to use. No advertisements. No sign-up to read.</span>
        </div>
      </div>
    </footer>
  );
}
