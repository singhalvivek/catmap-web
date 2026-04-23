# Spec: H3 — Remove Hardcoded Firebase Credential Fallbacks

**Status:** In Progress  
**Branch:** text  
**Report ref:** [report/06-security.md](../report/06-security.md), [report/07-improvements.md](../report/07-improvements.md)

## Goal
Remove all hardcoded Firebase credential values from source code. If any required env var is missing, the app should throw a clear error at startup instead of silently using a hardcoded fallback.

## Context
`src/lib/firebase.ts` currently hardcodes all 7 Firebase config values as `??` fallbacks. All values are already correctly set in `.env.local` (confirmed). `.gitignore` already excludes `.env.local`. The approved validation pattern already exists in `src/config/env.ts`.

## Files Affected
- `src/config/env.ts` — add all 7 Firebase `NEXT_PUBLIC_*` vars using the existing `required()` helper
- `src/lib/firebase.ts` — import `ENV` from `config/env.ts`, replace all `?? "..."` fallbacks with `ENV.*` values
- `.env.example` — create this new file listing all required env vars (values redacted) for onboarding

## Acceptance Criteria
- [ ] `src/lib/firebase.ts` contains zero hardcoded string values for credentials
- [ ] No `??` fallback operator used for any env var in the codebase
- [ ] `src/config/env.ts` validates all 7 Firebase vars using `required()`
- [ ] If any Firebase env var is missing, the app throws: `Missing required env var: NEXT_PUBLIC_FIREBASE_API_KEY` (etc.)
- [ ] `.env.example` exists at the project root with all required var names and placeholder values
- [ ] App still works locally (dev server starts, auth and Firestore function correctly)

## Test Plan
- [ ] Manual: rename `.env.local` temporarily → verify the app throws a clear error on load, not a silent crash
- [ ] Manual: restore `.env.local` → verify dev server starts, Google sign-in works, progress saves to Firestore

## Out of Scope
- Rotating or changing the actual Firebase credentials (that's a Firebase Console task)
- Moving Firebase config to server-only (Firebase web keys are inherently public — this is about hygiene, not secrecy)
- Any changes to Firestore rules or auth configuration

## Notes
- `NEXT_PUBLIC_*` vars are inlined by Next.js at build time for client bundles. They work in both server and client code.
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional (Analytics only). We will still validate it for consistency — if it's ever missing it should be explicit, not silent.
