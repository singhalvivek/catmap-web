import { describe, it, expect } from "vitest";
import { isValidEmail, normaliseEmail, MAX_EMAIL_LENGTH } from "../lib/waitlistValidation";

describe("normaliseEmail", () => {
  it("trims and lowercases so the same person cannot enter twice", () => {
    expect(normaliseEmail("  Aspirant@Example.COM ")).toBe("aspirant@example.com");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const email of ["a@b.co", "first.last@sub.domain.in", "user+tag@gmail.com"]) {
      expect(isValidEmail(email), email).toBe(true);
    }
  });

  it("rejects malformed addresses", () => {
    for (const email of ["", "not-an-email", "no@domain", "@example.com", "a@.com", "two@@at.com"]) {
      expect(isValidEmail(email), email).toBe(false);
    }
  });

  it("rejects addresses containing whitespace", () => {
    expect(isValidEmail("a b@example.com")).toBe(false);
    expect(isValidEmail("a@exam ple.com")).toBe(false);
  });

  it("rejects addresses over the length cap", () => {
    const long = `${"a".repeat(MAX_EMAIL_LENGTH)}@example.com`;
    expect(isValidEmail(long)).toBe(false);
  });
});
