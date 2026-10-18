// page — /home-preview: the U001 home page redesign, shown beside the untouched live /
import type { Metadata } from "next";

import HomeHeader from "@/app/components/home/HomeHeader";
import Hero from "@/app/components/home/Hero";
import SurfaceList from "@/app/components/home/SurfaceList";
import Figures from "@/app/components/home/Figures";
import WhyItWorks from "@/app/components/home/WhyItWorks";
import StartHere from "@/app/components/home/StartHere";
import FaqAccordion from "@/app/components/home/FaqAccordion";
import SectionTracker from "@/app/components/home/SectionTracker";
import SectionHeading from "@/app/components/home/SectionHeading";
import Footer from "@/app/cat-prep/components/Footer";

/** Tags every analytics event from this page so preview traffic never enters the / funnel. */
const PAGE_ID = "home_preview";

const TITLE = "Home page preview | StudyNaksha";
// Set explicitly so this page does not inherit the layout's site-wide description, which
// still says "community-driven guidance for CAT and other competitive exam preparation" —
// both claims this redesign drops. De-pluralising it site-wide is Phase B, because it
// changes the served metadata of every page including the live one.
const DESCRIPTION =
  "Preview of the redesigned StudyNaksha home page. A free, self-paced route through the CAT: the syllabus in order, practice questions, and the official past papers.";

// noindex: this route exists only so the redesign can be compared against the live home
// page. It must never compete with / for the queries / targets. It is also absent from
// sitemap.ts, which enumerates routes explicitly rather than globbing.
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: { absolute: TITLE }, description: DESCRIPTION },
  twitter: { title: { absolute: TITLE }, description: DESCRIPTION },
};

export default function HomePreviewPage() {
  return (
    <div className="ed-page" style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <SectionTracker page={PAGE_ID} />
      {/* Width is driven by --read-progress, which SectionTracker updates once per frame. */}
      <div className="read-progress" aria-hidden="true" />
      <HomeHeader />

      <main>
        <div className="ed-shell">
          <Hero />
          <SurfaceList />
        </div>

        {/* Full-bleed band, so it owns its own shell. */}
        <Figures />

        <div className="ed-shell">
          <WhyItWorks />
          <StartHere />

          <section
            data-section="faq"
            style={{
              padding: "clamp(36px, 4.4vw, 56px) 0 clamp(52px, 6vw, 80px)",
              borderTop: "3px solid var(--ink)",
            }}
          >
            <div className="ed-split">
              <SectionHeading eyebrow="Before you ask" title="Questions" rule={false} />
              <FaqAccordion page={PAGE_ID} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
