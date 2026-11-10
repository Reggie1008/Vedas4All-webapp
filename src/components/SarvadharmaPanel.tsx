import type { Sarvadharma } from "@/lib/chants";
import { rich } from "@/lib/richText";

/**
 * The Sarvadharma framing, in two pieces. The emblem and its introduction
 * sit above the stanzas, so a student meets the faiths before chanting
 * them; the closing sits below. Each faith itself is marked on the stanza
 * it belongs to — see the `traditions` prop of VersesBlock.
 */

export function SarvadharmaIntro({ data }: { data: Sarvadharma }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-hairline p-5 sm:p-7">
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
          <p className="mt-3 text-xs text-ink-3">
            Each stanza below carries the faith it speaks for. Tap a stanza to read it.
          </p>
        </div>
      </div>
    </section>
  );
}

export function SarvadharmaClosing({ data }: { data: Sarvadharma }) {
  if (!data.closing && !data.closingQuote && !data.source) return null;
  return (
    <section className="overflow-hidden rounded-2xl border border-hairline">
      {(data.closing || data.closingQuote) && (
        <div className="p-5 sm:p-7">
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
