import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ENV } from "@/config/env";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "StudyNaksha — Ace your Exams with Interactive Roadmaps",
    template: "%s | StudyNaksha",
  },
  description:
    "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  metadataBase: new URL(ENV.SITE_URL),
  openGraph: {
    type: "website",
    siteName: "StudyNaksha",
    locale: "en_IN",
    title: {
      default: "StudyNaksha — Ace your Exams with Interactive Roadmaps",
      template: "%s | StudyNaksha",
    },
    description:
      "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "StudyNaksha — Ace your Exams with Interactive Roadmaps",
      template: "%s | StudyNaksha",
    },
    description:
      "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
