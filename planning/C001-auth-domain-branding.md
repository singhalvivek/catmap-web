# C001 — StudyNaksha on the Google sign-in screen

## Goal
Google's account chooser says "Choose an account to continue to **learnmax-vivek.firebaseapp.com**",
because `authDomain` is the Firebase project's default domain. Students see an unknown name at the
moment we ask for their Google account. This item makes the sign-in screen say **studynaksha.com**
and show the app name **StudyNaksha**, without moving to a new Firebase project.

The project ID `learnmax-vivek` can never be changed. It stays visible only in developer places
(console URLs, the storage bucket name). Everything a student sees is changed below.

## Files Affected
- `next.config.ts` — `rewrites()` proxies `/__/auth/*` and `/__/firebase/*` to
  `https://<FIREBASE_PROJECT_ID>.firebaseapp.com`, so Firebase's sign-in helper is served from our
  own domain (Firebase's "Option 3: proxy auth requests", redirect-best-practices doc). The host is
  built from `ENV.FIREBASE_PROJECT_ID`, so a project change needs no code change.
- `firebase.md` — documents the custom auth domain setup.

## Console and hosting steps (no code)
Order matters: if the env var changes before steps 1–3, sign-in breaks in production.

1. **Deploy this branch** to production. The proxy does nothing until `authDomain` points at it.
   Check `https://studynaksha.com/__/auth/handler` returns Firebase's helper page (HTTP 200).
2. **Google Cloud → APIs & Services → Credentials → OAuth 2.0 Client "Web client (auto created by
   Google Service)"**:
   - Authorized JavaScript origins: add `https://studynaksha.com`
   - Authorized redirect URIs: add `https://studynaksha.com/__/auth/handler`
   - Keep the existing `learnmax-vivek.firebaseapp.com` entries (local dev and previews use them).
3. **Firebase → Authentication → Settings → Authorized domains**: confirm `studynaksha.com` and
   `www.studynaksha.com` are listed.
4. **Vercel → Settings → Environment Variables**: set `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studynaksha.com`
   for **Production only**, then redeploy (`NEXT_PUBLIC_*` values are baked in at build time).
   Preview and Development keep `learnmax-vivek.firebaseapp.com`.
5. **Names:**
   - Firebase → Project settings → General → *Project name* → `StudyNaksha` (console display only).
   - Firebase → Project settings → General → *Public-facing name* → `StudyNaksha`, support email set.
   - Google Cloud → Google Auth Platform → Branding: app name `StudyNaksha`, logo, home page
     `https://studynaksha.com`, privacy policy and terms URLs, authorized domain `studynaksha.com`.
   - Optional: Google Auth Platform → Verification Center → brand verification, so Google shows the
     name and logo. It needs `studynaksha.com` verified in Search Console and a privacy-policy link
     on the home page.

## Acceptance Criteria
- [ ] `https://studynaksha.com/__/auth/handler` returns Firebase's sign-in helper page (200).
- [ ] On studynaksha.com, "Login with Google" opens a popup on `studynaksha.com/__/auth/handler`,
      and Google's chooser says "continue to studynaksha.com".
- [ ] Sign-in completes; the header shows the user; saved progress for an existing account loads
      (same project, so the same UID and Firestore data).
- [ ] Firebase and Google Cloud consoles show the project as "StudyNaksha".
- [ ] Local dev (`npm run dev`) sign-in still works with the firebaseapp.com auth domain.
- [ ] A Google account that is not a test user can sign in. The OAuth app's publishing status is
      "Testing" (Google Auth Platform → Audience), and "Publish app" stays disabled until Branding
      has a privacy policy link.

## Test Plan
- Local, before deploy: `npm run dev`, then `curl -I http://localhost:3000/__/auth/handler` → 200,
  and Google sign-in still works (auth domain unchanged locally).
- Production, after steps 1–4: sign in from a private window on desktop and on mobile. Sign out and
  sign in again. Open a Daily Challenge and check the streak and progress load.
- Edge case: a popup blocker. The existing "allow popups" path is unchanged.
- Edge case: a Vercel preview URL still signs in through firebaseapp.com.

## Out of Scope
- Moving to a new Firebase project. The project ID only shows in developer places, and a move would
  need a migration of Auth users and Firestore data plus new keys everywhere.
- Switching `signInWithPopup` to `signInWithRedirect`.
- Removing the hardcoded web config values in `firebase.md`.
