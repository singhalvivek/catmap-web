// Header — sticky nav for the roadmap page; auth via Firebase Google sign-in
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
import SNLogo from "./SNLogo";

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
    <header
      className="sticky top-0 z-50 border-b border-calm-border"
      style={{
        background: "#FFFDF8",
        boxShadow: "0 1px 12px rgba(30,58,95,0.06)",
        height: 64,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <SNLogo size={34} />
          <div>
            <div
              className="font-extrabold text-trust-navy leading-tight"
              style={{ fontSize: 17, letterSpacing: "-0.4px" }}
            >
              StudyNaksha
            </div>
            <div className="text-slate-400" style={{ fontSize: 10, letterSpacing: "0.4px" }}>
              CAT Roadmap
            </div>
          </div>
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-3">
          <span
            className="font-semibold text-slate-400"
            style={{
              fontSize: 13,
              padding: "4px 10px",
              background: "#F1F5F9",
              borderRadius: 6,
            }}
          >
            CAT
          </span>

          {user ? (
            <>
              <span className="hidden sm:block text-sm text-slate-500 max-w-[140px] truncate">
                {user.displayName ?? user.email ?? "Signed in"}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="font-semibold text-trust-navy"
                style={{
                  fontSize: 13,
                  padding: "7px 16px",
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="font-semibold text-trust-navy disabled:opacity-60"
              style={{
                fontSize: 13,
                padding: "7px 16px",
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Checking..." : "Login with Google"}
            </button>
          )}

        </div>
      </div>

      {authError && (
        <p className="px-6 pb-2 text-xs text-red-600 text-right" style={{ maxWidth: 1120, margin: "0 auto" }}>
          {authError}
        </p>
      )}
    </header>
  );
}
