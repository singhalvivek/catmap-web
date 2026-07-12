// MCQOptions — radio-style option buttons for MCQ questions; supports text or image options
"use client";

import type { QuestionOption } from "../../../models/dailyChallenge";
import MathText from "./MathText";

type Props = {
  options: QuestionOption[];
  selected: number | null;
  onSelect: (index: number) => void;
};

export default function MCQOptions({ options, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.index;
        return (
          <button
            key={opt.index}
            onClick={() => onSelect(opt.index)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border: isSelected ? "1.5px solid #1E3A5F" : "1.5px solid #E2E8F0",
              background: isSelected ? "#EEF2FF" : "#fff",
              color: isSelected ? "#1E3A5F" : "#334155",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                border: "1.5px solid currentColor",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                flexShrink: 0,
                opacity: 0.7,
              }}
            >
              {String.fromCharCode(65 + opt.index)}
            </span>

            {opt.imageUrls.length > 0 ? (
              opt.imageUrls.map((url) => (
                /* image origin is scraper-supplied and unknown at build time */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`Option ${String.fromCharCode(65 + opt.index)}`}
                  style={{ maxHeight: 60, borderRadius: 4 }}
                />
              ))
            ) : (
              <MathText text={opt.text ?? ""} />
            )}
          </button>
        );
      })}
    </div>
  );
}
