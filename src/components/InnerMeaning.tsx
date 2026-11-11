import type { InnerMeaning as Data, SarvadharmaEntry } from "@/lib/chants";
import TraditionSymbol from "@/components/TraditionSymbol";
import { prose, rich } from "@/lib/richText";

/**
 * The teaching read after the chant: an introduction, one card per stanza
 * with the faith that stanza speaks for, and the key insights. Full width,
 * below the chant, so the long commentary has room and does not push the
 * stanzas themselves off the screen.
 */
export default function InnerMeaning({
  data,
  traditions,
}: {
  data: Data;
  /** Faiths keyed by stanza index (stanza number minus one). */
  traditions?: Record<number, SarvadharmaEntry[]>;
}) {
  return (
    <section className="scalable-text">
      <h2 className="eyebrow mb-4 flex items-center gap-2.5">
        <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
        {data.heading}
      </h2>

      {data.intro && (
        <div className="space-y-4 leading-relaxed text-ink-2 lg:columns-2 lg:gap-12 [&>p]:break-inside-avoid">
          {prose(data.intro, "mb-4 leading-relaxed text-ink-2")}
        </div>
      )}

      {data.links && data.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {data.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-ink-2 transition hover:border-hairline-hi hover:text-ink"
              >
                {l.label}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Columns rather than a grid: the commentary on one stanza runs to a
          page and on another to a sentence, and a grid would leave holes. */}
      <div className="mt-8 gap-5 lg:columns-2">
        {data.stanzas.map((s) => {
          const faiths = traditions?.[s.stanza - 1] ?? [];
          return (
            <article
              key={s.stanza}
              className="mb-5 break-inside-avoid rounded-2xl border border-hairline p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                  Stanza {s.stanza}
                </span>
                {faiths.map((f) => (
                  <span key={f.tradition} className="inline-flex items-center gap-1.5 text-accent-ink">
                    <TraditionSymbol tradition={f.tradition} className="h-[15px] w-[15px] shrink-0" />
                    <span className="text-[0.7rem] font-semibold uppercase tracking-wider">
                      {f.tradition}
                    </span>
                  </span>
                ))}
              </div>
              <h3 className="mt-2 font-serif text-xl leading-snug text-ink">{s.title}</h3>
              <div className="mt-3 space-y-3">
                {prose(s.text, "leading-relaxed text-ink-2")}
              </div>
            </article>
          );
        })}
      </div>

      {data.insights && data.insights.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] p-5 sm:p-7">
          <h3 className="font-serif text-xl text-ink">{data.insightsHeading ?? "Key insights"}</h3>
          <ul className="mt-4 gap-x-10 lg:columns-2">
            {data.insights.map((it, i) => (
              <li key={i} className="mb-3 flex break-inside-avoid gap-2.5 leading-relaxed text-ink-2">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{rich(it)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.source && <p className="mt-3 text-xs text-ink-3">{data.source}</p>}
    </section>
  );
}
