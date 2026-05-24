// DetailsPanel — fixed side-panel orchestrator; composes NodeHeader, ProgressPicker, NodeDescription, ResourceList, FeedbackForm, ResourceViewer (read-only; suggestions go via WhatsApp/Telegram)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Node } from "../../models/node";
import { Description } from "../../models/description";
import { Resource } from "../../models/resource";
import { ProgressStatus } from "../../models/progress";
import { useProgressContext } from "../../lib/ProgressContext";
import { calculateNodeProgress } from "../../lib/progressCalculator";

import NodeHeader from "./NodeHeader";
import ProgressPicker from "./ProgressPicker";
import NodeDescription from "./NodeDescription";
import ResourceList from "./ResourceList";
import FeedbackForm from "./FeedbackForm";
import ResourceViewer from "./ResourceViewer";

export default function DetailsPanel({
  selected,
  descriptions,
  resources,
  onClose,
}: {
  selected: Node;
  descriptions: Description[];
  resources: Resource[];
  onClose: () => void;
}) {
  const originalDesc = useMemo(
    () => descriptions.find((d) => d.parent_id === selected.id)?.text ?? "",
    [descriptions, selected.id]
  );
  const originalResources = useMemo(
    () =>
      resources
        .filter((r) => r.parent_id === selected.id)
        .sort((a, b) => a.order_index - b.order_index),
    [resources, selected.id]
  );

  const [savingProgress, setSavingProgress]   = useState(false);
  const [progressError, setProgressError]     = useState<string | null>(null);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signingIn, setSigningIn]             = useState(false);

  const { progress, updateProgress, isLoggedIn } = useProgressContext();
  const status = progress[selected.id] ?? ProgressStatus.NOT_STARTED;

  // Touch tracking for swipe-to-close (mobile + tablet bottom sheet)
  const panelRef    = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);

  useEffect(() => {
    setProgressError(null);
    setViewingResource(null);
    setShowSignInModal(false);
  }, [selected.id]);

  const { percent } = useMemo(
    () => calculateNodeProgress(selected, progress),
    [selected, progress]
  );
  const isLocked = selected.type === "TOPIC" && percent < 70;

  async function handleStatusChange(newStatus: ProgressStatus) {
    setProgressError(null);
    setSavingProgress(true);
    const updated = await updateProgress(selected.id, newStatus);
    if (!updated) setProgressError("Could not save. Please try again.");
    setSavingProgress(false);
  }

  async function handleGoogleSignIn() {
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setShowSignInModal(false);
    } catch {
      // user dismissed or popup blocked — leave modal open
    } finally {
      setSigningIn(false);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0 && panelRef.current) {
      touchDeltaY.current = delta;
      panelRef.current.style.transform = `translateY(${delta}px)`;
      panelRef.current.style.transition = "none";
    }
  }

  function handleTouchEnd() {
    if (!panelRef.current) return;
    if (touchDeltaY.current > 100) {
      onClose();
    } else {
      panelRef.current.style.transform = "";
      panelRef.current.style.transition = "";
      touchDeltaY.current = 0;
    }
  }

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div className="fixed inset-0 z-[199] bg-black/40" onClick={onClose} aria-hidden />

      {/* Panel
          Mobile + Tablet (< lg) : bottom sheet, full width, 82vh, slide from bottom
          Desktop (lg+)          : right drawer, 1/3 width, top-0 to bottom, slide from right
      */}
      <div
        ref={panelRef}
        role="complementary"
        aria-label="Node details"
        className={[
          "details-panel",
          "fixed z-[200] flex flex-col",
          // Mobile + Tablet: bottom sheet
          "bottom-0 left-0 right-0 h-[82vh] rounded-t-3xl",
          // Desktop: right panel from very top
          "lg:top-0 lg:right-0 lg:left-auto lg:bottom-0 lg:w-1/3 lg:h-auto lg:rounded-none",
        ].join(" ")}
        style={{ background: "#FFFDF8" }}
      >
        {/* Drag handle — mobile + tablet only */}
        <div
          className="flex justify-center items-center flex-shrink-0 lg:hidden"
          style={{ paddingTop: 12, paddingBottom: 6, touchAction: "none", cursor: "grab" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-hidden
        >
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#CBD5E1" }} />
        </div>

        {viewingResource ? (
          <ResourceViewer
            resource={viewingResource}
            onBack={() => setViewingResource(null)}
          />
        ) : (
          <>
            <NodeHeader selected={selected} onClose={onClose} />

            <div className="flex-1 overflow-y-auto" style={{ padding: 20 }}>
              <ProgressPicker
                status={status}
                isLoggedIn={isLoggedIn}
                saving={savingProgress}
                error={progressError}
                onStatusChange={handleStatusChange}
                onNeedSignIn={() => setShowSignInModal(true)}
              />

              {isLocked ? (
                <div
                  style={{
                    borderRadius: 12,
                    border: "1.5px solid #E2E8F0",
                    background: "#F8FAFC",
                    padding: "20px 16px",
                    textAlign: "center",
                  }}
                >
                  <p className="font-semibold text-trust-navy mb-1" style={{ fontSize: 14 }}>
                    Revision &amp; Sectional Test Locked
                  </p>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>
                    Complete 70% of subtopics to unlock.
                  </p>
                  <p className="font-medium" style={{ fontSize: 13, color: "#14B8A6" }}>
                    {percent}% complete
                  </p>
                </div>
              ) : (
                <>
                  <NodeDescription originalDesc={originalDesc} />
                  <ResourceList
                    originalResources={originalResources}
                    onOpen={setViewingResource}
                  />
                </>
              )}
            </div>
            <FeedbackForm topicTitle={selected.title} />
          </>
        )}
      </div>

      {/* Sign-in modal — shown when a progress button is tapped while logged out */}
      {showSignInModal && (
        <>
          <div
            className="fixed inset-0 z-[201] bg-black/50"
            onClick={() => setShowSignInModal(false)}
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
            <div
              className="font-bold text-trust-navy"
              style={{ fontSize: 17, marginBottom: 8 }}
            >
              Sign in to track progress
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
              Save your progress across all devices with Google Sign-In. It&apos;s free.
            </p>
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full font-semibold"
              style={{
                background: "#1E3A5F",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 14,
                cursor: signingIn ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: signingIn ? 0.7 : 1,
              }}
            >
              {signingIn ? "Signing in…" : "Sign in with Google"}
            </button>
            <button
              onClick={() => setShowSignInModal(false)}
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
      )}
    </>
  );
}
