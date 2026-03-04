import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "learnmax — India's Lowest Prices on Competitive Exam Courses",
  description: "learnmax is rewriting the script, bringing major savings on competitive exam courses for all students across India.",
  keywords: ["competitive exams", "CAT", "UPSC", "SSC", "CLAT", "course discounts", "education savings"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A5F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-trust-navy`}>
        {children}
      </body>
    </html>
  );
}