"use client";

import { useEffect, useState } from "react";
import type { Verse } from "@/lib/chants";
import { useScriptToggle } from "@/components/ScriptToggleContext";
import { useVerseAudio } from "@/components/VerseAudioContext";
import TimingCapture from "@/components/TimingCapture";
import { rich } from "@/lib/richText";

export default function VersesBlock({ verses }: { verses: Verse[] }) {
  const { showDevanagari } = useScriptToggle();
  const [open, setOpen] = useState<number | null>(null);
  const audio = useVerseAudio();

  // A content tool, not part of the student view. Read after mount so the
  // server and client render the same thing.
  const [capture, setCapture] = useState(false);
  useEffect(() => {
    setCapture(new URLSearchParams(window.location.search).get("timings") === "1");
  }, []);

  // Only offer the expand affordance where there is stanza-level content.
  const hasDetail = verses.some((v) => v.meaning || v.words?.length);

  // A line can be played on its own once its place in the recording is known.
  const timed = Boolean(audio?.hasAudio) && verses.some((v) => v.start !== undefined);
  // A line runs until the next timed line begins.
  const endOf = (i: number) => {
    for (let j = i + 1; j < verses.length; j++) {
      if (verses[j].start !== undefined) return verses[j].start;
    }
    return undefined;
  };
  const sounding = (() => {
    if (!timed || !audio?.isPlaying) return null;
    let found: number | null = null;
    for (let i = 0; i < verses.length; i++) {
      const st = verses[i].start;
      if (st !== undefined && audio.currentTime >= st - 0.15) found = i;
    }
    return found;
  })();

  return (
    <>
    <div className="glass overflow-hidden rounded-2xl">
      {hasDetail && (
        <p className="border-b border-hairline px-5 py-2.5 text-xs text-ink-3 sm:px-7">
          Tap any stanza for its meaning and word-by-word.
        </p>
      )}

      {verses.map((verse, i) => {
        const detail = verse.meaning || verse.words?.length ? verse : null;
        const isOpen = open === i;
        const isSounding = sounding === i;
        const canPlay = timed && verse.start !== undefined;

        const body = (
          <>
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)] transition-transform duration-300 ease-smooth ${
                isOpen || isSounding ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
              }`}
            />
            {/* An empty number is deliberate: a heading line such as
                "atha medhāsūktaṁ" is not a numbered verse. */}
            {verse.number !== "" && (
              <span
                aria-hidden
                className="absolute right-4 top-4 text-xs font-semibold tabular-nums text-ink-3/50"
              >
                {verse.number ?? String(i + 1).padStart(2, "0")}
              </span>
            )}

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

        const playButton = canPlay ? (
          <button
            type="button"
            onClick={() => {
              if (isSounding) audio!.stop();
              else audio!.playRange(verse.start!, endOf(i));
            }}
            aria-label={
              isSounding ? "Stop this line" : `Play line ${verse.number || i + 1}`
            }
            title={isSounding ? "Stop" : "Play this line"}
            className={`absolute left-1.5 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition sm:left-2.5 ${
              isSounding
                ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                : "border-hairline text-ink-3 opacity-0 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:text-accent-ink focus-visible:opacity-100 group-hover:opacity-100"
            }`}
          >
            {isSounding ? (
              <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <rect x="2.5" y="2" width="4" height="12" rx="1" />
                <rect x="9.5" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M3.5 1.8v12.4L14 8z" />
              </svg>
            )}
          </button>
        ) : null;

        // The play control cannot nest inside the expand button, so the row is
        // a positioned wrapper with the two siblings laid over each other.
        return (
          <div
            key={i}
            className={`group relative border-b border-hairline last:border-0 ${
              isSounding ? "bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]" : ""
            }`}
          >
            {playButton}
            {detail ? (
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`relative block w-full py-5 text-left transition-colors hover:bg-surface sm:py-6 ${
                  canPlay ? "pl-10 pr-5 sm:pl-12 sm:pr-7" : "px-5 sm:px-7"
                }`}
              >
                {body}
              </button>
            ) : (
              <div
                className={`relative py-5 transition-colors hover:bg-surface sm:py-6 ${
                  canPlay ? "pl-10 pr-5 sm:pl-12 sm:pr-7" : "px-5 sm:px-7"
                }`}
              >
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
    {capture && <TimingCapture verses={verses} />}
    </>
  );
}
