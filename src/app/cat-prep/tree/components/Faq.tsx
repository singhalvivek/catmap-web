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
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenId(isOpen ? null : faq.id)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                {faq.question}
                <span className="text-gray-500 dark:text-gray-400">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700">
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
