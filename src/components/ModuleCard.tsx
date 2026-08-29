import Link from "next/link";
import type { Module } from "@/lib/fundamentals";
import { FUNDAMENTALS_ACCENT } from "@/lib/fundamentals";

export default function ModuleCard({ module: m, index }: { module: Module; index: number }) {
  return (
    <Link
      href={`/fundamentals/${m.id}`}
      style={
        {
          "--accent": FUNDAMENTALS_ACCENT,
          animationDelay: `${index * 60}ms`,
        } as React.CSSProperties
      }
      className="group relative animate-fade-up overflow-hidden rounded-3xl border border-hairline bg-elevated p-6 transition duration-500 ease-smooth hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:shadow-[0_18px_50px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_60%)]"
      />
      <div className="relative">
        <span className="eyebrow">{m.module}</span>
        <h2 className="mt-1.5 font-serif text-2xl leading-tight text-ink">{m.title}</h2>
        {m.subtitle && <p className="mt-1 text-sm text-ink-3">{m.subtitle}</p>}
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{m.summary}</p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
          Start module
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
