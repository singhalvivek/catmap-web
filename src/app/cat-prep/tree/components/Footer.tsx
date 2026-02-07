"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🗺️ CatMap
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Interactive roadmaps for CAT preparation
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase">
              Navigate
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase">
              Feedback
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Have suggestions? We'd love to hear from you!
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>&copy; 2025 CatMap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
