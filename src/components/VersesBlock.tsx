"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SarvadharmaEntry, Verse } from "@/lib/chants";
import TraditionSymbol from "@/components/TraditionSymbol";
import { useScriptToggle } from "@/components/ScriptToggleContext";
import { useVerseAudio } from "@/components/VerseAudioContext";
import TimingCapture from "@/components/TimingCapture";
import { holdingText, rich } from "@/lib/richText";

export default function VersesBlock({
  verses,
  traditions,
}: {
  verses: Verse[];
  /** Faiths to mark on a stanza, keyed by its index. Mantrapuṣpaṃ names a
   *  different faith in almost every stanza, and a student needs to see
   *  which one while chanting it — not in a panel further down the page. */
  traditions?: Record<number, SarvadharmaEntry[]>;
}) {
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
  const hasDetail = verses.some((v) => v.meaning || v.innerMeaning || v.words?.length);
  // The rectangles need saying once, at the foot of the lines they mark.
  const hasHoldings = verses.some((v) => v.holdings);

  // A line can be played on its own once its place in the recording is known.
  const timed = Boolean(audio?.hasAudio) && verses.some((v) => v.start !== undefined);
  // A line stops where it says it does, or failing that where the next
  // one begins — the reciter does not always run them together.
  const endOf = (i: number) => {
    if (verses[i].end !== undefined) return verses[i].end;
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
        const here = traditions?.[i] ?? [];
        const detail =
          verse.meaning || verse.innerMeaning || verse.words?.length || here.length ? verse : null;
        // With an inner reading alongside, the plain translation is named as the literal one.
        const twoReadings = Boolean(verse.innerMeaning);
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

            {here.length > 0 && (
              <span className="mb-2.5 flex flex-wrap gap-1.5 pr-8">
                {here.map((e, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-1 text-accent-ink"
                  >
                    <TraditionSymbol
                      tradition={e.tradition}
                      className="h-[15px] w-[15px] shrink-0"
                    />
                    <span className="text-[0.7rem] font-semibold uppercase tracking-wider">
                      {e.tradition}
                    </span>
                  </span>
                ))}
              </span>
            )}

            {showDevanagari && verse.devanagari && (
              <p className="devanagari-text pr-8">{verse.devanagari}</p>
            )}
            {/* A line whose transliteration has not been transcribed yet
                stands on its Devanagari rather than leaving a blank. */}
            {!verse.iast && verse.devanagari ? (
              !showDevanagari && <p className="devanagari-text pr-8">{verse.devanagari}</p>
            ) : (
              <p className={`pr-8 ${showDevanagari ? "iast-text" : "iast-text-primary"}`}>
                {verse.holdings ? holdingText(verse.holdings, verse.iast) : verse.iast}
              </p>
            )}
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
            className={`absolute left-1.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition sm:left-3 ${
              isSounding
                ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                : "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-accent-ink hover:border-[color-mix(in_srgb,var(--accent)_75%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
            }`}
          >
            {isSounding ? (
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <rect x="2.5" y="2" width="4" height="12" rx="1" />
                <rect x="9.5" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
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
                  canPlay ? "pl-12 pr-5 sm:pl-14 sm:pr-7" : "px-5 sm:px-7"
                }`}
              >
                {body}
              </button>
            ) : (
              <div
                className={`relative py-5 transition-colors hover:bg-surface sm:py-6 ${
                  canPlay ? "pl-12 pr-5 sm:pl-14 sm:pr-7" : "px-5 sm:px-7"
                }`}
              >
                {body}
              </div>
            )}

            {detail && isOpen && (
              <div className="animate-fade-up border-t border-hairline bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] px-5 py-5 sm:px-7">
                {verse.theme && (
                  <p className="mb-3 font-serif text-lg leading-snug text-ink">{rich(verse.theme)}</p>
                )}
                {verse.meaning && (
                  <div>
                    {twoReadings && <h3 className="eyebrow mb-1.5">Literal meaning</h3>}
                    <Paragraphs text={verse.meaning} />
                  </div>
                )}
                {here.map((e, j) => (
                  <div key={j} className="mt-4 border-t border-hairline pt-4 first:mt-0 first:border-0 first:pt-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-2 text-accent-ink">
                        <TraditionSymbol
                          tradition={e.tradition}
                          className="h-[18px] w-[18px] shrink-0"
                        />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">
                          {e.tradition}
                        </h3>
                      </span>
                      <span className="rounded-full border border-hairline px-2 py-0.5 text-[0.65rem] font-medium text-ink-3">
                        {e.keyword}
                      </span>
                    </div>
                    <p className="scalable-text mt-2 leading-relaxed text-ink-2">{rich(e.text)}</p>
                    {e.saiQuote && (
                      <blockquote className="mt-3 border-l-2 border-accent-ink pl-3 font-serif italic leading-relaxed text-ink">
                        “{rich(e.saiQuote)}”
                        <footer className="mt-1 font-sans text-xs not-italic text-ink-3">
                          — Sri Sathya Sai Baba
                        </footer>
                      </blockquote>
                    )}
                    {e.chant && (
                      <div className="mt-3 rounded-xl border border-hairline bg-surface p-4">
                        <p className="font-serif text-[0.95rem] leading-relaxed text-ink">
                          {e.chant}
                        </p>
                        {e.chantMeaning && (
                          <p className="mt-2 border-t border-hairline pt-2 text-sm leading-relaxed text-ink-3">
                            {rich(e.chantMeaning)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {verse.words && verse.words.length > 0 && (
                  <dl className={`grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 ${verse.meaning || verse.theme || here.length ? "mt-4" : ""}`}>
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

                {verse.innerMeaning && (
                  <div className={verse.meaning || verse.words?.length ? "mt-5 border-t border-hairline pt-4" : ""}>
                    <h3 className="eyebrow mb-1.5">Inner meaning</h3>
                    <Paragraphs text={verse.innerMeaning} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
    {hasHoldings && (
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-xs text-ink-3">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="holding font-serif text-sm text-ink-2">a</span>
          short holding
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="holding holding-long font-serif text-sm text-ink-2">a</span>
          long holding
        </span>
        <Link
          href="/fundamentals/pauses-holdings"
          className="underline underline-offset-2 transition-colors hover:text-ink-2"
        >
          What these mean
        </Link>
      </p>
    )}
    {capture && <TimingCapture verses={verses} />}
    </>
  );
}

/** Prose fields may hold several paragraphs, separated by blank lines. */
function Paragraphs({ text }: { text: string }) {
  return (
    <div className="scalable-text space-y-2.5 leading-relaxed text-ink-2">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{rich(para)}</p>
      ))}
    </div>
  );
}
