// ThemeToggle — switches between light and dark, remembering the choice
"use client";

import { useSyncExternalStore } from "react";
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY, type ThemeChoice } from "@/constants/theme";

type Resolved = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * The theme is an external store in two places at once: an explicit choice in localStorage,
 * and the system setting behind it. Reading it through useSyncExternalStore rather than an
 * effect means the button also follows the system flipping while the page is open — which
 * it does, on a machine set to switch at sunset.
 */
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  // Another tab choosing a theme counts too.
  window.addEventListener("storage", onChange);
  listeners.add(onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    listeners.delete(onChange);
  };
}

function getSnapshot(): Resolved {
  let choice: ThemeChoice = "system";
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "dark" || value === "light") choice = value;
  } catch {
    // Blocked storage: fall through to the system setting.
  }
  if (choice !== "system") return choice;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * The server cannot know either half, and guessing would ship the wrong accessible name in
 * the HTML. It renders as light and corrects on hydration; the ICONS are chosen in CSS, so
 * nothing visible depends on this and there is no flash.
 */
function getServerSnapshot(): Resolved {
  return "light";
}

export default function ThemeToggle() {
  const resolved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = resolved === "dark";

  function toggle() {
    const next: Resolved = isDark ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: the theme still applies for this page view.
    }
    document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    notify();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to the light theme" : "Switch to the dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <svg className="theme-toggle__moon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M16.5 11.8A7 7 0 1 1 8.2 3.5a5.6 5.6 0 0 0 8.3 8.3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="theme-toggle__sun" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 1.6v2.1M10 16.3v2.1M18.4 10h-2.1M3.7 10H1.6M15.9 4.1l-1.5 1.5M5.6 14.4l-1.5 1.5M15.9 15.9l-1.5-1.5M5.6 5.6 4.1 4.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
