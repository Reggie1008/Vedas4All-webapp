import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, getModuleById, FUNDAMENTALS_ACCENT } from "@/lib/fundamentals";
import ArticulationChart from "@/components/ArticulationChart";
import SandhiChart from "@/components/SandhiChart";
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

function Footnotes({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="mt-4 space-y-1.5">
      {items.map((f, j) => (
        <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink-3">
          <span aria-hidden className="text-[var(--accent)]">
            ·
          </span>
          {rich(f)}
        </li>
      ))}
    </ul>
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
                <Footnotes items={b.footnotes} />
              </>
            )}

            {b.type === "sandhi" && (
              <>
                <SandhiChart groups={b.groups} />
                <Footnotes items={b.footnotes} />
              </>
            )}

            {b.type === "rule" && (
              <>
                {b.transforms && (
                  <div className="space-y-2">
                    {b.transforms.map((t, j) => (
                      <div
                        key={j}
                        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-4 py-3"
                      >
                        <span className="iast-text font-serif text-lg text-ink-2 line-through decoration-ink-3/40">
                          {t.from}
                        </span>
                        <span aria-hidden className="text-[var(--accent)]">
                          →
                        </span>
                        <span className="iast-text font-serif text-lg font-semibold text-ink">
                          {t.to}
                        </span>
                        {t.note && <span className="text-xs text-ink-3">{t.note}</span>}
                      </div>
                    ))}
                  </div>
                )}
                {b.examples && (
                  <ul className={`space-y-1.5 ${b.transforms ? "mt-4" : ""}`}>
                    {b.examples.map((ex, j) => (
                      <li
                        key={j}
                        className="flex flex-wrap items-baseline gap-x-3 rounded-xl border border-hairline px-4 py-2.5"
                      >
                        <span className="iast-text font-serif text-lg text-ink">{ex.text}</span>
                        {ex.note && <span className="text-xs text-ink-3">{ex.note}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                <Footnotes items={b.footnotes} />
              </>
            )}

            {b.type === "points" && (
              <>
                {b.forms && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {b.forms.map((f, j) => (
                      <span
                        key={j}
                        className="inline-flex flex-col items-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-5 py-3"
                      >
                        <span className="font-serif text-2xl leading-none text-ink">{f.glyph}</span>
                        <span className="mt-1.5 text-[0.65rem] text-ink-3">{f.label}</span>
                      </span>
                    ))}
                  </div>
                )}
                <ul className="space-y-1.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-2.5 leading-relaxed text-ink-2">
                      <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{rich(it)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {b.type === "guides" && (
              <>
                <ol className="space-y-2.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="rounded-xl border border-hairline px-4 py-3">
                      <p className="font-medium text-ink">{rich(it.label)}</p>
                      {it.text && (
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">{rich(it.text)}</p>
                      )}
                      {it.examples && (
                        <ul className="mt-2.5 space-y-1">
                          {it.examples.map((ex, k) => (
                            <li
                              key={k}
                              className="iast-text border-l-2 border-[color-mix(in_srgb,var(--accent)_45%,transparent)] pl-3 font-serif text-base text-ink-2"
                            >
                              {ex}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
                <Footnotes items={b.footnotes} />
              </>
            )}

            {b.type === "figures" && (
              <>
                <div className="space-y-3">
                  {b.items.map((it, j) => (
                    <figure key={j}>
                      {/* These marks have no character in the bundled fonts, so
                          they come across from the deck as pictures. The light
                          panel keeps the black lettering legible in both themes. */}
                      <div className="overflow-x-auto rounded-xl border border-hairline bg-white p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.src}
                          alt={it.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full min-w-[520px]"
                        />
                      </div>
                      {it.caption && (
                        <figcaption className="mt-1.5 text-xs text-ink-3">{it.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
                <Footnotes items={b.footnotes} />
              </>
            )}

            {b.type === "recap" && (
              <div className="flex flex-wrap gap-2">
                {b.stats.map((s, j) => (
                  <div
                    key={j}
                    className="flex-1 basis-32 rounded-xl border border-hairline px-4 py-3"
                  >
                    <span className="font-serif text-2xl text-[var(--accent)]">{s.value}</span>
                    <p className="mt-0.5 text-xs text-ink-3">{s.label}</p>
                  </div>
                ))}
              </div>
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
