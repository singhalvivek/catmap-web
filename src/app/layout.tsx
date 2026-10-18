import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
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

// Display face for editorial headings. Google serves this family at weight 400 only —
// there is no bold cut, which suits large display setting and is why `.display` in
// globals.css pins font-weight to 400.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  // Preloaded: the home page paints display type above the fold, so the font is on the
  // critical path for the site's most-linked route.
  preload: true,
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "StudyNaksha",
  url: ENV.SITE_URL,
  description:
    "A free, structured route through the CAT: the whole syllabus in order, official past papers with solutions, and practice questions for every chapter. No sign-up needed.",
};

export const metadata: Metadata = {
  title: {
    default: "StudyNaksha — Free CAT Preparation",
    template: "%s | StudyNaksha",
  },
  description:
    "A free, structured route through the CAT: the whole syllabus in order, official past papers with solutions, and practice questions for every chapter. No sign-up needed.",
  metadataBase: new URL(ENV.SITE_URL),
  openGraph: {
    type: "website",
    siteName: "StudyNaksha",
    locale: "en_IN",
    title: {
      default: "StudyNaksha — Free CAT Preparation",
      template: "%s | StudyNaksha",
    },
    description:
      "A free, structured route through the CAT: the whole syllabus in order, official past papers with solutions, and practice questions for every chapter. No sign-up needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "StudyNaksha — Free CAT Preparation",
      template: "%s | StudyNaksha",
    },
    description:
      "A free, structured route through the CAT: the whole syllabus in order, official past papers with solutions, and practice questions for every chapter. No sign-up needed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} ${instrumentSerif.variable} antialiased`}>
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
