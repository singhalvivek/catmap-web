"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const faqs = [
    {
      id: "faq1",
      question: "What is CatMap?",
      answer: "CatMap is an interactive learning platform that provides structured roadmaps and curated resources to help you prepare for the CAT exam. It visualizes your learning journey and guides you through every topic systematically."
    },
    {
      id: "faq2",
      question: "Is CatMap free to use?",
      answer: "Yes! CatMap is completely free to use. We believe quality education resources should be accessible to everyone preparing for competitive exams."
    },
    {
      id: "faq3",
      question: "How are the roadmaps structured?",
      answer: "Our roadmaps are organized by subject areas (Quantitative Aptitude, Verbal Ability, Data Interpretation & Logical Reasoning) and further broken down into topics and subtopics. Each node in the roadmap contains curated resources, practice problems, and tips."
    },
    {
      id: "faq4",
      question: "Can I track my progress?",
      answer: "Currently, CatMap provides structured learning paths. Progress tracking features are in development and will be available soon."
    },
    {
      id: "faq5",
      question: "How often is the content updated?",
      answer: "We regularly update our content based on the latest CAT exam patterns and user feedback. You can also contribute to keep the content fresh and relevant."
    }
  ];

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

      {/* Open Source Learning Section */}
      <section id="features" className="py-20 sm:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-4 py-2 rounded-full text-sm mb-6">
            💡 Open-Source-Structured-Learning
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The days of Big Coaching price-gouging are over.
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Leveraging the full weight and power of Open source content, CatMap will ensure every student gets the best quality CAT preparation resources completely free.
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
              <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Free Forever</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
              <p className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Quality Content</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
              <p className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">∞</p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Open Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The proof is in the prices
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compare prices on commonly prescribed CAT courses like these, and see how much you can save with CatMap's free resources.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="hidden sm:grid grid-cols-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white font-semibold py-4 px-6 text-sm">
              <p>Courses</p>
              <p className="text-center">CatMap Price</p>
              <p className="text-right">Market Price</p>
            </div>
            
            {/* CAT Complete Prep */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-6 px-6 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-3xl sm:text-4xl">📚</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">CAT Complete Prep</span>
              </div>
              <div className="text-center mb-4 sm:mb-0">
                <p className="font-bold text-green-600 dark:text-green-400 text-2xl sm:text-3xl">FREE</p>
                <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                  Save 100%
                </span>
              </div>
              <p className="text-center sm:text-right text-gray-500 dark:text-gray-400 line-through text-xl">₹24,999</p>
            </div>

            {/* VARC Course */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-6 px-6 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-3xl sm:text-4xl">📖</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">VARC Course</span>
              </div>
              <div className="text-center mb-4 sm:mb-0">
                <p className="font-bold text-green-600 dark:text-green-400 text-2xl sm:text-3xl">FREE</p>
                <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                  Save 100%
                </span>
              </div>
              <p className="text-center sm:text-right text-gray-500 dark:text-gray-400 line-through text-xl">₹12,999</p>
            </div>

            {/* Quant Course */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-6 px-6 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-3xl sm:text-4xl">🔢</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">Quant Course</span>
              </div>
              <div className="text-center mb-4 sm:mb-0">
                <p className="font-bold text-green-600 dark:text-green-400 text-2xl sm:text-3xl">FREE</p>
                <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                  Save 100%
                </span>
              </div>
              <p className="text-center sm:text-right text-gray-500 dark:text-gray-400 line-through text-xl">₹15,999</p>
            </div>

            {/* DILR Course */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-6 px-6 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-3xl sm:text-4xl">🧩</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">DILR Course</span>
              </div>
              <div className="text-center mb-4 sm:mb-0">
                <p className="font-bold text-green-600 dark:text-green-400 text-2xl sm:text-3xl">FREE</p>
                <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                  Save 100%
                </span>
              </div>
              <p className="text-center sm:text-right text-gray-500 dark:text-gray-400 line-through text-xl">₹13,999</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/cat-prep"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Explore All Resources <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                ❓ GOT QUESTIONS?
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about CatMap
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id}
                className="border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-semibold text-lg text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <span className={`text-blue-600 dark:text-blue-400 text-xl font-bold transition-transform duration-300 flex-shrink-0 ${
                    openFaq === faq.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="p-6 pt-0 bg-white dark:bg-gray-950">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="p-8 lg:p-12">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                  <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    🌟 CONTRIBUTE
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Help Build the Best CAT Resource
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Have great study materials, tips, or resources? Share them with the community! Your contributions help thousands of students prepare better for CAT.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Share Study Materials</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Add notes, formulas, shortcuts, and practice problems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 dark:text-purple-400">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Suggest Resources</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Recommend helpful videos, articles, and books</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Improve Content</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Help us fix errors and enhance existing materials</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://github.com/yourusername/catmap-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold"
                  >
                    <span>📝</span>
                    Contribute on GitHub
                  </a>
                  <a
                    href="mailto:contribute@catmap.com"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                  >
                    <span>✉️</span>
                    Email Us
                  </a>
                </div>
              </div>

              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 lg:p-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative text-center text-white">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold mb-4">Join Our Contributors</h3>
                  <p className="text-blue-100 mb-6">Be part of something bigger</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-sm text-blue-100">Resources</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-3xl font-bold">50+</div>
                      <div className="text-sm text-blue-100">Contributors</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-3xl font-bold">10K+</div>
                      <div className="text-sm text-blue-100">Students</div>
                    </div>
                  </div>
                </div>
              </div>
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
