import type { Metadata } from "next";
import Link from "next/link";
import BaseNote from "@/components/BaseNote";

export const metadata: Metadata = {
  title: "Find your scale",
  description:
    "Veda chanting is pitched against one base note. Find the one that sits easily in your own voice, and practise on it at home.",
  openGraph: {
    title: "Find your scale — Vedas4All",
    description:
      "Veda chanting is pitched against one base note. Find the one that sits easily in your own voice.",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
  },
};

const ACCENT = "#7BC5F0"; // the Fundamentals accent — this belongs with them

export default function FindYourScalePage() {
  return (
    <div style={{ "--accent": ACCENT } as React.CSSProperties}>
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent)_26%,transparent)_0%,color-mix(in_srgb,var(--accent)_8%,transparent)_45%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-9 pt-6 sm:px-6">
          <Link
            href="/?view=fundamentals"
            className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            All fundamentals
          </Link>
          <span className="eyebrow mt-5 block">Before you chant</span>
          <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Find your scale
          </h1>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
            Veda chanting is not a melody. Every syllable is pitched against a single base
            note, so the first thing to settle is which note that is for your own voice.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-9 sm:px-6">
        <BaseNote />

        <section>
          <h2 className="eyebrow mb-3 flex items-center gap-2.5">
            <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
            How to use it
          </h2>
          <ol className="space-y-2.5">
            {[
              "Press play and hum along with the tone, on any syllable you like.",
              "If you are straining, step down. If it feels thin or breathy, step up.",
              "The right note is the one you can hold comfortably for a long line without running out of breath.",
              "Save it. Start from the same note each time you practise, and the svaras will settle.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-hairline px-4 py-3">
                <span aria-hidden className="font-serif text-sm text-[var(--accent)]">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink-2">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="eyebrow mb-3 flex items-center gap-2.5">
            <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
            Why it matters
          </h2>
          <div className="space-y-4 leading-relaxed text-ink-2">
            <p>
              The svaras are not fixed pitches — they are positions{" "}
              <em>relative to your base note</em>. Udātta sits on it, anudātta below it, and
              svarita moves. Chanting on a different note each day means learning those
              positions over again each day.
            </p>
            <p>
              It also matters in company. When a group chants on one note the vibrations
              reinforce rather than fight each other, which is where the volume and the
              steadiness come from.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
