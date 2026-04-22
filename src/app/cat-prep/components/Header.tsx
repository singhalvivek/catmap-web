"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError("Could not sign in with Google. Please try again.");
      console.error("Google sign-in failed", error);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      setAuthError("Could not sign out. Please try again.");
      console.error("Sign-out failed", error);
    }
  };

  return (
    <header className="bg-white border-b border-calm-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl">📚</span>
          <div>
            <h1 className="text-xl font-bold text-trust-navy leading-tight">StudyNaksha</h1>
            <p className="text-xs text-gray-500">Your roadmap to Exams</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-gray-700 text-sm font-medium">CAT Roadmap</span>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600 max-w-40 truncate">
                {user.displayName ?? user.email ?? "Signed in"}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-secondary py-2 px-4 text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn-primary py-2 px-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Login with Google"}
            </button>
          )}

          <Link href="/" className="hidden sm:inline-flex btn-primary py-2 px-6 text-sm">
            Browse Roadmaps
          </Link>
        </div>
      </div>

      {authError && (
        <p className="px-4 pb-3 text-sm text-red-600 text-right max-w-6xl mx-auto">
          {authError}
        </p>
      )}
    </header>
  );
}
