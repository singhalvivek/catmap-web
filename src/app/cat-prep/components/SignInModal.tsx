// SignInModal — reusable Google sign-in prompt modal
"use client";

import { useId, useState } from "react";
import { useDialog } from "../lib/useDialog";
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
  const titleId = useId();
  const dialogRef = useDialog(onClose);

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed z-[202] top-1/2 left-1/2 sign-in-modal"
      >
        <p id={titleId} className="display sign-in-modal__title">
          Sign in to practice
        </p>
        <p className="sign-in-modal__body">{message}</p>
        <button
          onClick={handleSignIn}
          disabled={signing}
          aria-busy={signing}
          className="ed-btn"
          data-weight="primary"
          style={{ width: "100%" }}
        >
          {signing ? "Signing in…" : "Sign in with Google"}
        </button>
        <button
          onClick={onClose}
          className="ed-btn"
          data-weight="quiet"
          style={{ width: "100%", marginTop: 8 }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
