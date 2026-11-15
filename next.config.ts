// next.config — Next.js config: compiler, image hosts, redirects and the Firebase auth proxy
import type { NextConfig } from "next";
import { ENV } from "./src/config/env";

const FIREBASE_HOST = `https://${ENV.FIREBASE_PROJECT_ID}.firebaseapp.com`;

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      // Daily Essay & Daily Challenge moved under the Daily Dose section
      {
        source: "/cat-prep/daily-essay",
        destination: "/cat-prep/daily-dose/essay",
        permanent: true,
      },
      {
        source: "/cat-prep/daily-essay/:path*",
        destination: "/cat-prep/daily-dose/essay/:path*",
        permanent: true,
      },
      {
        source: "/cat-prep/daily-challenge",
        destination: "/cat-prep/daily-dose/challenge",
        permanent: true,
      },
      {
        source: "/cat-prep/daily-challenge/:path*",
        destination: "/cat-prep/daily-dose/challenge/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Serves Firebase's sign-in helper from our own domain, so with authDomain
      // set to studynaksha.com Google's account chooser names us, not firebaseapp.com
      {
        source: "/__/auth/:path*",
        destination: `${FIREBASE_HOST}/__/auth/:path*`,
      },
      {
        source: "/__/firebase/:path*",
        destination: `${FIREBASE_HOST}/__/firebase/:path*`,
      },
    ];
  },
};

export default nextConfig;
