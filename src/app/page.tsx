import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
  title: {
    // absolute bypasses the layout template — home page doesn't need "| StudyNaksha" suffix
    absolute: "StudyNaksha — Free CAT Prep Roadmap & Resources",
  },
  description:
    "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  openGraph: {
    title: "StudyNaksha — Free CAT Prep Roadmap & Resources",
    description:
      "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  },
  twitter: {
    title: "StudyNaksha — Free CAT Prep Roadmap & Resources",
    description:
      "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  },
};

export default function Page() {
  return <LandingPageClient />;
}
