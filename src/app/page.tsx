import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

const TITLE = "Free CAT Preparation Roadmap | StudyNaksha";
const DESCRIPTION =
  "A free, structured, distraction-free CAT prep roadmap built from the best open resources. Quant, DILR & VARC — no coaching fees.";

export const metadata: Metadata = {
  title: {
    // absolute bypasses the layout template — full brand + keyword title for the home page
    absolute: TITLE,
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <LandingPageClient />;
}
