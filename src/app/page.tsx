// page — StudyNaksha landing page
"use client";

import { useState } from "react";
import Link from "next/link";
import SNLogo from "./cat-prep/components/SNLogo";
import { FAQS } from "./data";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ fontFamily: "var(--font-jakarta), sans-serif", minHeight: "100vh", background: "#FFFDF8" }}>

      {/* Navigation */}
      <header
        className="sticky top-0 z-50 border-b border-calm-border"
        style={{ background: "#FFFDF8", boxShadow: "0 1px 12px rgba(30,58,95,0.06)", height: 64 }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64 }}
        >
          <div className="flex items-center gap-2.5">
            <SNLogo size={34} />
            <div>
              <div className="font-extrabold text-trust-navy" style={{ fontSize: 17, letterSpacing: "-0.4px", lineHeight: 1.1 }}>
                StudyNaksha
              </div>
              <div className="text-slate-400" style={{ fontSize: 10, letterSpacing: "0.4px" }}>
                CAT Roadmap
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#faq"
              className="text-slate-500 font-medium transition-colors hover:text-trust-navy"
              style={{ fontSize: 14 }}
            >
              FAQ
            </a>
            <Link
              href="/cat-prep"
              className="font-bold text-white"
              style={{
                background: "#14B8A6",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 14,
                boxShadow: "0 2px 8px rgba(20,184,166,0.35)",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(20,184,166,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(20,184,166,0.35)";
              }}
            >
              Browse Roadmaps →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="animate-fade-in-up"
        style={{
          background: "linear-gradient(160deg, #FFFDF8 0%, #F0FDFA 50%, #EEF2FF 100%)",
          padding: "72px 24px 80px",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-7"
            style={{
              background: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.2)",
              borderRadius: 100,
              padding: "6px 14px",
              color: "#0F766E",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#14B8A6", display: "inline-block" }}
            />
            Open-Source · Community-Curated · Free
          </div>

          <h1
            className="text-trust-navy font-extrabold mb-5"
            style={{ fontSize: "clamp(32px,6vw,60px)", lineHeight: 1.1, letterSpacing: "-1.5px" }}
          >
            Your structured roadmap<br />
            <span style={{ color: "#14B8A6" }}>to crack CAT</span>
          </h1>

          <p
            className="text-slate-600 mx-auto mb-9"
            style={{ fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.7, maxWidth: 600 }}
          >
            Stop searching across YouTube, PDFs, and blogs. We organize the
            internet&apos;s best free resources into clear learning paths — so you
            always know what to study next.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/cat-prep"
              className="font-bold text-white"
              style={{
                background: "#14B8A6",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                boxShadow: "0 4px 16px rgba(20,184,166,0.4)",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(20,184,166,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,184,166,0.4)";
              }}
            >
              Explore CAT Roadmap →
            </Link>
            <a
              href="#how"
              className="font-semibold text-trust-navy"
              style={{
                background: "rgba(30,58,95,0.06)",
                border: "1.5px solid rgba(30,58,95,0.15)",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              How it works
            </a>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 justify-center flex-wrap mt-12">
            {[
              { n: "60+", label: "Topics Covered" },
              { n: "3", label: "CAT Sections" },
              { n: "100%", label: "Free Resources" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-extrabold"
                  style={{ fontSize: 26, color: "#14B8A6", letterSpacing: "-0.5px" }}
                >
                  {s.n}
                </div>
                <div
                  className="font-medium mt-0.5"
                  style={{ fontSize: 12, color: "#94A3B8" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "72px 24px", background: "#FFFDF8" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="text-center mb-12">
            <div
              className="font-bold uppercase mb-2.5"
              style={{ fontSize: 11, color: "#14B8A6", letterSpacing: "2px" }}
            >
              How it works
            </div>
            <h2
              className="font-extrabold text-trust-navy"
              style={{ fontSize: "clamp(24px,4vw,36px)", letterSpacing: "-0.5px", margin: 0 }}
            >
              Preparing online,{" "}
              <em style={{ fontStyle: "italic", color: "#14B8A6" }}>simplified</em>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                n: "01",
                title: "Pick a Section",
                desc: "Choose from Quantitative Aptitude, DILR, or VARC — the three pillars of CAT.",
                color: "#1E3A5F",
              },
              {
                n: "02",
                title: "Follow the Roadmap",
                desc: "Topics and subtopics are organized in a proven learning order. No guesswork.",
                color: "#0F766E",
              },
              {
                n: "03",
                title: "Access Free Resources",
                desc: "Each subtopic links to the best videos, notes, and articles — all free.",
                color: "#92400E",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="card-hover"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "28px 24px",
                  border: "1.5px solid #E8EAF0",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: `${s.color}18`,
                    position: "absolute",
                    top: 12,
                    right: 20,
                    lineHeight: 1,
                    letterSpacing: "-2px",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${s.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{ width: 14, height: 14, borderRadius: "50%", background: s.color }}
                  />
                </div>
                <h3
                  className="font-bold text-trust-navy mb-2"
                  style={{ fontSize: 16 }}
                >
                  {s.title}
                </h3>
                <p className="text-slate-500" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps */}
      <section id="browse" style={{ padding: "72px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <div
              className="font-bold uppercase mb-2.5"
              style={{ fontSize: 11, color: "#14B8A6", letterSpacing: "2px" }}
            >
              Available Now
            </div>
            <h2
              className="font-extrabold text-trust-navy mb-2.5"
              style={{ fontSize: "clamp(24px,4vw,36px)", letterSpacing: "-0.5px", margin: "0 0 10px" }}
            >
              Browse Roadmaps
            </h2>
            <p className="text-slate-500" style={{ fontSize: 15, margin: 0 }}>
              Each roadmap organizes videos, notes, and links — so you focus on learning, not searching.
            </p>
          </div>

          {/* Roadmaps table */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #E8EAF0",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                background: "#1E3A5F",
                padding: "12px 24px",
              }}
            >
              <span
                className="font-bold uppercase"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.8px" }}
              >
                Roadmap
              </span>
              <span
                className="font-bold uppercase"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.8px" }}
              >
                Access
              </span>
            </div>

            {/* CAT row — live */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1E3A5F" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2 17l10 5 10-5" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
                    <path d="M2 12l10 5 10-5" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-trust-navy" style={{ fontSize: 16 }}>CAT Roadmap</div>
                  <div className="text-slate-400 mt-0.5" style={{ fontSize: 12 }}>
                    QA · DILR · VARC · 60+ subtopics
                  </div>
                </div>
                <span
                  className="font-bold"
                  style={{
                    padding: "3px 10px",
                    background: "#ECFDF5",
                    color: "#059669",
                    fontSize: 11,
                    borderRadius: 100,
                    marginLeft: 4,
                  }}
                >
                  Live
                </span>
              </div>
              <Link
                href="/cat-prep"
                className="font-bold text-white"
                style={{
                  background: "#14B8A6",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 20px",
                  fontSize: 13,
                  boxShadow: "0 2px 8px rgba(20,184,166,0.3)",
                  textDecoration: "none",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                Open →
              </Link>
            </div>

            {/* Coming soon rows */}
            {[
              { label: "GMAT Roadmap", sub: "Verbal · Quant · IR", icon: "M" },
              { label: "GRE Roadmap", sub: "Math · Verbal · AWA", icon: "G" },
              { label: "UPSC Roadmap", sub: "Prelims · Mains · Optional", icon: "U" },
            ].map((r, i) => (
              <div
                key={r.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  padding: "18px 24px",
                  borderBottom: i < 2 ? "1px solid #F1F5F9" : "none",
                  opacity: 0.55,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#94A3B8",
                    }}
                  >
                    {r.icon}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ fontSize: 15, color: "#64748B" }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#CBD5E1", marginTop: 2 }}>{r.sub}</div>
                  </div>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    background: "#F8FAFC",
                    color: "#94A3B8",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 100,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  Coming Soon
                </span>
              </div>
            ))}
          </div>

          {/* Waitlist */}
          <div
            className="text-center mt-8"
            style={{
              background: "linear-gradient(135deg, #1E3A5F, #0F766E)",
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <h3 className="text-white font-bold mb-1.5" style={{ fontSize: 18 }}>
              Get notified when new roadmaps launch
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 18px" }}>
              GMAT, GRE, and UPSC roadmaps are in progress.
            </p>
            {joined ? (
              <div className="font-bold" style={{ color: "#5EEAD4", fontSize: 15 }}>
                You&apos;re on the list!
              </div>
            ) : (
              <div
                className="flex gap-2 justify-center flex-wrap"
                style={{ maxWidth: 400, margin: "0 auto" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  onClick={() => { if (email) setJoined(true); }}
                  className="font-bold text-white"
                  style={{
                    background: "#14B8A6",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "72px 24px", background: "#FFFDF8" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <div
              className="font-bold uppercase mb-2.5"
              style={{ fontSize: 11, color: "#14B8A6", letterSpacing: "2px" }}
            >
              FAQ
            </div>
            <h2
              className="font-extrabold text-trust-navy"
              style={{ fontSize: "clamp(22px,4vw,32px)", letterSpacing: "-0.4px", margin: 0 }}
            >
              Common Questions
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {FAQS.map((faq) => (
              <div
                key={faq.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: `1.5px solid ${openFaq === faq.id ? "#14B8A6" : "#E8EAF0"}`,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left gap-3"
                  style={{
                    padding: "16px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    className="font-semibold text-trust-navy"
                    style={{ fontSize: 15, lineHeight: 1.4 }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: openFaq === faq.id ? "#14B8A6" : "#F1F5F9",
                      color: openFaq === faq.id ? "#fff" : "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                      fontWeight: 700,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {openFaq === faq.id ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="faq-answer"
                  style={{ maxHeight: openFaq === faq.id ? 200 : 0 }}
                >
                  <p style={{ padding: "0 20px 16px", fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "72px 24px",
          background: "linear-gradient(135deg, #1E3A5F 0%, #0F766E 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            className="text-white font-extrabold mb-3.5"
            style={{ fontSize: "clamp(24px,4vw,38px)", letterSpacing: "-0.5px" }}
          >
            Start learning with<br />a clear roadmap
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, marginBottom: 32 }}>
            No sign-up needed. Just pick a topic and start learning.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/cat-prep"
              className="font-extrabold text-trust-navy"
              style={{
                background: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                textDecoration: "none",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              Open CAT Roadmap →
            </Link>
            <button
              className="font-semibold text-white"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Join Community
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Open learning · Community improved · 100% free
          </p>
        </div>
      </section>
    </div>
  );
}
