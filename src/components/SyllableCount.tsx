"use client";

import { useState } from "react";

/**
 * The class exercise: read each line, count its syllables, then check.
 * Checking colours alternate syllables, as the slide does, and shows the
 * count for each line and the total that names the metre.
 */
export default function SyllableCount({ lines }: { lines: string[][] }) {
  const [shown, setShown] = useState(false);
  const total = lines.reduce((n, l) => n + l.length, 0);

  return (
    <div className="rounded-3xl border border-hairline bg-elevated p-5 sm:p-7">
      <ol className="space-y-2">
        {lines.map((line, i) => {
          // Rebuild the words: a syllable starting with a capital starts a word.
          const words: string[][] = [];
          line.forEach((s) => {
            if (/^[A-Z]/.test(s) || words.length === 0) words.push([s]);
            else words[words.length - 1].push(s);
          });
          let k = 0;
          return (
            <li key={i} className="flex items-baseline justify-between gap-4">
              <span className="font-serif text-2xl leading-snug sm:text-3xl">
                {words.map((w, j) => (
                  <span key={j}>
                    {j > 0 && " "}
                    {w.map((s) => {
                      const odd = k++ % 2 === 1;
                      return (
                        <span
                          key={k}
                          className={`transition-colors duration-300 ${
                            shown ? (odd ? "text-[#5B8DEF]" : "text-accent-ink") : "text-ink"
                          }`}
                        >
                          {s}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </span>
              <span
                className={`shrink-0 rounded-lg border px-2.5 py-1 text-sm font-semibold tabular-nums transition ${
                  shown ? "border-[var(--accent)] text-ink" : "border-dashed border-hairline text-ink-3"
                }`}
              >
                {shown ? line.length : "?"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-4" aria-live="polite">
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition hover:opacity-90"
        >
          {shown ? "Hide the count" : "Check my count"}
        </button>
        {shown && (
          <p className="animate-fade-up text-sm text-ink-2">
            {lines.map((l) => l.length).join(" + ")} ={" "}
            <strong className="font-semibold text-ink">{total} syllables</strong>
          </p>
        )}
      </div>
    </div>
  );
}
