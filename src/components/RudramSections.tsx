"use client";

import { useState } from "react";
import type { ChantSection } from "@/lib/chants";
import AudioPlayer from "@/components/AudioPlayer";
import VersesBlock from "@/components/VersesBlock";
import YouTubeEmbed from "@/components/YouTubeEmbed";

/**
 * Śrī Rudram is recited as two halves — Namakam and Chamakam — each of
 * eleven anuvākas, and each anuvāka has its own recording and tutorial
 * video. Students work through one anuvāka at a time, so the page shows
 * exactly one at a time rather than a single unbroken wall of text.
 */
export default function RudramSections({
  sections,
  thumbnail,
}: {
  sections: ChantSection[];
  thumbnail: string | null;
}) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [anuvakaIdx, setAnuvakaIdx] = useState(0);

  const section = sections[Math.min(sectionIdx, sections.length - 1)];
  const anuvaka = section.anuvakas[Math.min(anuvakaIdx, section.anuvakas.length - 1)];

  function pickSection(i: number) {
    setSectionIdx(i);
    setAnuvakaIdx(0);
  }

  return (
    <div className="space-y-5">
      {/* Namakam / Chamakam */}
      <div
        className="flex gap-1.5 rounded-full border border-hairline p-1.5"
        role="tablist"
        aria-label="Section"
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === sectionIdx}
            onClick={() => pickSection(i)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              i === sectionIdx
                ? "bg-[var(--accent)] text-[#08111a]"
                : "text-ink-2 hover:bg-surface-hi hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Anuvāka 1-11 */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="eyebrow">Anuvāka</span>
          <span className="text-xs text-ink-3">{anuvaka.label}</span>
        </div>
        <div
          className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Anuvāka"
        >
          {section.anuvakas.map((a, i) => {
            const empty = a.verses.length === 0;
            return (
              <button
                key={a.n}
                role="tab"
                aria-selected={i === anuvakaIdx}
                onClick={() => setAnuvakaIdx(i)}
                title={empty ? `${a.label} — text still being added` : a.label}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition ${
                  i === anuvakaIdx
                    ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                    : empty
                      ? "border-dashed border-hairline text-ink-3/60 hover:text-ink-2"
                      : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
                }`}
              >
                {a.n}
              </button>
            );
          })}
        </div>
      </div>

      {section.note && <p className="text-xs leading-relaxed text-ink-3">{section.note}</p>}

      {/* The selected anuvāka */}
      {anuvaka.verses.length > 0 ? (
        <VersesBlock key={`${section.id}-${anuvaka.n}`} verses={anuvaka.verses} />
      ) : (
        <div className="rounded-2xl border border-dashed border-hairline px-5 py-8 text-center text-sm text-ink-3">
          The text of {anuvaka.label} is still being added.
        </div>
      )}

      <AudioPlayer
        key={`audio-${section.id}-${anuvaka.n}`}
        normalSrc={anuvaka.audio?.normal ?? ""}
        slowSrc={anuvaka.audio?.slow}
        source={anuvaka.audio?.source}
      />

      <YouTubeEmbed
        key={`video-${section.id}-${anuvaka.n}`}
        videos={anuvaka.videoId ? [{ id: anuvaka.videoId, label: anuvaka.label }] : []}
        thumbnail={thumbnail}
      />
    </div>
  );
}
