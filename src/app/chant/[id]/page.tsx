import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chants, getChantById } from "@/lib/chants";
import { getChantTheme } from "@/lib/chantTheme";
import AudioPlayer from "@/components/AudioPlayer";
import ChantHero from "@/components/ChantHero";
import FontSizeControl from "@/components/FontSizeControl";
import { ScriptToggleProvider } from "@/components/ScriptToggleContext";
import RudramSections from "@/components/RudramSections";
import SarvadharmaPanel from "@/components/SarvadharmaPanel";
import ScriptToggleButton from "@/components/ScriptToggleButton";
import TraditionSymbol from "@/components/TraditionSymbol";
import VersesBlock from "@/components/VersesBlock";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { rich, prose } from "@/lib/richText";

export function generateStaticParams() {
  return chants.map((chant) => ({ id: chant.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chant = getChantById(id);
  if (!chant) return {};
  // Not every chant carries an English subtitle; fall back to the IAST name
  // so the tab title and any shared link still read properly.
  const subtitle = chant.title.english || chant.title.iast;
  return {
    title: subtitle,
    description: chant.overview.slice(0, 155),
    openGraph: {
      title:
        chant.title.english
          ? `${chant.title.iast} — ${chant.title.english}`
          : chant.title.iast,
      description: chant.overview.slice(0, 155),
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="eyebrow mb-3 flex items-center gap-2.5">
      <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
      {children}
    </h2>
  );
}

export default async function ChantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chant = getChantById(id);
  if (!chant) notFound();

  const { accent, thumbnail } = getChantTheme(chant.id);

  return (
    <ScriptToggleProvider>
      <div style={{ "--accent": accent } as React.CSSProperties}>
        <ChantHero chant={chant} />

        {/* Reading controls, pinned under the header */}
        <div className="sticky top-16 z-30 border-b border-hairline bg-[rgb(var(--scrim)/0.85)] backdrop-blur-xl">
          <div className="hide-scrollbar mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            {/* The toggle only makes sense where the Devanagari has actually
                been transcribed; some chants are IAST-only for now. */}
            {chant.sections?.length || chant.verses.some((v) => v.devanagari) ? (
              <ScriptToggleButton />
            ) : (
              <span className="whitespace-nowrap text-xs text-ink-3">
                Sanskrit script for this chant is still being added
              </span>
            )}
            <FontSizeControl />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
            {/* Left: the chant itself */}
            <div className="min-w-0 space-y-6">
              {chant.sections?.length ? (
                <RudramSections sections={chant.sections} thumbnail={thumbnail} />
              ) : (
                <>
                  <VersesBlock verses={chant.verses} />
                  <AudioPlayer
                    normalSrc={chant.audio.normal}
                    slowSrc={chant.audio.slow}
                    source={chant.audio.source}
                  />
                  <YouTubeEmbed
                    videos={
                      chant.videos?.length
                        ? chant.videos
                        : chant.youtubeId
                          ? [{ id: chant.youtubeId }]
                          : []
                    }
                    thumbnail={thumbnail}
                  />
                </>
              )}
              {chant.sarvadharma && <SarvadharmaPanel data={chant.sarvadharma} />}
            </div>

            {/* Right: what it means */}
            <div className="scalable-text min-w-0 space-y-9">
              <section>
                <SectionHeading>Overview of the meaning</SectionHeading>
                <div className="space-y-3">{prose(chant.overview, "leading-relaxed text-ink-2")}</div>
                {chant.structure && (
                  <p className="mt-3 leading-relaxed text-ink-2">{rich(chant.structure)}</p>
                )}
                {chant.teachingNote && (
                  <p className="mt-4 rounded-xl border border-hairline bg-surface p-4 text-sm leading-relaxed text-ink-2">
                    {rich(chant.teachingNote)}
                  </p>
                )}
              </section>

              <section>
                <SectionHeading>Word by word</SectionHeading>
                <dl className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
                  {chant.wordMeanings.map((wm, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-baseline gap-x-2 px-4 py-2.5 transition-colors hover:bg-surface"
                    >
                      <dt className="font-serif text-base font-semibold text-ink">
                        {wm.word}
                      </dt>
                      <dd className="text-sm text-ink-2">{rich(wm.meaning)}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="relative overflow-hidden rounded-2xl border border-hairline p-5">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(100%_100%_at_0%_0%,color-mix(in_srgb,var(--accent)_14%,transparent)_0%,transparent_70%)]"
                />
                <div className="relative">
                  <SectionHeading>A reflection for today</SectionHeading>
                  <div className="space-y-3">
                    {prose(chant.universalReflection, "text-pretty leading-relaxed text-ink")}
                  </div>
                </div>
              </section>

              {chant.quotes && chant.quotes.length > 0 && (
                <section className="space-y-4">
                  {chant.quotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="border-l-2 border-accent-ink pl-4 font-serif text-lg italic leading-relaxed text-ink-2"
                    >
                      “{rich(q.text)}”
                      <footer className="mt-2 font-sans text-xs not-italic text-ink-3">
                        — {q.attribution}
                      </footer>
                    </blockquote>
                  ))}
                </section>
              )}

              {chant.figureParallel && (
                <section>
                  <SectionHeading>{chant.figureParallel.heading}</SectionHeading>

                  <div className="mb-4 flex items-center gap-2 text-accent-ink">
                    <TraditionSymbol
                      tradition={chant.figureParallel.tradition}
                      className="h-[18px] w-[18px] shrink-0"
                    />
                    <p className="text-xs font-semibold uppercase tracking-wider">
                      {chant.figureParallel.figure}
                    </p>
                  </div>

                  {chant.figureParallel.intro && (
                    <div className="mb-5 space-y-3">
                      {prose(chant.figureParallel.intro, "leading-relaxed text-ink-2")}
                    </div>
                  )}

                  <ol className="space-y-3">
                    {chant.figureParallel.items.map((it, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-hairline p-4 transition-colors hover:bg-surface"
                      >
                        <div className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden
                            className="font-serif text-sm text-[var(--accent)]"
                          >
                            {i + 1}
                          </span>
                          <h3 className="font-serif text-lg leading-snug text-ink">
                            {it.title}
                          </h3>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                          {rich(it.text)}
                        </p>
                      </li>
                    ))}
                  </ol>

                  {chant.figureParallel.source && (
                    <p className="mt-3 text-xs text-ink-3">{chant.figureParallel.source}</p>
                  )}
                </section>
              )}

              {chant.parallels && chant.parallels.length > 0 && (
                <section>
                  <SectionHeading>Parallels in other traditions</SectionHeading>
                  <div className="space-y-3">
                    {chant.parallels.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-hairline p-4 transition-colors hover:bg-surface"
                      >
                        <div className="flex items-center gap-2 text-accent-ink">
                          <TraditionSymbol
                            tradition={p.tradition}
                            className="h-[18px] w-[18px] shrink-0"
                          />
                          <p className="text-xs font-semibold uppercase tracking-wider">
                            {p.tradition}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">{rich(p.text)}</p>
                        <p className="mt-2 text-xs text-ink-3">{p.source}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <p className="border-t border-hairline pt-5 text-xs text-ink-3">
                Transcribed from {chant.booklet}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScriptToggleProvider>
  );
}
