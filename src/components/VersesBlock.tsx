"use client";

import { useState } from "react";
import type { Verse } from "@/lib/chants";
import { useScriptToggle } from "@/components/ScriptToggleContext";
import { rich } from "@/lib/richText";

export default function VersesBlock({ verses }: { verses: Verse[] }) {
  const { showDevanagari } = useScriptToggle();
  const [open, setOpen] = useState<number | null>(null);

  // Only offer the expand affordance where there is stanza-level content.
  const hasDetail = verses.some((v) => v.meaning || v.words?.length);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      {hasDetail && (
        <p className="border-b border-hairline px-5 py-2.5 text-xs text-ink-3 sm:px-7">
          Tap any stanza for its meaning and word-by-word.
        </p>
      )}

      {verses.map((verse, i) => {
        const detail = verse.meaning || verse.words?.length ? verse : null;
        const isOpen = open === i;

        const body = (
          <>
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)] transition-transform duration-300 ease-smooth ${
                isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
              }`}
            />
            <span
              aria-hidden
              className="absolute right-4 top-4 text-xs font-semibold tabular-nums text-ink-3/50"
            >
              {verse.number ?? String(i + 1).padStart(2, "0")}
            </span>

            {showDevanagari && verse.devanagari && (
              <p className="devanagari-text pr-8">{verse.devanagari}</p>
            )}
            <p className={`pr-8 ${showDevanagari ? "iast-text" : "iast-text-primary"}`}>
              {verse.iast}
            </p>
            {verse.source && (
              <p className="mt-2 text-xs tracking-wide text-ink-3">{verse.source}</p>
            )}

            {detail && (
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-ink">
                {isOpen ? "Hide meaning" : "Meaning"}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={`transition-transform duration-300 ease-smooth ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            )}
          </>
        );

        return (
          <div key={i} className="border-b border-hairline last:border-0">
            {detail ? (
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group relative block w-full px-5 py-5 text-left transition-colors hover:bg-surface sm:px-7 sm:py-6"
              >
                {body}
              </button>
            ) : (
              <div className="group relative px-5 py-5 transition-colors hover:bg-surface sm:px-7 sm:py-6">
                {body}
              </div>
            )}

            {detail && isOpen && (
              <div className="animate-fade-up border-t border-hairline bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] px-5 py-5 sm:px-7">
                {verse.meaning && (
                  <p className="scalable-text leading-relaxed text-ink-2">{rich(verse.meaning)}</p>
                )}
                {verse.words && verse.words.length > 0 && (
                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {verse.words.map((w, j) => (
                      <div key={j} className="flex flex-wrap items-baseline gap-x-2">
                        <dt className="font-serif text-sm font-semibold text-ink">
                          {w.word}
                        </dt>
                        <dd className="text-sm text-ink-3">{rich(w.meaning)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
