"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="w-full max-w-2xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left */}
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} CAT Prep. All rights reserved.
        </div>

        {/* Center */}
        <div className="text-xs text-gray-500">
          Built with ❤️ for CAT aspirants
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm">
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Terms
          </a>
          <a
            href="/contact"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
