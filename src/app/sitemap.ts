// sitemap — Next.js sitemap.xml route; lists all public pages with change frequency
import type { MetadataRoute } from "next";
import { ENV } from "@/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: ENV.SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${ENV.SITE_URL}/cat-prep`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ENV.SITE_URL}/cat-prep/daily-challenge`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
}
