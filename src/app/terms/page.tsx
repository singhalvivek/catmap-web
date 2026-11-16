// page — /terms: the terms that govern use of StudyNaksha
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, linkStyle } from "@/app/components/LegalPage";
import { ENV } from "@/config/env";
import { PRIVACY_PATH, TERMS_PATH } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using StudyNaksha, the free CAT preparation site: accounts, acceptable use, your content, and our responsibilities.",
  alternates: { canonical: `${ENV.SITE_URL}${TERMS_PATH}` },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="These terms govern your use of StudyNaksha. By using the site you agree to them. If you do not agree, please do not use the site."
    >
      <LegalSection heading="The service">
        <p className="guide-prose">
          StudyNaksha provides free study material for the Common Admission Test (CAT): a
          syllabus roadmap, lessons, past papers, practice questions and daily exercises. It is
          provided for personal, non-commercial study. StudyNaksha is not affiliated with the
          Indian Institutes of Management or any body that conducts the CAT.
        </p>
      </LegalSection>

      <LegalSection heading="Your account">
        <p className="guide-prose">
          Some features need you to sign in with a Google account. You are responsible for
          activity under your account and for keeping your Google account secure. Use your own
          account only, and do not share it or sign in as someone else.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p className="guide-prose">You agree not to:</p>
        <ul className="guide-list">
          <li>copy, republish or sell the site&rsquo;s questions, explanations or lessons in bulk;</li>
          <li>scrape the site or send automated traffic that degrades it for others;</li>
          <li>try to break, probe or bypass the site&rsquo;s security, or access data that is not yours;</li>
          <li>post content that is unlawful, abusive, hateful, sexually explicit, infringes someone else&rsquo;s rights, or is spam;</li>
          <li>impersonate another person or misrepresent who you are.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Your content">
        <p className="guide-prose">
          You keep ownership of the essay responses and other content you post. By posting, you
          give StudyNaksha a free, worldwide, non-exclusive licence to store, display and
          share that content on the site, with your name and profile photo, for as long as it
          remains posted. We may remove any content that breaks these terms, without notice.
        </p>
      </LegalSection>

      <LegalSection heading="Our content and third-party material">
        <p className="guide-prose">
          The site&rsquo;s design, lessons, explanations and original questions belong to
          StudyNaksha. Past CAT papers and linked articles remain the property of their
          respective owners and are referenced for educational purposes. Links to other
          websites are provided for convenience; we do not control and are not responsible
          for their content.
        </p>
      </LegalSection>

      <LegalSection heading="No guarantees">
        <p className="guide-prose">
          The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We work to
          keep questions, answers and explanations accurate, but they may contain errors, and
          we do not promise any particular score, percentile or admission outcome. The site may
          change, pause or become unavailable at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p className="guide-prose">
          To the fullest extent the law allows, StudyNaksha is not liable for any indirect,
          incidental or consequential loss arising from your use of the site, including lost
          data, lost opportunities or exam results.
        </p>
      </LegalSection>

      <LegalSection heading="Ending your use">
        <p className="guide-prose">
          You can stop using StudyNaksha at any time and ask us to delete your account. We may
          suspend or end access for anyone who breaks these terms or misuses the service.
        </p>
      </LegalSection>

      <LegalSection heading="Privacy">
        <p className="guide-prose">
          How we handle your data is described in our{" "}
          <Link href={PRIVACY_PATH} style={linkStyle}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Changes and governing law">
        <p className="guide-prose">
          We may update these terms. When we do, we will change the date at the top of this
          page; continuing to use the site after that means you accept the updated terms. These
          terms are governed by the laws of India, and disputes are subject to the jurisdiction
          of the courts of India.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
