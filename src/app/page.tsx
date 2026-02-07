import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                🗺️ CatMap
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#faq"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
              >
                FAQ
              </a>
              <Link
                href="/cat-prep"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Explore
              </Link>
            </div>
            <div className="sm:hidden">
              <Link
                href="/cat-prep"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Master CAT with Interactive Roadmaps
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
            CatMap is an interactive learning platform designed to help you navigate your CAT preparation journey with structured roadmaps, detailed resources, and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cat-prep"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-lg"
            >
              Start Learning
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors font-semibold text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why CatMap?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to prepare for CAT exam in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Interactive Roadmaps
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visual learning paths that guide you through every topic and concept needed for CAT preparation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Curated Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Handpicked learning materials, articles, and practice problems organized by topic and difficulty.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Comprehensive FAQ
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Answers to common questions about preparation strategies, time management, and exam tips.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Structured Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow a logical progression from fundamentals to advanced concepts with clear milestones.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Fully Responsive
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your learning roadmap anywhere, anytime on any device with a seamless experience.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Feedback Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your feedback and help us improve the platform to better serve your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your CAT Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore our interactive roadmaps and resources designed to help you ace the CAT exam.
          </p>
          <Link
            href="/cat-prep/tree"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg transition-colors font-semibold text-lg"
          >
            Explore CatMap Now
          </Link>
        </div>
      </section>

      {/* Footer */}
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
                    href="/cat-prep/tree"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    CAT Preparation
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
    </div>
  );
}
