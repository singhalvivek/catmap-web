// DailyDoseCardShell — the frame both Daily Dose cards share: a named header and a body row
import type { ReactNode } from "react";

/**
 * The two cards were near-twins with the wrapper copy-pasted into each, which is how both
 * ended up carrying `border: 1.5px solid var(--ink)25` — the hex-alpha idiom written
 * against a custom property. That declaration does not parse, so it was dropped, and the
 * only edge either card had was an 8% shadow. One frame, one border.
 */
export default function DailyDoseCardShell({
  name,
  date,
  badge,
  children,
}: {
  /** The card's own name. A heading, so navigating by heading reaches today's items. */
  name: string;
  date: string;
  /** Replaces the date in the header when the card has a state worth announcing. */
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="dd-card">
      <div className="dd-card__head">
        <h2 className="dd-card__name">{name}</h2>
        {badge ?? (
          <span className="dd-card__date" suppressHydrationWarning>
            {date}
          </span>
        )}
      </div>
      <div className="dd-card__body">{children}</div>
    </section>
  );
}

/** The {title, sub, action} row four of the five card states are. */
export function DailyDoseCardRow({
  title,
  sub,
  action,
  muted = false,
}: {
  title: string;
  sub: ReactNode;
  action?: ReactNode;
  /** For the states where there is nothing to do, so the title does not shout. */
  muted?: boolean;
}) {
  return (
    <div className="dd-card__row">
      <div className="dd-card__text">
        <p className="dd-card__title" data-muted={muted}>
          {title}
        </p>
        <p className="dd-card__sub">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function DailyDoseCardSkeleton() {
  return (
    <div className="dd-card__row" aria-hidden="true">
      <div className="dd-card__text">
        <span className="ed-skeleton" style={{ width: "58%", height: 15 }} />
        <span className="ed-skeleton" style={{ width: "34%", height: 12, marginTop: 9 }} />
      </div>
      <span className="ed-skeleton" style={{ width: 118, height: 36 }} />
    </div>
  );
}
