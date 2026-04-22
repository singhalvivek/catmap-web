"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

// Data
import data from "../data.json";
import descriptions from "../description.json";
import resources from "../resources.json";
import faqs from "../faq.json";

// Utils & models
import { buildTree } from "./lib/buildTree";
import { Node } from "./models/node";
import { Description } from "./models/description";
import { Resource } from "./models/resource";

// Components
import Tree from "./components/Tree";
import DetailsPanel from "./components/DetailsPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Faq from "./components/Faq";
import { auth } from "@/lib/firebase";
import { getAllProgressStatuses } from "./lib/progressStore";

export default function CatPrepTreePage() {
  const tree = buildTree(data as Node[]);
  const [selected, setSelected] = useState<Node | null>(null);

  // Close details panel on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (typeof window === "undefined") return;

      if (!user) {
        window.dispatchEvent(new Event("progress-updated"));
        return;
      }

      try {
        const allProgress = await getAllProgressStatuses(user.uid);

        Object.keys(localStorage)
          .filter((key) => key.startsWith(`progress_${user.uid}_`))
          .forEach((key) => localStorage.removeItem(key));

        Object.entries(allProgress).forEach(([nodeId, status]) => {
          localStorage.setItem(`progress_${user.uid}_${nodeId}`, status);
        });

        window.dispatchEvent(new Event("progress-updated"));
      } catch (error) {
        console.error("Failed to sync progress from Firestore", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Column */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 sm:p-8 overflow-y-auto">
          <div className="w-full max-w-4xl">
            {/* Learning Path Header */}
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-trust-navy mb-2">
                CAT Roadmap
              </h1>
              <p className="text-lg text-gray-600">
                Follow an organized roadmap to master and track CAT concepts
              </p>
            </div>

            {/* Learning Path */}
            <div className="bg-calm-bg rounded-xl border border-calm-border shadow-card p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-semibold text-trust-navy mb-6">Topics</h2>
              <Tree
                roots={tree}
                onSelect={setSelected}
                selectedId={selected?.id ?? null}
              />
            </div>

            {/* FAQ Section */}
            <div className="bg-calm-bg rounded-xl border border-calm-border shadow-card p-6 sm:p-8">
              <Faq faqs={faqs as any[]} />
            </div>
          </div>
        </main>

        {/* Right Slide-in Panel */}
        {selected && (
          <a
            className="fixed inset-0 z-[60] flex flex-col bg-white overflow-hidden md:inset-auto md:top-16 md:right-0 md:h-[calc(100vh-64px)] md:w-96 md:border-l md:border-calm-border md:shadow-card"
          >
            {/* Close bar — always visible at top */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-calm-border bg-white shrink-0">
              <span className="text-sm font-semibold text-trust-navy truncate pr-4">
                {selected.title}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-calm-bg hover:bg-calm-border text-gray-600 hover:text-trust-navy transition-colors shrink-0"
                aria-label="Close details panel"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <DetailsPanel
                selected={selected}
                descriptions={descriptions as Description[]}
                resources={resources as Resource[]}
              />
            </div>
          </a>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
