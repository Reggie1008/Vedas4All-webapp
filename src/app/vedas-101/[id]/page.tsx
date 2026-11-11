import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { course, parts, getPart, VEDAS101_ACCENT, type Block, type Quote } from "@/lib/vedas101";
import FontSizeControl from "@/components/FontSizeControl";
import Quiz from "@/components/Quiz";
import SyllableCount from "@/components/SyllableCount";
import TraditionSymbol from "@/components/TraditionSymbol";
import { rich } from "@/lib/richText";

export function generateStaticParams() {
  return parts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const found = getPart(id);
  if (!found) return {};
  const { part, index } = found;
  return {
    title: `${part.title} — Vedas 101`,
    description: part.summary,
    openGraph: {
      title: `Vedas 101 · Part ${index + 1}: ${part.title}`,
      description: part.summary,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

const FAITHS = ["Hinduism", "Buddhism", "Judaism", "Christianity", "Islam", "Sikhism", "Zoroastrianism"];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 font-serif text-2xl text-ink">
      <span aria-hidden className="h-px w-6 shrink-0 bg-[var(--accent)]" />
      {children}
    </h2>
  );
}

function QuoteBlock({ q, large = false }: { q: Quote; large?: boolean }) {
  return (
    <blockquote
      className={`border-l-2 border-[var(--accent)] pl-5 font-serif italic leading-relaxed text-ink ${
        large ? "text-xl sm:text-2xl" : "text-lg"
      }`}
    >
      “{rich(q.text)}”
      <footer className="mt-3 font-sans text-xs not-italic text-ink-3">— {q.attribution}</footer>
    </blockquote>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] px-4 py-2 text-sm font-semibold text-accent-ink transition hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) =>
        p.startsWith("## ") ? (
          <h4 key={i} className="!mt-7 font-sans text-sm font-bold uppercase tracking-[0.12em] text-accent-ink">
            {p.slice(3)}
          </h4>
        ) : (
          <p key={i}>{rich(p)}</p>
        ),
      )}
    </>
  );
}

/** A story is read in full in class; on the page it opens on its first
 *  paragraph, so the part stays scannable. */
function Story({ b }: { b: Extract<Block, { type: "story" }> }) {
  const [first, ...rest] = b.paragraphs;
  return (
    <article className="relative overflow-hidden rounded-3xl border border-hairline bg-elevated p-6 sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,color-mix(in_srgb,var(--accent)_12%,transparent)_0%,transparent_70%)]"
      />
      <div className="relative">
        {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">{b.heading}</h3>

        {b.images && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {b.images.map((t) => (
              <li key={t} className="rounded-full border border-hairline px-3 py-1 text-xs text-ink-2">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-4 leading-relaxed text-ink-2">
          <p>{rich(first)}</p>
        </div>

        {rest.length > 0 && (
          <details className="group mt-4">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-accent-ink [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Read the whole story</span>
              <span className="hidden group-open:inline">Show less</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition group-open:rotate-180" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-2">
              <Paragraphs items={rest} />
            </div>
          </details>
        )}

        {b.lesson && (
          <div className="mt-6 rounded-2xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-5">
            {b.lesson.heading && (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{b.lesson.heading}</p>
            )}
            <p className="mt-1 font-serif text-xl leading-snug text-ink">{rich(b.lesson.lead)}</p>
            {b.lesson.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink-2">
                {rich(p)}
              </p>
            ))}
          </div>
        )}

        {b.source && <p className="mt-5 text-xs text-ink-3">{b.source}</p>}
      </div>
    </article>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "mission":
      return (
        <section>
          {b.heading && <Heading>{b.heading}</Heading>}
          <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] p-7 sm:p-9">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,color-mix(in_srgb,var(--accent)_18%,transparent)_0%,transparent_70%)]" />
            <p className="relative text-xs font-semibold text-ink-3">{b.label}</p>
            <p className="relative mt-3 text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
              {b.text}
            </p>
          </div>
        </section>
      );

    case "story":
      return <Story b={b} />;

    case "quote":
      return (
        <section>
          {b.heading && <Heading>{b.heading}</Heading>}
          <QuoteBlock q={b} large />
        </section>
      );

    case "quiz":
      return (
        <section>
          {b.heading && <Heading>{b.heading}</Heading>}
          <Quiz question={b.question} options={b.options} answer={b.answer}>
            {b.explanation && <QuoteBlock q={b.explanation} />}
            {b.symbols && (
              <ul className="flex flex-wrap gap-2" aria-label="The world's faiths">
                {FAITHS.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-ink-2">
                    <TraditionSymbol tradition={f} className="h-4 w-4 text-accent-ink" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {b.note && <p className="leading-relaxed text-ink-2">{rich(b.note)}</p>}
            {b.link && (
              <div className="mt-1">
                <LinkPill {...b.link} />
              </div>
            )}
          </Quiz>
        </section>
      );

    case "definition":
      return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-3xl border border-hairline bg-elevated p-6 text-center">
            <p className="eyebrow">Root</p>
            <p className="mt-1 font-serif text-5xl text-ink">{b.root}</p>
            <p className="mt-1 text-ink-2">‘{b.rootMeaning}’</p>
          </div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto rotate-90 text-accent-ink sm:rotate-0" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          <div className="rounded-3xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-6 text-center">
            <p className="eyebrow">Word</p>
            <p className="mt-1 font-serif text-5xl text-ink">{b.term}</p>
            <p className="mt-1 text-ink-2">‘{b.meaning}’</p>
          </div>
          <p className="leading-relaxed text-ink-2 sm:col-span-3">{b.text}</p>
        </section>
      );

    case "truths":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {b.items.map((t, i) => (
              <li key={t.sanskrit} className="rounded-2xl border border-hairline bg-elevated p-5">
                <span className="text-xs font-semibold tabular-nums text-ink-3">{i + 1}</span>
                <p className="font-serif text-2xl leading-tight text-ink">{t.sanskrit}</p>
                <p className="mt-1 text-accent-ink">{t.english}</p>
                {t.parallel && <p className="mt-3 text-xs text-ink-3">Story · {t.parallel}</p>}
              </li>
            ))}
          </ol>
        </section>
      );

    case "term":
      return (
        <section className="rounded-3xl border border-hairline bg-elevated p-6 sm:p-8">
          <span className="eyebrow">Term</span>
          <h3 className="mt-1 font-serif text-3xl leading-tight text-ink">{b.term}</h3>
          {b.gloss && <p className="mt-1 text-lg text-accent-ink">{b.gloss}</p>}

          {b.books && (
            <div className="mt-5">
              <ul className="flex flex-wrap gap-2">
                {b.books.map((t) => (
                  <li key={t} className="rounded-lg border border-hairline bg-surface px-3 py-2 font-serif text-sm italic text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-3">Every one of these books has an author.</p>
            </div>
          )}

          {b.relay && (
            <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-2">
              <span>{b.relay[0]}</span>
              <span aria-hidden className="relative h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--accent)_0_6px,transparent_6px_12px)]" />
              <span>{b.relay[1]}</span>
            </div>
          )}

          {b.points && (
            <ul className="mt-5 space-y-3">
              {b.points.map((p, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-ink-2">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{rich(p)}</span>
                </li>
              ))}
            </ul>
          )}

          {b.quote && (
            <div className="mt-5">
              <QuoteBlock q={b.quote} />
            </div>
          )}
        </section>
      );

    case "metres":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          {b.intro && <p className="mb-5 leading-relaxed text-ink-2">{rich(b.intro)}</p>}
          <ol className="space-y-2">
            {b.items.map((m, i) => (
              <li key={m.name} className="flex items-center gap-4 rounded-xl border border-hairline px-4 py-2.5">
                <span className="w-5 text-xs tabular-nums text-ink-3">{i + 1}</span>
                <span className="w-28 font-serif text-lg text-ink">{m.name}</span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
                    style={{ width: `${(m.syllables / 48) * 100}%` }}
                  />
                </span>
                <span className="w-24 text-right text-sm tabular-nums text-ink-2">{m.syllables} syllables</span>
              </li>
            ))}
          </ol>
        </section>
      );

    case "syllables":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          {b.intro && <p className="mb-5 leading-relaxed text-ink-2">{rich(b.intro)}</p>}
          <SyllableCount lines={b.lines} />
        </section>
      );

    case "vedas":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          {b.intro && <p className="mb-5 leading-relaxed text-ink-2">{rich(b.intro)}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {b.items.map((v) => (
              <article key={v.name} className="relative overflow-hidden rounded-3xl border border-hairline bg-elevated p-6">
                <span aria-hidden className="pointer-events-none absolute -right-2 -top-6 font-serif text-[7rem] leading-none text-[color-mix(in_srgb,var(--accent)_16%,transparent)]">
                  {v.letter}
                </span>
                <h3 className="relative font-serif text-2xl text-ink">{v.name}</h3>
                <ul className="relative mt-4 space-y-2.5">
                  {v.points.map((p, i) => (
                    <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{rich(p)}</span>
                    </li>
                  ))}
                </ul>
                {v.link && (
                  <div className="relative mt-5">
                    <LinkPill {...v.link} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      );

    case "chants":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          {b.intro && <p className="mb-5 leading-relaxed text-ink-2">{rich(b.intro)}</p>}
          <div className="space-y-4">
            {b.items.map((c, i) => (
              <article key={c.title} className="rounded-3xl border border-hairline bg-elevated p-6 sm:p-7">
                <span className="text-xs font-semibold tabular-nums text-ink-3">{i + 1}</span>
                <h3 className="font-serif text-2xl text-ink">{c.title}</h3>
                {c.subtitle && <p className="mt-1 text-sm text-ink-2">{c.subtitle}</p>}
                <dl className="mt-4 space-y-2.5">
                  {c.lines.map((l, j) => (
                    <div key={j} className={l.sanskrit ? "grid grid-cols-1 gap-x-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : ""}>
                      {l.sanskrit && <dt className="iast-text font-serif text-lg text-ink">{l.sanskrit}</dt>}
                      <dd className={l.sanskrit ? "text-ink-2" : "font-serif text-lg italic text-ink"}>{l.english}</dd>
                    </div>
                  ))}
                </dl>
                {c.text && <p className="mt-5 text-sm leading-relaxed text-ink-3">{rich(c.text)}</p>}
                {c.link && (
                  <div className="mt-5">
                    <LinkPill {...c.link} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      );

    case "chain":
      return (
        <section>
          <Heading>{b.heading}</Heading>
          <ol className="flex flex-col items-start">
            {b.items.map((s, i) => (
              <li key={s} className="flex flex-col items-start">
                {i > 0 && <span aria-hidden className="ml-[1.1rem] h-4 w-px bg-[color-mix(in_srgb,var(--accent)_60%,transparent)]" />}
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums text-canvas"
                    style={{ background: `color-mix(in srgb, var(--accent) ${100 - i * 5}%, #2B5773)` }}
                  >
                    {i + 1}
                  </span>
                  <span className={`font-serif text-ink ${i === 0 || i === b.items.length - 1 ? "text-2xl" : "text-xl"}`}>{s}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      );

    case "facts":
      return (
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {b.items.map((f) => (
              <div key={f.eyebrow} className="rounded-3xl border border-hairline bg-elevated p-6">
                <span className="eyebrow">{f.eyebrow}</span>
                <p className="mt-2 font-serif text-xl leading-snug text-ink">{f.text}</p>
              </div>
            ))}
          </div>
          {b.footnote && <p className="mt-3 text-xs text-ink-3">{b.footnote}</p>}
          {b.link && (
            <div className="mt-5">
              <LinkPill {...b.link} />
            </div>
          )}
        </section>
      );
  }
}

export default async function PartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = getPart(id);
  if (!found) notFound();
  const { part, index } = found;
  const prev = parts[index - 1];
  const next = parts[index + 1];

  return (
    <div style={{ "--accent": VEDAS101_ACCENT } as React.CSSProperties}>
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent)_26%,transparent)_0%,color-mix(in_srgb,var(--accent)_8%,transparent)_45%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6">
          <Link href="/?view=vedas101" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Vedas 101
          </Link>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="eyebrow">
                Part {index + 1} of {parts.length}
              </span>
              <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{part.title}</h1>
              <p className="mt-1.5 max-w-xl text-base text-ink-2">{part.summary}</p>
            </div>
            <FontSizeControl />
          </div>

          <ol className="mt-6 flex gap-1.5" aria-label="Parts">
            {parts.map((p, i) => (
              <li key={p.id} className="flex-1">
                <Link
                  href={`/vedas-101/${p.id}`}
                  aria-label={`Part ${i + 1}: ${p.title}`}
                  aria-current={i === index ? "page" : undefined}
                  className={`block h-1.5 rounded-full transition ${
                    i === index ? "bg-[var(--accent)]" : i < index ? "bg-[color-mix(in_srgb,var(--accent)_45%,transparent)]" : "bg-hairline hover:bg-ink-3/40"
                  }`}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="scalable-text mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
        {part.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}

        <nav className="grid grid-cols-1 gap-3 border-t border-hairline pt-8 sm:grid-cols-2" aria-label="Part navigation">
          {prev ? (
            <Link href={`/vedas-101/${prev.id}`} className="group rounded-2xl border border-hairline p-5 transition hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]">
              <span className="text-xs text-ink-3">← Part {index}</span>
              <span className="mt-1 block font-serif text-lg text-ink">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/vedas-101/${next.id}`} className="group rounded-2xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-5 text-right transition hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]">
              <span className="text-xs text-ink-3">Part {index + 2} →</span>
              <span className="mt-1 block font-serif text-lg text-ink">{next.title}</span>
            </Link>
          ) : (
            <Link href="/?view=chants" className="group rounded-2xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-5 text-right transition hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]">
              <span className="text-xs text-ink-3">You’ve finished Vedas 101 →</span>
              <span className="mt-1 block font-serif text-lg text-ink">Start learning the chants</span>
            </Link>
          )}
        </nav>

        <p className="text-xs text-ink-3">From {course.source}</p>
      </div>
    </div>
  );
}
