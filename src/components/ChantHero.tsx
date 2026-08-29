import Link from "next/link";
import type { Chant } from "@/lib/chants";
import { getChantTheme } from "@/lib/chantTheme";
import { rich } from "@/lib/richText";

export default function ChantHero({ chant }: { chant: Chant }) {
  const { thumbnail } = getChantTheme(chant.id);

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      {/* A flat wash of the chant's accent rather than the artwork itself —
          the thumbnails carry their own "Learn to Chant" lettering, which
          reads through even a heavy blur and fights the real heading. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent)_30%,transparent)_0%,color-mix(in_srgb,var(--accent)_10%,transparent)_45%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-7 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          All chants
        </Link>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="script-accent block">Learn to chant</span>
            <h1 className="mt-0.5 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              {chant.title.iast}
            </h1>
            <p className="mt-1.5 text-base text-ink-2">{chant.title.english}</p>
            {chant.note && (
              <p className="mt-3 max-w-xl border-l-2 border-accent-ink pl-3 text-sm italic leading-relaxed text-ink-3">
                {rich(chant.note)}
              </p>
            )}
          </div>

          {thumbnail && (
            <div className="w-40 shrink-0 overflow-hidden rounded-xl border border-hairline-hi shadow-xl sm:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/thumbnails/${thumbnail}-sm.webp`}
                alt={`Artwork for ${chant.title.iast}`}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
