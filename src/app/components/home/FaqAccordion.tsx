// FaqAccordion — expandable FAQ list; the only interactive block on the home page
"use client";

import { useState } from "react";
import { HOME_FAQS } from "@/constants/homeFaqs";
import { trackEvent } from "@/app/components/analytics";

type Props = {
  /** Distinguishes preview traffic from the live home page in GA4. */
  page: string;
};

export default function FaqAccordion({ page }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {HOME_FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="ed-row">
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                onClick={() => {
                  const opening = !isOpen;
                  setOpenId(opening ? faq.id : null);
                  if (opening) {
                    trackEvent("faq_expanded", {
                      faq_id: faq.id,
                      faq_question: faq.question.slice(0, 100),
                      page,
                    });
                  }
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "18px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: "clamp(16px, 1.7vw, 18px)",
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontSize: 20,
                    lineHeight: 1,
                    color: "var(--ink-faint)",
                    fontWeight: 400,
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>

            {/* Grid-rows collapse: no max-height to outgrow, so a long answer at a narrow
                width cannot be clipped the way the old 200px cap clipped it. */}
            <div className="ed-collapse" data-open={isOpen} id={`faq-answer-${faq.id}`}>
              <div>
                <p
                  style={{
                    margin: 0,
                    paddingBottom: 20,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--ink-soft)",
                    maxWidth: "62ch",
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
