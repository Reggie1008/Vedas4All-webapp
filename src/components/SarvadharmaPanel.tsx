import type { Sarvadharma } from "@/lib/chants";
import TraditionSymbol from "@/components/TraditionSymbol";
import { rich } from "@/lib/richText";

export default function SarvadharmaPanel({ data }: { data: Sarvadharma }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-hairline">
      {/* Emblem + framing */}
      <div className="relative border-b border-hairline p-5 sm:p-7">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,color-mix(in_srgb,var(--accent)_14%,transparent)_0%,transparent_70%)]"
        />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.emblem}
            alt="The Sarvadharma symbol — the emblem of all faiths"
            width={104}
            height={104}
            loading="lazy"
            className="h-24 w-24 shrink-0 sm:h-26 sm:w-26"
          />
          <div>
            <h2 className="font-serif text-2xl leading-tight text-ink">
              Sarvadharma — the faiths within the hymn
            </h2>
            <p className="scalable-text mt-2 leading-relaxed text-ink-2">{rich(data.intro)}</p>
          </div>
        </div>
      </div>

      {/* One block per tradition */}
      <div className="divide-y divide-hairline">
        {data.entries.map((e, i) => (
          <article key={i} className="p-5 transition-colors hover:bg-surface sm:p-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-2 text-accent-ink">
                <TraditionSymbol
                  tradition={e.tradition}
                  className="h-[19px] w-[19px] shrink-0"
                />
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  {e.tradition}
                </h3>
              </span>
              <span className="rounded-full border border-hairline px-2 py-0.5 text-[0.65rem] font-medium text-ink-3">
                Stanza {e.stanza} · {e.keyword}
              </span>
            </div>

            <p className="scalable-text mt-3 leading-relaxed text-ink-2">{rich(e.text)}</p>

            {e.saiQuote && (
              <blockquote className="mt-3 border-l-2 border-accent-ink pl-3 font-serif italic leading-relaxed text-ink">
                “{rich(e.saiQuote)}”
                <footer className="mt-1 font-sans text-xs not-italic text-ink-3">
                  — Sri Sathya Sai Baba
                </footer>
              </blockquote>
            )}

            {e.chant && (
              <div className="mt-4 rounded-xl border border-hairline bg-surface p-4">
                <p className="font-serif text-[0.95rem] leading-relaxed text-ink">
                  {e.chant}
                </p>
                {e.chantMeaning && (
                  <p className="mt-2 border-t border-hairline pt-2 text-sm leading-relaxed text-ink-3">
                    {rich(e.chantMeaning)}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Closing */}
      {(data.closing || data.closingQuote) && (
        <div className="border-t border-hairline p-5 sm:p-7">
          {data.closing && (
            <p className="scalable-text leading-relaxed text-ink-2">{rich(data.closing)}</p>
          )}
          {data.closingQuote && (
            <p className="mt-4 text-center font-serif text-xl italic leading-snug text-accent-ink">
              “{rich(data.closingQuote.text)}”
              <span className="mt-1 block font-sans text-xs not-italic text-ink-3">
                — {data.closingQuote.attribution}
              </span>
            </p>
          )}
        </div>
      )}

      {data.source && (
        <p className="border-t border-hairline px-5 py-3 text-xs text-ink-3 sm:px-7">
          {data.source}
        </p>
      )}
    </section>
  );
}
