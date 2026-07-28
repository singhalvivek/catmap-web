import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

const TITLE = "Free CAT Preparation Roadmap | StudyNaksha";
const DESCRIPTION =
  "A free, structured, distraction-free CAT prep roadmap built from the best open resources. Quant, DILR & VARC — no coaching fees.";

// `absolute` on all three: the layout appends "| StudyNaksha" via its title, openGraph
// and twitter templates, and TITLE already carries the brand. Without absolute on the
// social ones they render "… | StudyNaksha | StudyNaksha".
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: { absolute: TITLE },
    description: DESCRIPTION,
  },
  twitter: {
    title: { absolute: TITLE },
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <LandingPageClient />;
}
