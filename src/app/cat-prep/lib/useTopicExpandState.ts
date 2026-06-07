// useTopicExpandState — tracks which topic rows are open; defaults first topic per subject to open; persists user overrides to localStorage
import { useCallback, useEffect, useMemo, useState } from "react";
import { Node } from "../models/node";

const LS_KEY = "sn:topic_expand:v2";

function firstTopicIds(subjects: Node[]): Set<number> {
  const ids = new Set<number>();
  for (const subject of subjects) {
    const first = (subject.children ?? [])
      .slice()
      .sort((a, b) => a.order_index - b.order_index)[0];
    if (first) ids.add(first.id);
  }
  return ids;
}

function loadUserSet(): Record<number, boolean> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [Number(k), v])
    );
  } catch {
    return null;
  }
}

function saveUserSet(userSet: Record<number, boolean>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(userSet));
  } catch {}
}

export function useTopicExpandState(subjects: Node[]) {
  const defaultOpen = useMemo(() => firstTopicIds(subjects), [subjects]);

  // Only stores topics the user has explicitly toggled; everything else falls back to defaultOpen
  const [userSet, setUserSet] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = loadUserSet();
    if (stored) setUserSet(stored);
  }, []);

  const isOpen = useCallback(
    (topicId: number) => {
      if (topicId in userSet) return userSet[topicId];
      return defaultOpen.has(topicId);
    },
    [userSet, defaultOpen]
  );

  const toggle = useCallback(
    (topicId: number) => {
      setUserSet((prev) => {
        const currentlyOpen =
          topicId in prev ? prev[topicId] : defaultOpen.has(topicId);
        const next = { ...prev, [topicId]: !currentlyOpen };
        saveUserSet(next);
        return next;
      });
    },
    [defaultOpen]
  );

  return { isOpen, toggle };
}
