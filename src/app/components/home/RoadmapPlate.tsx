// RoadmapPlate — the hero's openable roadmap panel, cycling through the three CAT sections
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type PlateSubtopic = { id: number; title: string; href: string };

export type PlateTopic = {
  id: number;
  title: string;
  href: string;
  total: number;
  hidden: number;
  subtopics: PlateSubtopic[];
};

export type PlateSubject = {
  id: number;
  title: string;
  abbr: string;
  topics: PlateTopic[];
};

/** How many topics start open on each section. */
const OPEN_BY_DEFAULT = 2;
const CYCLE_MS = 5200;

type Props = { subjects: PlateSubject[] };

export default function RoadmapPlate({ subjects }: Props) {
  const [active, setActive] = useState(0);
  /**
   * Auto-advance exists to show that the roadmap covers three sections, not to take the
   * panel away from someone reading it. Any interaction — opening a topic, hovering,
   * focusing, choosing a tab — stops it permanently.
   *
   * `stopped` is only ever set from an event handler, never from an effect: the effect's
   * single job is to own the interval's lifetime. Server and first client render both
   * show section one with no timer running, so there is nothing to mismatch.
   */
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped || subjects.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setActive((i) => (i + 1) % subjects.length),
      CYCLE_MS
    );
    return () => window.clearInterval(timer);
  }, [stopped, subjects.length]);

  function stopCycling() {
    setStopped(true);
  }

  const subject = subjects[active];
  if (!subject) return null;

  return (
    <figure
      data-parallax="0.05"
      style={{ margin: 0, transform: "translate3d(0, var(--parallax-y, 0px), 0)" }}
    >
      {/* Framed like a plate in a book: solid ink header, offset accent shadow, so the
          product itself is the most physically present object in the hero. */}
      <div
        onMouseEnter={stopCycling}
        onFocusCapture={stopCycling}
        style={{
          border: "2px solid var(--ink)",
          background: "#fff",
          boxShadow: "7px 7px 0 var(--accent)",
        }}
      >
        <div
          data-ground="dark"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "11px 14px 11px 18px",
            background: "var(--ink)",
          }}
        >
          <span className="display" style={{ fontSize: 21, color: "#fff" }}>
            {subject.title}
          </span>

          <div
            role="tablist"
            aria-label="CAT sections"
            style={{ display: "flex", gap: 4, flexShrink: 0 }}
          >
            {subjects.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.title}
                className="plate-tab"
                data-active={i === active}
                onClick={() => {
                  stopCycling();
                  setActive(i);
                }}
              >
                {s.abbr}
              </button>
            ))}
          </div>
        </div>

        {/*
          Real <details> rather than a static picture of a tree: the reader can open every
          topic, on any device, with no JavaScript — which is also how the roadmap behaves.
          Keyed on the subject so switching section resets the open state cleanly.
        */}
        <div key={subject.id} className="plate-body" style={{ padding: "8px 18px 14px" }}>
          {subject.topics.map((topic, i) => (
            <details
              key={topic.id}
              className="plate-topic"
              open={i < OPEN_BY_DEFAULT}
              onToggle={stopCycling}
            >
              <summary className="plate-topic__summary">
                <span className="plate-topic__chevron" aria-hidden="true">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3 1.5 L7 5 L3 8.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="plate-topic__title">{topic.title}</span>
                <span className="plate-topic__count">{topic.total}</span>
              </summary>

              <ul className="plate-topic__list">
                {topic.subtopics.map((sub) => (
                  <li key={sub.id}>
                    <Link href={sub.href} className="plate-topic__link">
                      {sub.title}
                    </Link>
                  </li>
                ))}
                {topic.hidden > 0 && (
                  <li>
                    <Link href={topic.href} className="plate-topic__more">
                      and {topic.hidden} more
                    </Link>
                  </li>
                )}
              </ul>
            </details>
          ))}
        </div>
      </div>

      <figcaption
        style={{
          fontSize: 12,
          color: "var(--ink-faint)",
          marginTop: 10,
          lineHeight: 1.5,
        }}
      >
        Not a mockup. This is the roadmap itself, read from the same file — open any topic.
      </figcaption>
    </figure>
  );
}
