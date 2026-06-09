// SignInModal — reusable Google sign-in prompt modal
"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { trackEvent } from "@/app/components/analytics";

export default function SignInModal({
  message,
  onClose,
  onSuccess,
  triggerLocation = "practice_gate",
}: {
  message: string;
  onClose: () => void;
  onSuccess?: () => void;
  triggerLocation?: string;
}) {
  const [signing, setSigning] = useState(false);

  async function handleSignIn() {
    setSigning(true);
    trackEvent("signin_clicked", { trigger_location: triggerLocation });
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      onSuccess?.();
    } catch {
      // user dismissed popup — leave modal open
    } finally {
      setSigning(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[201] bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed z-[202] top-1/2 left-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
          width: "min(300px, calc(100vw - 48px))",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div className="font-bold text-trust-navy" style={{ fontSize: 17, marginBottom: 8 }}>
          Sign in to practice
        </div>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
          {message}
        </p>
        <button
          onClick={handleSignIn}
          disabled={signing}
          className="w-full font-semibold"
          style={{
            background: "#1E3A5F",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 14,
            cursor: signing ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: signing ? 0.7 : 1,
          }}
        >
          {signing ? "Signing in…" : "Sign in with Google"}
        </button>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#94A3B8",
            fontSize: 13,
            cursor: "pointer",
            marginTop: 12,
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
