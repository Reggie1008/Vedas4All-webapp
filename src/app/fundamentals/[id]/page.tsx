import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, getModuleById, FUNDAMENTALS_ACCENT } from "@/lib/fundamentals";
import ArticulationChart from "@/components/ArticulationChart";
import FontSizeControl from "@/components/FontSizeControl";
import { rich } from "@/lib/richText";

export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const m = getModuleById(id);
  if (!m) return {};
  return {
    title: m.title,
    description: m.summary,
    openGraph: {
      title: `${m.title} — ${m.subtitle ?? "Fundamentals"}`,
      description: m.summary,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2.5 font-serif text-2xl text-ink">
      <span aria-hidden className="h-px w-6 shrink-0 bg-[var(--accent)]" />
      {children}
    </h2>
  );
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = getModuleById(id);
  if (!m) notFound();

  return (
    <div style={{ "--accent": FUNDAMENTALS_ACCENT } as React.CSSProperties}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent)_28%,transparent)_0%,color-mix(in_srgb,var(--accent)_9%,transparent)_45%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6">
          <Link
            href="/?view=fundamentals"
            className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            All fundamentals
          </Link>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="eyebrow">{m.module}</span>
              <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                {m.title}
              </h1>
              {m.subtitle && <p className="mt-1.5 text-base text-ink-2">{m.subtitle}</p>}
            </div>
            <FontSizeControl />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
        {m.quote && (
          <blockquote className="border-l-2 border-accent-ink pl-4 font-serif text-xl italic leading-relaxed text-ink">
            “{m.quote.text}”
            <footer className="mt-2 font-sans text-xs not-italic text-ink-3">
              — {m.quote.attribution}
            </footer>
          </blockquote>
        )}

        {m.blocks.map((b, i) => (
          <section key={i} className="scalable-text">
            <Heading>{b.heading}</Heading>

            {"intro" in b && b.intro && (
              <p className="mb-5 leading-relaxed text-ink-2">{rich(b.intro)}</p>
            )}

            {b.type === "levels" && (
              <ol className="space-y-2">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="flex flex-wrap items-baseline gap-x-3 rounded-xl border border-hairline px-4 py-3"
                  >
                    <span className="font-serif text-lg text-ink">{it.sanskrit}</span>
                    <span className="text-sm text-ink-2">{it.english}</span>
                    <span className="ml-auto text-xs text-ink-3">{it.seat}</span>
                  </li>
                ))}
              </ol>
            )}

            {b.type === "verse" && (
              <>
                <p className="iast-text-primary rounded-2xl border border-hairline p-5 text-ink">
                  {b.iast}
                </p>
                <dl className="mt-4 space-y-1.5">
                  {b.notes.map((n, j) => (
                    <div key={j} className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="font-serif text-base font-semibold text-ink">{n.term}</dt>
                      <dd className="text-sm text-ink-2">{n.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {b.type === "articulation" && (
              <>
                <ArticulationChart places={b.places} />
                {b.footnotes && (
                  <ul className="mt-4 space-y-1.5">
                    {b.footnotes.map((f, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink-3">
                        <span aria-hidden className="text-[var(--accent)]">
                          ·
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {b.type === "aspirated" && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {b.pairs.map((p, j) => (
                  <div
                    key={j}
                    className="flex items-baseline gap-3 rounded-xl border border-hairline px-4 py-3 transition-colors hover:bg-surface"
                  >
                    <span className="font-serif text-xl text-[var(--accent)]">{p.sound}</span>
                    <span className="font-serif text-base text-ink-2">{p.example}</span>
                  </div>
                ))}
              </div>
            )}

            {b.type === "practice" && (
              <div className="flex flex-wrap gap-2">
                {b.words.map((w, j) => (
                  <span
                    key={j}
                    className="inline-flex items-baseline gap-2 rounded-xl border border-hairline px-4 py-2.5"
                  >
                    <span className="font-serif text-lg text-ink">{w.word}</span>
                    <span className="rounded-md bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-1.5 py-0.5 font-serif text-sm text-ink">
                      {w.focus}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {b.type === "next" && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {b.items.map((it, j) => (
                  <div key={j} className="rounded-xl border border-dashed border-hairline px-4 py-4">
                    <span className="font-serif text-2xl text-ink">{it.sound}</span>
                    <p className="mt-1 text-sm font-medium text-ink-2">{it.label}</p>
                    <p className="text-xs text-ink-3">{it.place}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {m.source && (
          <p className="border-t border-hairline pt-5 text-xs text-ink-3">From {m.source}</p>
        )}
      </div>
    </div>
  );
}
