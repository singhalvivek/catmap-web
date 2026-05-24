// GoogleAnalytics — loads GA4 script and fires page_view on every route change
"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ENV } from "@/config/env";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function sendPageView(url: string, measurementId: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", measurementId, { page_path: url });
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const id = ENV.FIREBASE_MEASUREMENT_ID;

  useEffect(() => {
    sendPageView(pathname, id);
  }, [pathname, id]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
