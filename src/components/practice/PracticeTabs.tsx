"use client";

import { useState } from "react";
import type { Verse, WordMeaning } from "@/lib/chants";
import OrderLines from "@/components/practice/OrderLines";
import MatchMeanings from "@/components/practice/MatchMeanings";

export default function PracticeTabs({
  verses,
  words,
}: {
  verses: Verse[];
  words: WordMeaning[];
}) {
  const canOrder = verses.length >= 3;
  const canMatch = words.length >= 3;
  const [view, setView] = useState<"order" | "meanings">(canOrder ? "order" : "meanings");

  const tabs = [
    canOrder && (["order", "Put the lines in order"] as const),
    canMatch && (["meanings", "Match the meanings"] as const),
  ].filter(Boolean) as ["order" | "meanings", string][];

  if (tabs.length === 0) return null;

  return (
    <>
      {tabs.length > 1 && (
        <div
          className="mb-6 inline-flex gap-1.5 rounded-full border border-hairline p-1.5"
          role="tablist"
        >
          {tabs.map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
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
      )}

      <div className="animate-fade-up">
        {view === "order" && canOrder && <OrderLines verses={verses} />}
        {view === "meanings" && canMatch && <MatchMeanings words={words} />}
      </div>
    </>
  );
}
