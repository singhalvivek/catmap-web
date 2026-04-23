// Faq — accordion FAQ list for the cat-prep page
"use client";

import { useState } from "react";
import { Faq as FaqType } from "../models/faq";

export default function Faq({ faqs }: { faqs: FaqType[] }) {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-bold text-trust-navy mb-8">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border border-calm-border rounded-xl overflow-hidden card-hover"
            >
              <button
                onClick={() =>
                  setOpenId(isOpen ? null : faq.id)
                }
                className="w-full flex items-center justify-between p-5 text-left bg-calm-bg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-trust-navy pr-4">{faq.question}</span>
                <span className={`text-hope-teal text-xl font-bold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-gray-700 text-sm leading-relaxed border-t border-calm-border">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
