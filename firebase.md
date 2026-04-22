# Firebase Setup, Google Login, and Firestore Progress

This project now supports Google sign-in using Firebase Authentication and stores user progress in Firestore.

## What was added

1. Firebase client initializer:
   - `src/lib/firebase.ts`
   - Initializes app once and exports:
     - `auth`
     - `googleProvider`

2. Google login/logout UI and auth state handling:
   - `src/app/cat-prep/tree/components/Header.tsx`
   - Adds:
     - `Login with Google` button (when logged out)
     - User name/email + `Sign out` button (when logged in)
     - Auth state listener via `onAuthStateChanged`

3. Firestore progress persistence:
    - `src/app/cat-prep/tree/lib/progressStore.ts`
    - `src/app/cat-prep/tree/lib/useProgress.ts`
    - `src/app/cat-prep/tree/page.tsx`
    - Stores progress per user at path:
       - `users/{uid}/progress/{nodeId}`

## Environment variables (recommended)

Add these to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCH07PnCksGvt8c0aBmGzuaCCPlw4a34aI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=learnmax-vivek.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=learnmax-vivek
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=learnmax-vivek.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=630525201685
NEXT_PUBLIC_FIREBASE_APP_ID=1:630525201685:web:5220b8a6892ec93ff26d1c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6CFXLK87WW
```

Note: The code has fallbacks to these values if env vars are not set, so local dev still works.

## Firebase Console checklist

1. Go to Firebase Console -> Authentication -> Sign-in method.
2. Enable `Google` provider.
3. Add your app domain to authorized domains:
   - `localhost` (for local dev)
   - Your production domain
4. Firestore Database: create in production mode or test mode and then configure rules.

## Firestore rules (minimum for this feature)

Use rules that allow users to access only their own progress documents:

```txt
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /users/{userId}/progress/{nodeId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
      }
   }
}
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/cat-prep/tree` and test:

1. Click `Login with Google`.
2. Complete Google popup login.
3. Verify user info appears in header.
4. Click `Sign out`.

## Notes

1. This implementation is client-side auth only.
2. It does not yet gate routes or persist user profile data to backend.
3. Learning progress is saved in Firestore for logged-in users.
4. A local cache is used for fast UI refresh after login and updates.
5. If user is not logged in, progress selector is disabled and a login hint is shown.
6. If popup login is blocked, allow popups and retry.

