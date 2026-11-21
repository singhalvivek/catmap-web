// PyqTopicPicker — choose one topic and any of the offered exam years; submits as a plain GET form
"use client";

import { useState } from "react";
import Form from "next/form";
import type { PyqSection, PyqTopicCounts } from "@/app/cat-prep/models/pyq";
import {
  PYQ_TOPICS,
  PYQ_TOPIC_SECTIONS,
  PYQ_TOPIC_YEARS,
  getPyqTopic,
  type PyqTopic,
} from "@/constants/pyqTopics";
import { PYQ_TOPIC_PRACTICE } from "@/constants/routes";
import { listYears, questionCountLabel } from "@/lib/pyqTopicQuery";
import { trackEvent } from "@/app/components/analytics";

const QUICK_PICKS = [
  { label: "Last 3", years: PYQ_TOPIC_YEARS.slice(0, 3) },
  { label: "Last 5", years: PYQ_TOPIC_YEARS.slice(0, 5) },
  { label: "All", years: PYQ_TOPIC_YEARS },
  { label: "Clear", years: [] },
];

// Catalog order is kept, both for the groups and for the topics inside each.
function groupsOf(section: PyqSection): [string, PyqTopic[]][] {
  const groups = new Map<string, PyqTopic[]>();
  for (const topic of PYQ_TOPICS) {
    if (topic.section !== section) continue;
    groups.set(topic.group, [...(groups.get(topic.group) ?? []), topic]);
  }
  return [...groups];
}

// The tab a topic lives under, or the first tab when nothing is picked yet.
function sectionOf(topicSlug: string | null): PyqSection {
  return getPyqTopic(topicSlug ?? "")?.section ?? PYQ_TOPIC_SECTIONS[0].section;
}

function countFor(counts: PyqTopicCounts, slug: string, years: number[]): number {
  const byYear = counts[slug] ?? {};
  return years.reduce((sum, year) => sum + (byYear[year] ?? 0), 0);
}

export default function PyqTopicPicker({
  counts,
  initialTopic,
  initialYears,
  collapsed,
}: {
  counts: PyqTopicCounts;
  initialTopic: string | null;
  initialYears: number[];
  /** A set is showing below, so the picker starts as a one-line summary of it. */
  collapsed: boolean;
}) {
  const [isOpen, setIsOpen] = useState(!collapsed);
  const [topicSlug, setTopicSlug] = useState(initialTopic);
  const [years, setYears] = useState(initialYears);
  const [section, setSection] = useState(sectionOf(initialTopic));
  const topic = topicSlug ? getPyqTopic(topicSlug) : undefined;

  const total = topic ? countFor(counts, topic.slug, years) : 0;
  // With no year picked yet, a topic's count is over every offered year, so the chips
  // still say which topics are worth choosing.
  const countYears = years.length > 0 ? years : PYQ_TOPIC_YEARS;

  if (!isOpen && topic) {
    return (
      <div className="pyq-picker" data-collapsed="true">
        <p className="pyq-picker__summary">
          <strong>{topic.name}</strong> · CAT {listYears(years)} · {questionCountLabel(total)}
        </p>
        <button type="button" className="ed-btn" data-weight="secondary" onClick={() => setIsOpen(true)}>
          Change topic or years
        </button>
      </div>
    );
  }

  function toggleYear(year: number) {
    setYears((prev) =>
      prev.includes(year)
        ? prev.filter((y) => y !== year)
        : PYQ_TOPIC_YEARS.filter((y) => y === year || prev.includes(y))
    );
  }

  function cancel() {
    setTopicSlug(initialTopic);
    setYears(initialYears);
    setSection(sectionOf(initialTopic));
    setIsOpen(false);
  }

  const status = !topic
    ? "Choose a topic."
    : years.length === 0
      ? "Choose at least one year."
      : total === 0
        ? `No ${topic.name} questions in CAT ${listYears(years)}. Add another year.`
        : `${questionCountLabel(total)} from CAT ${listYears(years)}.`;

  return (
    <Form
      action={PYQ_TOPIC_PRACTICE}
      className="pyq-picker"
      onSubmit={() => {
        if (topic) {
          trackEvent("pyq_topic_set_started", {
            topic: topic.slug,
            years: years.join(","),
            questions: total,
          });
        }
      }}
    >
      <fieldset className="pyq-picker__field">
        <legend className="pyq-picker__legend">
          <span className="ed-kicker">Topic</span>
        </legend>
        <div className="pyq-picker__chips" role="group" aria-label="Section">
          {PYQ_TOPIC_SECTIONS.map((s) => (
            <button
              key={s.section}
              type="button"
              className="ed-chip"
              data-selected={section === s.section}
              aria-pressed={section === s.section}
              onClick={() => setSection(s.section)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="pyq-picker__hint">
          Counts are for {years.length > 0 ? "the years you picked" : `all ${PYQ_TOPIC_YEARS.length} years`}.
        </p>

        {/* Every section's radios stay in the form, only hidden, so a topic picked under
            Quant is still submitted after a look at VARC. */}
        {PYQ_TOPIC_SECTIONS.map((s) => (
          <div key={s.section} hidden={s.section !== section}>
            {groupsOf(s.section).map(([group, topics]) => (
              <div key={group} className="pyq-picker__group">
                <p className="pyq-picker__group-name">{group}</p>
                <div className="pyq-picker__chips">
                  {topics.map((t) => {
                    const count = countFor(counts, t.slug, countYears);
                    const checked = t.slug === topicSlug;
                    return (
                      <label
                        key={t.slug}
                        className="ed-chip"
                        data-selected={checked}
                        data-state={count === 0 ? "inert" : undefined}
                      >
                        <input
                          type="radio"
                          name="topic"
                          value={t.slug}
                          checked={checked}
                          onChange={() => setTopicSlug(t.slug)}
                          className="ed-sr-only"
                        />
                        {t.name}
                        <span className="pyq-picker__count">{count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </fieldset>

      <fieldset className="pyq-picker__field">
        <legend className="pyq-picker__legend">
          <span className="ed-kicker">Years</span>
        </legend>
        <div className="pyq-picker__chips">
          {PYQ_TOPIC_YEARS.map((year) => {
            const checked = years.includes(year);
            return (
              <label key={year} className="ed-chip" data-selected={checked}>
                <input
                  type="checkbox"
                  name="year"
                  value={year}
                  checked={checked}
                  onChange={() => toggleYear(year)}
                  className="ed-sr-only"
                />
                {year}
                {topic && <span className="pyq-picker__count">{counts[topic.slug]?.[year] ?? 0}</span>}
              </label>
            );
          })}
        </div>
        <div className="pyq-picker__quick">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              type="button"
              className="ed-btn"
              data-weight="quiet"
              onClick={() => setYears(pick.years)}
            >
              {pick.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="pyq-picker__submit">
        <button type="submit" className="ed-btn" data-weight="primary" disabled={total === 0}>
          Start practice
        </button>
        {collapsed && (
          <button type="button" className="ed-btn" data-weight="quiet" onClick={cancel}>
            Cancel
          </button>
        )}
        <p className="pyq-picker__status" aria-live="polite">
          {status}
        </p>
      </div>
    </Form>
  );
}
