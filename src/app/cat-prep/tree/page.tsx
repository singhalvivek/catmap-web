"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Column */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 sm:p-8 overflow-y-auto">
          <div className="w-full max-w-4xl">
            {/* Learning Path Header */}
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                CAT Learning Path
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Follow a structured roadmap to master CAT concepts
              </p>
            </div>

            {/* Learning Path */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Topics</h2>
              <Tree
                roots={tree}
                onSelect={setSelected}
                selectedId={selected?.id ?? null}
              />
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
              <Faq faqs={faqs as any[]} />
            </div>
          </div>
        </main>

        {/* Right Slide-in Panel */}
        {selected && (
          <aside
            className={`fixed top-16 right-0 h-[calc(100vh-64px)] w-full md:w-3/5 lg:w-2/5 xl:w-2/5 max-w-[900px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out translate-x-0`}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              aria-label="Close details panel"
            >
              ✕
            </button>

            <div className="p-6 pt-12">
              <DetailsPanel
                selected={selected}
                descriptions={descriptions as Description[]}
                resources={resources as Resource[]}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
