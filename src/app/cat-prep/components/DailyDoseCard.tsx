// DailyDoseCard — Learn-home promo tile linking to the Daily Dose section
import Link from "next/link";

export default function DailyDoseCard() {
  return (
    <div className="dd-promo">
      <div>
        <p className="ed-kicker" style={{ margin: "0 0 8px" }}>
          Daily Dose
        </p>
        <p className="display dd-promo__title">Today&apos;s essay and timed set</p>
        <p className="dd-promo__sub">
          A short daily habit for VARC reading, and a set to keep problem-solving warm.
        </p>
      </div>
      <Link href="/cat-prep/daily-dose" className="ed-btn" data-weight="secondary">
        Open Daily Dose
      </Link>
    </div>
  );
}
