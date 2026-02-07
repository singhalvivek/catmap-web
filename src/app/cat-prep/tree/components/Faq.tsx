"use client";

import { useState } from "react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export default function Faq({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <div className="w-full max-w-2xl mt-12">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenId(isOpen ? null : faq.id)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
              >
                {faq.question}
                <span className="text-gray-500">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">
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
