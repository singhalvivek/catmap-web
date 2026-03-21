"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-calm-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl">📚</span>
          <div>
            <h1 className="text-xl font-bold text-trust-navy leading-tight">learnmax</h1>
            <p className="text-xs text-gray-500">Rx for Education</p>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <span className="text-gray-700 text-sm font-medium">CAT Roadmap</span>
          <Link href="/" className="btn-primary py-2 px-6 text-sm">
            Browse Roadmaps
          </Link>
        </div>
      </div>
    </header>
  );
}
