import Link from "next/link";
import type { Chant } from "@/lib/chants";
import { getChantTheme } from "@/lib/chantTheme";

export default function ChantCard({ chant, index }: { chant: Chant; index: number }) {
  const { thumbnail, accent } = getChantTheme(chant.id);

  return (
    <Link
      href={`/chant/${chant.id}`}
      style={{ "--accent": accent, animationDelay: `${index * 60}ms` } as React.CSSProperties}
      className="group relative animate-fade-up overflow-hidden rounded-3xl border border-hairline bg-elevated transition duration-500 ease-smooth hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:shadow-[0_18px_50px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
    >
      {/* Artwork */}
      <div className="relative aspect-video overflow-hidden bg-[color-mix(in_srgb,var(--accent)_12%,var(--elevated))]">
        {thumbnail ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/thumbnails/${thumbnail}.webp`}
              srcSet={`/thumbnails/${thumbnail}-sm.webp 640w, /thumbnails/${thumbnail}.webp 1280w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              alt=""
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--scrim)/0.92)] via-[rgb(var(--scrim)/0.25)] to-transparent" />
          </>
        ) : (
          <PlaceholderArt />
        )}

      </div>

      {/* Caption — no "Learn to chant" here; the artwork already says it. */}
      <div className="relative px-5 pb-5 pt-4">
        <h2 className="font-serif text-2xl leading-tight text-ink">
          {chant.title.iast}
        </h2>
        {chant.title.english && (
          <p className="mt-1 text-sm text-ink-3">{chant.title.english}</p>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
          Open chant
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 ease-smooth group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** Used where a chant has no video artwork yet. */
function PlaceholderArt() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_0%,color-mix(in_srgb,var(--accent)_38%,transparent)_0%,transparent_62%)]" />
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
      >
        {[16, 26, 36, 46].map((r) => (
          <circle key={r} cx="100" cy="60" r={r} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 16}
              y1={60 + Math.sin(a) * 16}
              x2={100 + Math.cos(a) * 46}
              y2={60 + Math.sin(a) * 46}
            />
          );
        })}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-devanagari text-5xl text-[var(--accent)] opacity-80">
        ॐ
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--scrim)/0.9)] to-transparent" />
    </div>
  );
}
