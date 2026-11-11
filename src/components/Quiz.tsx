"use client";

import { useState } from "react";

/**
 * One question from the class quizzes. The answer stays hidden until the
 * student commits to a choice; then the right option lights up, a wrong
 * pick is marked, and whatever the slide said with the answer appears.
 */
export default function Quiz({
  question,
  options,
  answer,
  children,
}: {
  question: string;
  options: string[];
  answer: number;
  /** Shown once an option has been picked. */
  children?: React.ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  const letters = options.length > 2;

  return (
    <div className="rounded-3xl border border-hairline bg-elevated p-5 sm:p-7">
      <p className="text-balance font-serif text-xl leading-snug text-ink sm:text-2xl">{question}</p>

      <div
        className={`mt-5 grid gap-2.5 ${options.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
      >
        {options.map((o, i) => {
          const right = done && i === answer;
          const wrong = done && i === picked && i !== answer;
          return (
            <button
              key={o}
              type="button"
              disabled={done}
              onClick={() => setPicked(i)}
              className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base font-semibold transition ${
                right
                  ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-ink"
                  : wrong
                    ? "border-red-400/60 bg-red-500/10 text-ink-2 line-through decoration-red-400/70"
                    : done
                      ? "border-hairline text-ink-3 opacity-60"
                      : "border-hairline text-ink hover:border-[color-mix(in_srgb,var(--accent)_60%,transparent)] hover:bg-surface"
              }`}
            >
              {letters && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
              )}
              <span className="flex-1">{o}</span>
              {right && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent-ink" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {done && (
          <div className="mt-5 animate-fade-up">
            <p className="text-sm font-semibold text-accent-ink">
              {picked === answer ? "That’s right" : "Not quite"} — the answer is{" "}
              {options[answer].toLowerCase()}.
            </p>
            {children && <div className="mt-4">{children}</div>}
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-4 text-xs font-semibold text-ink-3 underline-offset-4 transition hover:text-ink hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
