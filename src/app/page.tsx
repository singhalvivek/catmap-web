"use client";

import { useState } from "react";
import { COURSES, FAQS } from "./data"; // ✅ Updated import path

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const courses = COURSES;
  const faqs = FAQS;

  return (
    <main className="flex-1">
      {/* Top Banner */}
      <div className="bg-hope-teal text-white text-center py-2 text-sm font-medium">
        🇮🇳 India's First Most-Favored-Learning Price Initiative for Students
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-calm-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-xl font-bold text-trust-navy leading-tight">learnmax</h1>
              <p className="text-xs text-gray-500">Rx for Education</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#browse" className="text-gray-700 hover:text-hope-teal font-medium transition-colors">Browse Courses</a>
            <a href="#faq" className="text-gray-700 hover:text-hope-teal font-medium transition-colors">FAQ</a>
            <button className="btn-primary py-2 px-6 text-sm">Join Waitlist</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
            <span>🌍</span>
            <span>Open-Source-Structured-Learning Initiative</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
            Find India's lowest prices on<br className="hidden md:block" />
            competitive exam courses
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            learnmax is rewriting the script, bringing major savings on competitive exam courses for all students.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search courses (CAT, UPSC, SSC, CLAT...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-hope-teal/50"
              />
              <button className="btn-primary whitespace-nowrap">
                Find Courses
              </button>
            </div>
          </div>

          <a href="#browse" className="btn-secondary inline-flex items-center gap-2">
            Browse Courses <span>→</span>
          </a>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-calm-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-6">
            We are being overcharged for courses.
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            The same content, available on the Internet, by the same teachers, are costing students up to <span className="font-bold text-trust-navy">₹50k-100k</span> in the country. <span className="font-semibold">This is unacceptable.</span>
          </p>

          {/* Cost Comparison Card */}
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 max-w-2xl mx-auto card-hover">
            <h4 className="font-bold text-lg mb-4 text-trust-navy">Cost comparison: CAT Course</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50/50 rounded-lg border border-calm-border">
                <p className="text-sm text-gray-600 mb-1">CatKing · Current price</p>
                <p className="text-2xl font-bold text-gray-800">₹24,999</p>
              </div>
              <div className="text-center p-4 bg-blue-50/50 rounded-lg border border-calm-border">
                <p className="text-sm text-gray-600 mb-1">PW · Online reference</p>
                <p className="text-2xl font-bold text-gray-800">₹12,999</p>
              </div>
            </div>
            <div className="bg-trust-navy text-white rounded-xl p-4 text-center">
              <p className="font-semibold">🇮🇳 learnmax · New Most-Favored-Learning price</p>
              <p className="text-3xl font-bold text-hope-teal mt-1">₹599 <span className="text-lg font-normal text-blue-200">95% less</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-hope-teal/10 text-hope-teal font-bold px-4 py-1 rounded-full text-sm mb-6">
            💡 Open-Source-Structured-Learning
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-6">
            The days of Big Coaching price-gouging are over.
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            Leveraging the full weight and power of Open source content, learnmax will ensure every student gets the lowest prices on competitive exam courses.
          </p>
          
          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-trust-navy/5 to-blue-50 rounded-xl border border-calm-border">
              <p className="text-3xl font-bold text-trust-navy mb-1">95%</p>
              <p className="text-sm text-gray-600">Average Savings</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-trust-navy/5 to-blue-50 rounded-xl border border-calm-border">
              <p className="text-3xl font-bold text-trust-navy mb-1">100%</p>
              <p className="text-sm text-gray-600">Same Quality Content</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-hope-teal/5 to-teal-50 rounded-xl border border-calm-border">
              <p className="text-3xl font-bold text-hope-teal mb-1">∞</p>
              <p className="text-sm text-gray-600">Open Access Future</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto px-4"></div>

      {/* Course Pricing Table */}
      <section id="browse" className="py-16 bg-calm-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-4">
              The proof is in the prices
            </h3>
            <p className="text-lg text-gray-600">
              Compare prices on commonly prescribed courses like these, and see how much you can save with Most-Favored-Learning prices.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="grid grid-cols-3 bg-trust-navy text-white font-semibold py-4 px-6 text-sm">
              <p>Courses</p>
              <p className="text-center">Lowest learnmax Price</p>
              <p className="text-right">Original Price</p>
            </div>
            
            {courses.map((course, index) => (
              <div 
                key={course.name}
                className={`grid grid-cols-3 items-center py-5 px-6 border-b border-calm-border hover:bg-blue-50/30 transition-colors ${
                  index === courses.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{course.icon}</span>
                  <span className="font-medium text-gray-900">{course.name}</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-trust-navy text-lg">{course.learnmaxPrice}</p>
                  <span className="savings-badge mt-1">
                    Save {course.savings}
                  </span>
                </div>
                <p className="text-right text-gray-500 line-through">{course.originalPrice}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="btn-primary inline-flex items-center gap-2">
              Browse all courses <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-trust-navy text-center mb-12">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="border border-calm-border rounded-xl overflow-hidden card-hover"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left bg-calm-bg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-trust-navy pr-4">{faq.question}</span>
                  <span className={`text-hope-teal text-xl font-bold transition-transform duration-200 ${
                    openFaq === faq.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                <div 
                  className={`faq-answer ${
                    openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-5 pt-0 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-trust-navy to-hope-teal text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to save on your exam preparation?
          </h3>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of students already benefiting from Most-Favored-Learning prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-trust-navy font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Join Waitlist — It's Free
            </button>
            <a href="#browse" className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Browse Courses Now
            </a>
          </div>
          <p className="text-sm text-blue-200 mt-6 opacity-80">
            No credit card required · Cancel anytime · 100% student-focused
          </p>
        </div>
      </section>
    </main>
  );
}