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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Column */}
        <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
          <div className="w-full max-w-2xl">
            {/* Learning Path */}
            <h2 className="text-xl font-semibold mb-6">Learning Path</h2>
            <Tree
              roots={tree}
              onSelect={setSelected}
              selectedId={selected?.id ?? null}
            />

            {/* FAQ Section (separate from tree) */}
            <Faq faqs={faqs as any[]} />
          </div>
        </main>

        {/* Right Slide-in Panel */}
        <aside
          className={`fixed top-14 right-0 h-[calc(100vh-56px)] w-full md:w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
            selected ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
