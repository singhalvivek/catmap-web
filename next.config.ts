import type { NextConfig } from "next";

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
};

export default nextConfig;
