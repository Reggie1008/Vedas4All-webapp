"use client";

import { useState } from "react";
import type { SandhiGroup } from "@/lib/fundamentals";

/**
 * Both continuity decks teach the same move: a sound meets another sound
 * and changes to match where that sound is made. The places are the ones
 * Module 1 already introduced, so this selector deliberately mirrors
 * ArticulationChart — the reader is walking back into a room they know.
 */
export default function SandhiChart({ groups }: { groups: SandhiGroup[] }) {
  const [active, setActive] = useState(0);
  const group = groups[active];

  return (
    <div>
      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist">
        {groups.map((g, i) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
              i === active
                ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
            }`}
          >
            <span className="block text-sm font-semibold">{g.label}</span>
            {g.result && (
              <span
                className={`mt-0.5 block font-serif text-base ${
                  i === active ? "text-[#08111a]/75" : "text-ink-3"
                }`}
              >
                becomes {g.result}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 animate-fade-up rounded-2xl border border-hairline p-5">
        {/* The rules themselves */}
        <div className="flex flex-wrap gap-2">
          {group.rules.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-4 py-2.5"
            >
              <span className="iast-text font-serif text-lg text-ink">{r.from}</span>
              <Arrow />
              <span className="iast-text font-serif text-lg font-semibold text-ink">{r.to}</span>
            </span>
          ))}
        </div>

        {group.examples.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow mb-2">
              Heard in the chants
            </p>
            <ul className="space-y-1.5">
              {group.examples.map((ex, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-baseline gap-x-3 rounded-xl border border-hairline px-4 py-2.5"
                >
                  <span className="iast-text font-serif text-lg text-ink">{ex.text}</span>
                  {ex.note && <span className="text-xs text-ink-3">{ex.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {group.note && <p className="mt-4 text-sm leading-relaxed text-ink-3">{group.note}</p>}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
