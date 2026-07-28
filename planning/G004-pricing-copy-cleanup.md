# G004 — Pricing Copy Cleanup

## Goal

Remove the "later ₹200/mo" promise from the homepage. It contradicts FAQ `account-needed` and the free-forever positioning on the same page, and invites "so it's not really free" for zero benefit. It is also now factually wrong: the pricing decision is a ₹299 one-time exam-season product, with any subscription landing April 2027 at ₹149–249/month.

The FAQ `cost` answer carries the same claim plus a second error — it promises "an ad-free experience", which implies ads the product has explicitly decided never to run. Both are fixed here; they are one concern (stale pricing copy), not two.

## Files Affected

- `src/app/LandingPageClient.tsx` — comparison row `Cost` becomes `Free`; the `comparisonValColor` special-case for the old string is dropped.
- `src/app/data.ts` — FAQ `cost` answer rewritten to state the content is free and that anything paid later is analysis the platform builds itself.

## Acceptance Criteria

- [ ] No occurrence of `₹200` anywhere in `src/`.
- [ ] The comparison table's Cost cell reads `Free` and still renders green.
- [ ] The FAQ answer claims nothing about ads, and no price that isn't decided.
- [ ] No claim of a user count, testimonial, or credential is introduced.

## Test Plan

- `grep -rn "₹200" src/` → no matches.
- Load the homepage; the Cost row reads "Free" in green, matching the "Free" cell in the YouTube column.
- Expand the "Is it really free?" FAQ and read it against the comparison table for contradictions.

## Out of Scope

- The full homepage rewrite to lead with PYQ (September, Cowork brief).
- Building or pricing the paid product itself (October).
