"use client";

import { useEffect, useState } from "react";

type View = "welcome" | "chants" | "fundamentals" | "scale";
const VIEWS: View[] = ["welcome", "chants", "fundamentals", "scale"];

/**
 * The portal has four sides: the welcome, the chants, the fundamentals that
 * teach how to chant them, and the base note to chant them on. The choice is
 * remembered, and is addressable as ?view=chants so a page can link to one side.
 */
export default function PortalTabs({
  welcome,
  chants,
  fundamentals,
  scale,
}: {
  welcome: React.ReactNode;
  chants: React.ReactNode;
  fundamentals: React.ReactNode;
  scale: React.ReactNode;
}) {
  // Someone arriving for the first time should meet the welcome.
  const [view, setView] = useState<View>("welcome");

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("view");
    if (wanted && (VIEWS as string[]).includes(wanted)) {
      setView(wanted as View);
      return;
    }
    try {
      const stored = localStorage.getItem("v4a-view");
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
              ["chants", "Chants"],
              ["fundamentals", "Fundamentals"],
              ["scale", "Find your scale"],
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
        {view === "chants" && chants}
        {view === "fundamentals" && fundamentals}
        {view === "scale" && scale}
      </div>
    </>
  );
}
