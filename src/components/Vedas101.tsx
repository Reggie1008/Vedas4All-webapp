import Link from "next/link";
import { course, parts, VEDAS101_ACCENT } from "@/lib/vedas101";

/**
 * The Vedas 101 side of the portal: the beginners' first class, as eight
 * parts a student can work through in order or dip into.
 */
export default function Vedas101() {
  return (
    <div style={{ "--accent": VEDAS101_ACCENT } as React.CSSProperties}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <p className="max-w-2xl text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
          {course.intro}
        </p>
        <Link
          href={`/vedas-101/${parts[0].id}`}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition hover:opacity-90"
        >
          Start at Part 1
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {parts.map((p, i) => (
          <li key={p.id}>
            <Link
              href={`/vedas-101/${p.id}`}
              style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
              className="group relative flex h-full animate-fade-up flex-col overflow-hidden rounded-3xl border border-hairline bg-elevated p-5 transition duration-500 ease-smooth hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:shadow-[0_18px_50px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
            >
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_srgb,var(--accent)_14%,transparent)_0%,transparent_60%)]" />
              <span className="relative font-serif text-4xl leading-none text-[color-mix(in_srgb,var(--accent)_70%,transparent)]">
                {i + 1}
              </span>
              <h3 className="relative mt-3 font-serif text-xl leading-tight text-ink">{p.title}</h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-2">{p.summary}</p>
              <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
                Open
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 ease-smooth group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
