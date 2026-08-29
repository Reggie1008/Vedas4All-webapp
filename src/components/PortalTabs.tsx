"use client";

import { useEffect, useState } from "react";

/**
 * The portal has two halves: the chants themselves, and the fundamentals
 * that teach how to chant them. The choice is remembered, and is also
 * addressable as ?view=fundamentals so a module can link back to its own
 * side of the portal.
 */
export default function PortalTabs({
  chants,
  fundamentals,
}: {
  chants: React.ReactNode;
  fundamentals: React.ReactNode;
}) {
  const [view, setView] = useState<"chants" | "fundamentals">("chants");

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("view");
    if (wanted === "fundamentals" || wanted === "chants") {
      setView(wanted);
      return;
    }
    const stored = localStorage.getItem("v4a-view");
    if (stored === "fundamentals" || stored === "chants") setView(stored);
  }, []);

  function pick(next: "chants" | "fundamentals") {
    setView(next);
    localStorage.setItem("v4a-view", next);
    const url = new URL(window.location.href);
    if (next === "chants") url.searchParams.delete("view");
    else url.searchParams.set("view", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div
        className="mb-7 inline-flex gap-1.5 rounded-full border border-hairline p-1.5"
        role="tablist"
        aria-label="Portal section"
      >
        {(
          [
            ["chants", "Chants"],
            ["fundamentals", "Fundamentals"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={view === id}
            onClick={() => pick(id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              view === id
                ? "bg-ink text-canvas"
                : "text-ink-2 hover:bg-surface-hi hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="animate-fade-up">{view === "chants" ? chants : fundamentals}</div>
    </>
  );
}
