"use client";

import { useState } from "react";
import type { ChantSection } from "@/lib/chants";
import AudioPlayer from "@/components/AudioPlayer";
import VersesBlock from "@/components/VersesBlock";
import { VerseAudioProvider } from "@/components/VerseAudioContext";
import YouTubeEmbed from "@/components/YouTubeEmbed";

/**
 * A chant too long to meet all at once: Śrī Rudram's two halves of eleven
 * anuvākas each, Lalitā Sahasranāma's dhyāna, names and close. Every part
 * carries its own recording and, where there is one, its own tutorial
 * video. Students work through one part at a time, so the page shows
 * exactly one rather than a single unbroken wall of text.
 */
export default function SectionedChant({
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

      {/* The parts within the section — Rudram's eleven anuvākas, Lalitā's
          nineteen groups of ten names. A section holding a single part
          needs no chooser, so it shows only the part's name. */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="eyebrow">{section.unit ?? "Anuvāka"}</span>
          <span className="text-xs text-ink-3">{anuvaka.label}</span>
        </div>
        <div
          className={`hide-scrollbar flex gap-1.5 overflow-x-auto pb-1 ${
            section.anuvakas.length > 1 ? "" : "hidden"
          }`}
          role="tablist"
          aria-label={section.unit ?? "Anuvāka"}
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

      {(anuvaka.theme || anuvaka.intro) && (
        <AnuvakaIntro key={`intro-${section.id}-${anuvaka.n}`} theme={anuvaka.theme} intro={anuvaka.intro} />
      )}

      {/* The selected anuvāka. Each one is its own recording, so the
          provider is keyed to it and resets when the pills change. */}
      <VerseAudioProvider key={`audio-ctx-${section.id}-${anuvaka.n}`}>
        {anuvaka.verses.length > 0 ? (
          <VersesBlock key={`${section.id}-${anuvaka.n}`} verses={anuvaka.verses} />
        ) : (
          <div className="rounded-2xl border border-dashed border-hairline px-5 py-8 text-center text-sm text-ink-3">
            The text of {anuvaka.label} is still being added.
          </div>
        )}

        <div className="mt-6">
          <AudioPlayer
            key={`audio-${section.id}-${anuvaka.n}`}
            normalSrc={anuvaka.audio?.normal ?? ""}
            slowSrc={anuvaka.audio?.slow}
            source={anuvaka.audio?.source}
          />
        </div>
      </VerseAudioProvider>

      {anuvaka.reflections && anuvaka.reflections.length > 0 && (
        <section aria-label="Reflections" className="space-y-3">
          <h3 className="eyebrow">Going deeper</h3>
          {anuvaka.reflections.map((r, i) => (
            <details
              key={`${section.id}-${anuvaka.n}-${i}`}
              className="group rounded-2xl border border-hairline bg-elevated open:bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-serif text-lg leading-snug text-ink [&::-webkit-details-marker]:hidden">
                {r.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-ink transition group-open:rotate-180" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="scalable-text space-y-3 px-5 pb-5 leading-relaxed text-ink-2">
                {paragraphs(r.text).map((p, j) => (
                  <p key={j} className="whitespace-pre-line">{p}</p>
                ))}
              </div>
            </details>
          ))}
        </section>
      )}

      {section.meaningsSource && (anuvaka.theme || anuvaka.verses.some((v) => v.meaning || v.words?.length)) && (
        <p className="text-xs leading-relaxed text-ink-3">Meanings: {section.meaningsSource}</p>
      )}

      <YouTubeEmbed
        key={`video-${section.id}-${anuvaka.n}`}
        videos={anuvaka.videoId ? [{ id: anuvaka.videoId, label: anuvaka.label }] : []}
        thumbnail={thumbnail}
      />
    </div>
  );
}

function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/);
}

/** What the anuvāka is about. Long introductions open on their first
 *  paragraph so the chant text stays close to the top. */
function AnuvakaIntro({ theme, intro }: { theme?: string; intro?: string }) {
  const [first, ...rest] = intro ? paragraphs(intro) : [];
  return (
    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] px-5 py-4">
      {theme && <p className="font-serif text-xl leading-snug text-ink">{theme}</p>}
      {first && <p className={`scalable-text leading-relaxed text-ink-2 ${theme ? "mt-2" : ""}`}>{first}</p>}
      {rest.length > 0 && (
        <details className="group mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-accent-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Read more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="scalable-text mt-2 space-y-2.5 leading-relaxed text-ink-2">
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
