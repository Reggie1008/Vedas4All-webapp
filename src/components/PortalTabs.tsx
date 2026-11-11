"use client";

import { useEffect, useState } from "react";

type View = "welcome" | "vedas101" | "chants" | "fundamentals";
const VIEWS: View[] = ["welcome", "vedas101", "chants", "fundamentals"];

// "Find your scale" was a side of its own before it became the first
// module of Fundamentals; an old link or remembered choice lands there.
const MOVED: Record<string, View> = { scale: "fundamentals" };

/**
 * The portal has four sides: the welcome, Vedas 101 (the beginners' first
 * class), the chants, and the fundamentals that teach how to chant them. The choice is
 * remembered, and is addressable as ?view=chants so a page can link to one side.
 */
export default function PortalTabs({
  welcome,
  vedas101,
  chants,
  fundamentals,
}: {
  welcome: React.ReactNode;
  vedas101: React.ReactNode;
  chants: React.ReactNode;
  fundamentals: React.ReactNode;
}) {
  // Someone arriving for the first time should meet the welcome.
  const [view, setView] = useState<View>("welcome");

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("view");
    const wanted = asked && (MOVED[asked] ?? asked);
    if (wanted && (VIEWS as string[]).includes(wanted)) {
      setView(wanted as View);
      return;
    }
    try {
      const kept = localStorage.getItem("v4a-view");
      const stored = kept && (MOVED[kept] ?? kept);
      if (stored && (VIEWS as string[]).includes(stored)) setView(stored as View);
    } catch {
      /* storage blocked — the default stands */
    }
  }, []);

  function pick(next: View) {
    setView(next);
    try {
      localStorage.setItem("v4a-view", next);
    } catch {
      /* nothing to do */
    }
    const url = new URL(window.location.href);
    if (next === "welcome") url.searchParams.delete("view");
    else url.searchParams.set("view", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div
        className="hide-scrollbar mb-7 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Portal section"
      >
        <div className="inline-flex gap-1.5 rounded-full border border-hairline p-1.5">
          {(
            [
              ["welcome", "Welcome"],
              ["vedas101", "Vedas 101"],
              ["chants", "Chants"],
              ["fundamentals", "Fundamentals"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={view === id}
              onClick={() => pick(id)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                view === id
                  ? "bg-ink text-canvas"
                  : "text-ink-2 hover:bg-surface-hi hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-up">
        {view === "welcome" && welcome}
        {view === "vedas101" && vedas101}
        {view === "chants" && chants}
        {view === "fundamentals" && fundamentals}
      </div>
    </>
  );
}
