"use client";

import { useState } from "react";
import { COURSES, FAQS } from "./data";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const courses = COURSES;
  const faqs = FAQS;

  return (
    <main className="flex-1">
      {/* Top Banner */}
      <div className="bg-hope-teal text-white text-center py-2 text-sm font-medium">
        Open-Source Structured Learning for Exams
      </div>

      {/* Navigation (Simple for now) */}
      <nav className="bg-white border-b border-calm-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-xl font-bold text-trust-navy leading-tight">StudyNaksha</h1>
              <p className="text-xs text-gray-500">Your roadmap to CAT</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#faq" className="text-gray-700 hover:text-hope-teal font-medium transition-colors">FAQ</a>
            <button className="btn-primary py-2 px-6 text-sm">Browse Roadmaps</button>
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
            Follow structured roadmaps<br className="hidden md:block" />
            built from the best resources<br className="hidden md:block" />
            on the internet
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Preparing for exams online can be overwhelming. Resources are scattered across YouTube, blogs, notes, and PDFs.
            Our platform organizes the best free resources into clear learning roadmaps so you always know what to study next.
          </p>
          
          {/* Search Bar */}
          {/* <div className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search exams (CAT, UPSC, SSC, CLAT...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-hope-teal/50"
              />
              <button className="btn-primary whitespace-nowrap">
                Explore Roadmaps
              </button>
            </div>
          </div> */}

          <a href="#browse" className="btn-secondary inline-flex items-center gap-2">
            Explore Roadmaps <span>→</span>
          </a>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-calm-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-6">
            Preparing online shouldn't feel chaotic.
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            Students preparing for competitive exams often rely on free resources online, but those resources are scattered across multiple platforms. 
            YouTube playlists, random notes, blogs, and PDFs make it difficult to follow a clear learning path or track progress.
            {/* The same content, available on the Internet, by the same teachers, are costing students up to <span className="font-bold text-trust-navy">₹50k-100k</span> in the country. <span className="font-semibold">This is unacceptable.</span> */}
          </p>

        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-hope-teal/10 text-hope-teal font-bold px-4 py-1 rounded-full text-sm mb-6">
            💡 Community curated learning paths
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-6">
            {/* The days of Big Coaching price-gouging are over. */}
            The internet already has amazing learning resources.
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            This platform organizes those resources into structured roadmaps so students can prepare efficiently without searching everywhere.
          </p>
          
          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-trust-navy/5 to-blue-50 rounded-xl border border-calm-border">
              {/* <p className="text-3xl font-bold text-trust-navy mb-1">95%</p>
              <p className="text-sm text-gray-600">Average Savings</p> */}
              <p className="text-2xl font-bold text-hope-teal mb-1">Structured Learning Paths</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-trust-navy/5 to-blue-50 rounded-xl border border-calm-border">
              {/* <p className="text-3xl font-bold text-trust-navy mb-1">100%</p>
              <p className="text-sm text-gray-600">Same Quality Content</p> */}
              <p className="text-2xl font-bold text-hope-teal mb-1">Curated Best Resources</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-hope-teal/5 to-teal-50 rounded-xl border border-calm-border">
              {/* <p className="text-3xl font-bold text-hope-teal mb-1">∞</p>
              <p className="text-sm text-gray-600">Open Access Future</p> */}
              <p className="text-2xl font-bold text-hope-teal mb-1">Community Driven Improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Pricing Table */}
      <section id="browse" className="py-16 bg-calm-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-trust-navy mb-4">
              Everything organized in one place
            </h3>
            <p className="text-lg text-gray-600">
              Each roadmap organizes videos, notes, and useful links, so you can focus on learning instead of searching.
              {/* Compare prices on commonly prescribed courses like these, and see how much you can save with Most-Favored-Learning prices. */}
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="grid grid-cols-2 bg-trust-navy text-white font-semibold py-4 px-6 text-sm">
              <p>Roadmaps</p>
              <p className="text-right">Access</p>
            </div>
            
            {courses.map((course, index) => (
              <div 
                key={course.name}
                className={`grid grid-cols-2 items-center py-5 px-6 border-b border-calm-border hover:bg-blue-50/30 transition-colors ${
                  index === courses.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{course.icon}</span>
                  <span className="font-semibold text-lg text-gray-900">{course.name}</span>
                </div>
                <div className="text-right">
                  <a href="/cat-prep" className="btn-primary inline-flex items-center gap-2">
                    Roadmap <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-5 mt-10">
            <p className="text-lg text-gray-600">
              We are launching with CAT roadmap at start and others roadmaps are in pipeline. to get your roadmap first, join our waitlist.
            </p>
          </div>

          <div className="text-center">
            <button className="btn-primary inline-flex items-center gap-2">
              Join our Waitlist
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
            Start learning with a clear roadmap
          </h3>
          <p className="text-lg text-blue-100 mb-8">
            Explore structured learning paths built using the best free resources available online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-trust-navy font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Join our community — It's Free
            </button>
            <a href="#browse" className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Explore Roadmaps
            </a>
          </div>
          <p className="text-sm text-blue-200 mt-6 opacity-80">
            Open learning · Community improved · Free resources
          </p>
        </div>
      </section>
    </main>
  );
}