import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ENV } from "@/config/env";
import { GoogleAnalytics } from "@/app/components/GoogleAnalytics";
import { JsonLd } from "@/app/components/JsonLd";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "StudyNaksha",
  url: ENV.SITE_URL,
  description:
    "Free structured learning paths, curated resources, and community-driven guidance for CAT and other competitive exam preparation.",
};

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
      <body className={`${jakartaSans.variable} antialiased`}>
        {children}
        <JsonLd data={websiteSchema} />
        <GoogleAnalytics />
        {/* MathJax config must be set before the lib loads. $$ listed before $ so
            cracku's PYQ content (which uses $$..$$ inline, not display math) matches
            before the single-dollar percentyl delimiter does. */}
        <Script id="mathjax-config" strategy="beforeInteractive">
          {`window.MathJax={tex:{inlineMath:[['$$','$$'],['$','$']],processEscapes:true}};`}
        </Script>
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
