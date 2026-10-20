// Header — sticky nav for the roadmap pages; auth via Firebase Google sign-in
"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Wordmark from "@/app/components/Wordmark";
import { trackEvent } from "@/app/components/analytics";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const prevUser = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser && !prevUser.current) {
        const isNew = nextUser.metadata.creationTime === nextUser.metadata.lastSignInTime;
        trackEvent("signin_completed", { method: "google", is_new_user: isNew });
      }
      prevUser.current = nextUser;
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    trackEvent("signin_clicked", { trigger_location: "header" });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError("Could not sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch {
      setAuthError("Could not sign out. Please try again.");
    }
  };

  return (
    <header className="site-header">
      <div className="ed-shell site-header__bar">
        <Wordmark size="sm" />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span
                className="hidden sm:block truncate"
                style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 160 }}
              >
                {user.displayName ?? user.email ?? "Signed in"}
              </span>
              <button type="button" onClick={handleSignOut} className="site-header__auth">
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="site-header__auth"
            >
              {loading ? "Checking…" : "Sign in"}
            </button>
          )}
        </div>
      </div>

      {authError && (
        <p
          className="ed-shell"
          style={{ fontSize: 12, color: "#b91c1c", textAlign: "right", paddingBottom: 8 }}
        >
          {authError}
        </p>
      )}
    </header>
  );
}
