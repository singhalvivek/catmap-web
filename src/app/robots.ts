// robots — Next.js robots.txt route; allows all crawlers and references sitemap
import type { MetadataRoute } from "next";
import { ENV } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cat-prep/pyq/*/mock"],
    },
    sitemap: `${ENV.SITE_URL}/sitemap.xml`,
  };
}
