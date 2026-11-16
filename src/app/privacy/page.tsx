// page — /privacy: what StudyNaksha collects, why, and the choices users have
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, linkStyle } from "@/app/components/LegalPage";
import { ENV } from "@/config/env";
import { PRIVACY_PATH, TERMS_PATH } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How StudyNaksha handles your data: what Google Sign-In shares, what we store about your practice, and how to have it deleted.",
  alternates: { canonical: `${ENV.SITE_URL}${PRIVACY_PATH}` },
};

const GOOGLE_PERMISSIONS_URL = "https://myaccount.google.com/permissions";
const GOOGLE_API_POLICY_URL = "https://developers.google.com/terms/api-services-user-data-policy";
const GA_OPT_OUT_URL = "https://tools.google.com/dlpage/gaoptout";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="StudyNaksha is a free CAT preparation site. This policy explains what we collect when you use it, why, and what you can do about it. The short version: we collect little, show no ads, and sell nothing."
    >
      <LegalSection heading="Who we are">
        <p className="guide-prose">
          StudyNaksha (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the website at studynaksha.com.
          This policy covers that website and the data it handles. By using the site you agree to
          this policy and to our{" "}
          <Link href={TERMS_PATH} style={linkStyle}>
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p className="guide-prose">
          <strong>When you browse without signing in.</strong> You can read the syllabus,
          lessons and past papers without an account. We use Google Analytics to count page
          views and understand how the site is used. It records the pages you visit, your
          browser and device type, an approximate location derived from your IP address, and
          actions such as starting a practice set. It sets cookies to do this.
        </p>
        <p className="guide-prose">
          <strong>Data kept in your browser.</strong> Practice progress, unfinished test drafts
          and your theme preference are saved in your browser&rsquo;s local storage so the site
          remembers them between visits. This stays on your device unless you sign in.
        </p>
        <p className="guide-prose">
          <strong>When you sign in with Google.</strong> Google shares your name, email address,
          profile photo and a unique account ID with us. We never see your Google password, and
          we do not ask for access to your Gmail, Drive, contacts or any other Google data.
        </p>
        <p className="guide-prose">
          <strong>Your study activity.</strong> Once you are signed in, we store your progress
          through the syllabus, your practice and past-paper attempts (answers, scores and
          timings), and your Daily Challenge results against your account ID, so they follow
          you across devices.
        </p>
        <p className="guide-prose">
          <strong>What you post.</strong> If you submit a response to a Daily Essay, we store
          it and show it to other visitors with your name and profile photo. Votes on responses
          are stored against your account ID.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <ul className="guide-list">
          <li>To run the features you use: syncing progress, showing results, and attributing your posts.</li>
          <li>To see which pages and features are used, so we can fix and improve them.</li>
          <li>To keep the site secure and prevent abuse.</li>
        </ul>
        <p className="guide-prose">
          We do not show advertisements, sell or rent your data, or send marketing email.
        </p>
      </LegalSection>

      <LegalSection heading="Google user data">
        <p className="guide-prose">
          We use the name, email address, profile photo and account ID from Google Sign-In only
          to create your StudyNaksha account, show who is signed in, attribute your essay
          responses, and keep your progress. We do not transfer this data to others except as
          described in this policy, and we do not use it for advertising.
          StudyNaksha&rsquo;s use of information received from Google APIs adheres to the{" "}
          <a href={GOOGLE_API_POLICY_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </LegalSection>

      <LegalSection heading="Who processes it">
        <p className="guide-prose">
          Your data is processed by the services that run the site, under their own security
          and privacy terms: Google Firebase (sign-in, the progress database and Analytics),
          a hosted MongoDB database (practice attempts, results and essay responses), and our
          web hosting provider. These services may store data outside India.
        </p>
        <p className="guide-prose">
          Beyond them, we share data only when the law requires it, or to protect the rights
          and safety of our users or the service.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p className="guide-prose">
          We keep your account data for as long as your account is active. If you ask us to
          delete it, we remove your account data and posts within 30 days, except where we
          are required by law to keep something longer. Analytics data is kept under Google
          Analytics&rsquo; standard retention settings.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices and rights">
        <ul className="guide-list">
          <li>Use the site without signing in. Most of it works without an account.</li>
          <li>Clear your browser&rsquo;s site data to remove anything stored on your device.</li>
          <li>
            Block analytics cookies in your browser, or install Google&rsquo;s{" "}
            <a href={GA_OPT_OUT_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Analytics opt-out add-on
            </a>
            .
          </li>
          <li>
            Remove StudyNaksha&rsquo;s access to your Google account from your{" "}
            <a href={GOOGLE_PERMISSIONS_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Google account permissions
            </a>
            .
          </li>
          <li>Ask us for a copy of your data, to correct it, or to delete your account and everything stored with it.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Security">
        <p className="guide-prose">
          Data is sent over HTTPS, and access to our databases is restricted. No system is
          perfectly secure, so we cannot guarantee absolute security, but we will tell affected
          users and the relevant authorities of any breach as the law requires.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p className="guide-prose">
          StudyNaksha is meant for CAT candidates, who are graduates or final-year students.
          We do not knowingly collect personal data from anyone under 18. If you believe a
          child has signed in, contact us and we will delete the account.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p className="guide-prose">
          If we change this policy we will update the date at the top of this page. If a change
          materially affects how we use your data, we will say so on the site before it takes
          effect.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
