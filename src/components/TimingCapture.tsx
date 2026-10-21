"use client";

import { useCallback, useEffect, useState } from "react";
import type { Verse } from "@/lib/chants";
import { useVerseAudio } from "@/components/VerseAudioContext";

/**
 * Produces the per-line timings that the play buttons need.
 *
 * There is no way to derive where each line falls in a recording, and
 * typing hundreds of timestamps by hand is not realistic. So instead:
 * play the chant once and tap at the start of each line. The result is a
 * plain array of seconds, ready to be written into chants.json.
 *
 * Reached only via ?timings=1 — it is a tool for preparing content, not
 * part of what a student sees.
 */
export default function TimingCapture({ verses }: { verses: Verse[] }) {
  const audio = useVerseAudio();
  const [marks, setMarks] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const next = marks.length;
  const done = next >= verses.length;

  const mark = useCallback(() => {
    if (!audio || done) return;
    setMarks((m) => [...m, Math.round(audio.now() * 100) / 100]);
  }, [audio, done]);

  const undo = useCallback(() => setMarks((m) => m.slice(0, -1)), []);

  // The panel carries its own transport so everything needed is in one place.
  const toggle = useCallback(() => {
    if (!audio) return;
    if (audio.isPlaying) audio.stop();
    else void audio.playRange(audio.now());
  }, [audio]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        mark();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mark, undo]);

  if (!audio?.hasAudio) return null;

  const output = `[${marks.join(", ")}]`;

  return (
    <section className="sticky bottom-3 z-40 mt-6 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--accent)_55%,transparent)] bg-[rgb(var(--scrim)/0.92)] p-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="eyebrow">Timing capture</h2>
        <span className="text-xs tabular-nums text-ink-3">
          {Math.floor(audio.currentTime / 60)}:
          {Math.floor(audio.currentTime % 60).toString().padStart(2, "0")}
          {"  ·  "}
          {marks.length} / {verses.length} lines
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        Press play here. The moment you <strong className="text-ink">hear a line
        begin</strong>, mark it — not when it ends.{" "}
        <kbd className="rounded border border-hairline px-1 text-xs">Enter</kbd> marks,{" "}
        <kbd className="rounded border border-hairline px-1 text-xs">Backspace</kbd> undoes
        the last one.
      </p>

      <div className="mt-4 rounded-xl border border-hairline p-4">
        <p className="eyebrow mb-1">
          {done ? "All lines marked" : `Listen for the start of line ${next + 1}`}
        </p>
        <p className="iast-text font-serif text-lg text-ink">
          {done ? "Copy the array below and send it over." : verses[next]?.iast.slice(0, 120)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline text-ink transition hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]"
          aria-label={audio.isPlaying ? "Pause" : "Play"}
        >
          {audio.isPlaying ? (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="2.5" y="2" width="4" height="12" rx="1" />
              <rect x="9.5" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M3.5 1.8v12.4L14 8z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={mark}
          disabled={done}
          className="rounded-full bg-[var(--accent)] px-7 py-3 text-base font-semibold text-[#08111a] transition disabled:opacity-40"
        >
          Mark start of line {Math.min(next + 1, verses.length)}
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={!marks.length}
          className="rounded-full border border-hairline px-4 py-2.5 text-sm font-semibold text-ink-2 transition hover:text-ink disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => setMarks([])}
          disabled={!marks.length}
          className="rounded-full border border-hairline px-4 py-2.5 text-sm font-semibold text-ink-3 transition hover:text-ink disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {marks.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Result</p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="text-xs font-semibold text-accent-ink"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-hairline bg-surface p-3 font-mono text-xs text-ink-2"
          />
        </div>
      )}
    </section>
  );
}
