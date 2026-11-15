// page — the StudyNaksha home page: what the site is, and the five things inside it
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
import { JsonLd } from "@/app/components/JsonLd";
import { HOME_COUNTS, PYQ_YEAR_RANGE } from "@/app/lib/homeCounts";
import { HOME_FAQS } from "@/constants/homeFaqs";

/**
 * Carried over from the previous home page so the GA4 funnel stays continuous across the
 * redesign — a new id here would read as the landing page losing all its traffic.
 */
const PAGE_ID = "landing";

// `absolute` on all three: the layout appends "| StudyNaksha" via its title, openGraph and
// twitter templates, and TITLE already carries the brand. Without absolute on the social
// ones they render "… | StudyNaksha | StudyNaksha".
//
// Deliberately different from /cat-prep, which targets the syllabus queries. This page sells
// the whole site, so the title names the three things a visitor actually searches for, and
// the counts come from homeCounts rather than being written down and left to rot.
const TITLE = "Free CAT Preparation: Syllabus, Past Papers and Practice | StudyNaksha";
const DESCRIPTION = `A free, self-paced route through the CAT: the full syllabus in order, ${HOME_COUNTS.pyqPapers} official past papers with solutions (${PYQ_YEAR_RANGE}), and ${HOME_COUNTS.practiceQuestions}+ practice questions. No sign-up needed.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: { absolute: TITLE }, description: DESCRIPTION },
  twitter: { title: { absolute: TITLE }, description: DESCRIPTION },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Page() {
  return (
    <div className="ed-page" style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
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
