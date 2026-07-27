# G003 — Waitlist Capture

## Goal

Actually store the email addresses the homepage waitlist collects. Today `LandingPageClient.tsx` sets a `joined` flag and fires a `waitlist_submitted` analytics event, then discards the address. `NEXT_PUBLIC_SHEETS_WEBHOOK_URL` exists in `.env.local` and `.env.example` but is referenced nowhere in `src/` — there is no webhook integration to repair, only one to build.

Destination: a MongoDB `waitlist` collection. Mongo is already the source of truth for every other piece of app data, needs no third-party availability, and is queryable for the tracker's "Emails" column.

## Files Affected

- `src/app/api/waitlist/route.ts` — **new**. `POST { email, exam }`; validates, normalises, upserts on email, returns 200. No auth (public form).
- `src/lib/waitlistQueries.ts` — **new**. `saveWaitlistEntry` — the Mongo write, kept out of the route per existing `*Queries.ts` convention.
- `src/app/cat-prep/models/waitlist.ts` — **new**. `WaitlistEntry` type.
- `src/app/LandingPageClient.tsx` — submit handler calls the API; adds submitting/error states and client-side email validation.

`NEXT_PUBLIC_SHEETS_WEBHOOK_URL` is dead config and should be dropped from `.env.example` and from the Vercel project settings. It cannot be done in this commit: `.env.example` is matched by the `.env*` rule in `.gitignore` and has never been tracked, so the repo has no copy to change. Removed locally; remove it in Vercel by hand.

## Design Notes

- **Dedupe** — `updateOne` with `upsert: true` keyed on the lowercased email. `$setOnInsert` the `createdAt` so a re-submission doesn't reset it; `$set` the exam so a changed answer is captured.
- **Stored shape** — `email`, `exam`, `source` (`"landing_waitlist"`, so later capture points are distinguishable), `createdAt`, `updatedAt`.
- **Validation** — a conservative RFC-shaped regex plus a length cap, on both client and server. The server is the one that counts.
- **Failure** — on a non-2xx the form shows an inline error and does *not* show "You're on the list!". Losing an address silently is the bug being fixed; it must not survive in a new form.
- **Analytics** — `waitlist_submitted` moves to *after* a confirmed save, so the GA number stops overcounting.
- **Index** — a unique index on `email` should be created once in Atlas; the upsert is correct without it, but the index makes the guarantee real.

## Acceptance Criteria

- [ ] Submitting the form writes a document to the `waitlist` collection.
- [ ] Submitting the same email twice leaves exactly one document, with `createdAt` unchanged.
- [ ] An invalid email is rejected client-side and, if forced, server-side with a 400.
- [ ] A server error surfaces an inline message; the success state is not shown.
- [ ] `waitlist_submitted` fires only on a confirmed save.
- [ ] The button is disabled while the request is in flight.
- [ ] No secrets or connection strings reach the client bundle.

## Test Plan

- Submit a valid address; confirm the document in Atlas.
- Submit the same address with a different exam; confirm one document, exam updated, `createdAt` unchanged.
- Submit `not-an-email`; confirm the button stays inert.
- `curl -X POST /api/waitlist -d '{"email":"x","exam":"CAT"}'` → 400.
- `curl -X POST /api/waitlist -d '{}'` → 400.
- Stop MongoDB / use a bad URI; confirm the UI shows an error rather than a false success.
- Edge cases: leading/trailing whitespace, uppercase email, 300-character email, missing exam.

## Out of Scope

- Mirroring to Google Sheets (rejected — Mongo is the source of truth; a mirror can be added later if a spreadsheet view is genuinely wanted).
- Sending any email to the address (no ESP is set up).
- The lead magnet — "the 40-paper solving order + a 12-week plan" — which is September's work.
- The Footer's dead "Join Waitlist" `<span>` and item L101 (text box instead of dropdown).
