// waitlistValidation — pure email/exam checks shared by the waitlist form and its API route
export const MAX_EMAIL_LENGTH = 254;
export const MAX_EXAM_LENGTH = 40;

// Deliberately conservative: one @, a dot-bearing domain, no whitespace. Anything
// stricter starts rejecting valid addresses, and the address is never used to
// authenticate — only to reach someone.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email);
}
