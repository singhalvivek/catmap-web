"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="w-full max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
            CAT
          </div>
          <span className="font-semibold text-lg">Prep</span>
        </div>

        {/* Center: Page title */}
        <div className="hidden md:block text-sm text-gray-600">
          Learning Path • Roadmap
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
