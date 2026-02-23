"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              🗺️ CatMap
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-8">
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              CAT Preparation
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
