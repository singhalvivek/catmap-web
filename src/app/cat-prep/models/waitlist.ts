// waitlist — domain types for the homepage email capture (waitlist collection)

// Where the address was captured. New capture points get their own value so a later
// list can be segmented by intent rather than guessed at.
export const WAITLIST_SOURCES = ["landing_waitlist"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

export type WaitlistEntry = {
  email: string;
  exam: string;
  source: WaitlistSource;
  createdAt: Date;
  updatedAt: Date;
};
