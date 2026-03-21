"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-calm-border bg-calm-bg py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-trust-navy mb-4">
              📚 learnmax
            </h3>
            <p className="text-gray-600">
              Structured roadmaps for competitive exam preparation
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-trust-navy mb-4 uppercase">
              Navigate
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-hope-teal transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#browse"
                  className="text-gray-600 hover:text-hope-teal transition-colors"
                >
                  All Roadmaps
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-trust-navy mb-4 uppercase">
              Feedback
            </h4>
            <p className="text-gray-600 text-sm">
              Have suggestions? We'd love to hear from you!
            </p>
          </div>
        </div>
        <div className="border-t border-calm-border pt-8 text-center text-gray-600 text-sm">
          <p>Open learning · Community improved · Free resources</p>
        </div>
      </div>
    </footer>
  );
}
