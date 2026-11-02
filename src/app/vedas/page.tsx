import type { Metadata } from "next";
import Link from "next/link";
import { chants } from "@/lib/chants";
import { modules } from "@/lib/fundamentals";

export const metadata: Metadata = {
  title: "The Vedas",
  description:
    "Veda is not only ancient knowledge — it is the collective awareness of all life on Earth and beyond. An introduction to the Vedas and to chanting them.",
  openGraph: {
    title: "The Vedas — Vedas4All",
    description:
      "Veda is not only ancient knowledge — it is the collective awareness of all life on Earth and beyond.",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
  },
};

/** The gold of the brand, so the page reads as the portal's own front door. */
const ACCENT = "#DDA83F";

export default function VedasPage() {
  return (
    <div style={{ "--accent": ACCENT } as React.CSSProperties}>
      {/* Opening */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div aria-hidden className="accent-glow pointer-events-none absolute inset-x-0 -top-32 h-80" />
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <p className="eyebrow">An introduction</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            What the{" "}
            <span className="bg-gradient-to-r from-gold-bright to-gold bg-clip-text text-transparent">
              Vedas
            </span>{" "}
            are
          </h1>
          <p className="mt-5 text-pretty font-serif text-xl leading-relaxed text-ink-2 sm:text-2xl">
            With 8.4 million species on Planet Earth alone, each having its own form of
            awareness — from ants to human beings — Veda isn&rsquo;t just ancient knowledge.
            It is the collective awareness of all life on planet Earth and beyond.
          </p>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-2">
            When we chant the Vedas, let us rediscover what it means to be truly aware.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6">
        {/* Chanting */}
        <section>
          <h2 className="eyebrow mb-3 flex items-center gap-2.5">
            <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
            Chanting together
          </h2>
          <div className="space-y-4 leading-relaxed text-ink-2">
            <p>
              When chanting Veda mantras, it is important to chant with the correct scale and
              volume, in order to create and connect to the vibration.
            </p>
            <p>
              Collective chanting of the Vedas can have positive impacts on both human nature
              and Mother Nature. When we chant collectively with energy and intention, we
              generate powerful vibrations that uplift the space and everyone in it.
            </p>
            <p>
              These vibrations are frequencies that connect to the universal frequencies of
              Mother Nature, which are replicated within us.{" "}
              <strong className="font-semibold text-ink">
                This is called Peace — the concordance of what is within with what is outside.
              </strong>{" "}
              Such synchrony will spread far and wide, creating an ocean of vibration that
              will result in universal healing, peace and harmony.
            </p>
          </div>
        </section>

        {/* Why together */}
        <section>
          <h2 className="eyebrow mb-3 flex items-center gap-2.5">
            <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
            Why we chant together
          </h2>
          <div className="space-y-4 leading-relaxed text-ink-2">
            <p>
              Collective presence — as in hearing, seeing, feeling, breathing and action — is
              the only way to be illumined. This is the essence of the Eightfold Path of
              Enlightenment that was elaborated by Gautama Buddha.
            </p>
            <p className="border-l-2 border-[var(--accent)] pl-4 font-serif text-lg italic leading-relaxed text-ink">
              When a raindrop falls in a flowing river, it is sure to reach the ocean, which is
              verily its source. A drop of rain in a desert is very unlikely to accomplish this.
            </p>
            <p>
              Collective <em>sādhana</em> is a critical aspect of reaching the target. The Vedas
              impart this supreme teaching repeatedly: to expand outward, step by step.
            </p>
          </div>

          {/* The progression the Vedas teach */}
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["vyaṣṭi", "the individual"],
              ["samaṣṭi", "the collective"],
              ["sṝṣṭi", "creation"],
              ["parameṣṭi", "the Ultimate ONE"],
            ].map(([term, gloss], i) => (
              <li
                key={term}
                className="relative rounded-xl border border-hairline px-4 py-3"
              >
                <span aria-hidden className="text-xs tabular-nums text-ink-3/60">
                  {i + 1}
                </span>
                <span className="iast-text block font-serif text-lg leading-tight text-ink">
                  {term}
                </span>
                <span className="mt-0.5 block text-xs text-ink-3">{gloss}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* The line to carry away */}
        <section className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] p-7 sm:p-9">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_70%)]"
          />
          <p className="relative text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
            Don&rsquo;t just chant — feel the chant, live with the chant,{" "}
            <span className="script-accent !text-[1.1em]">become ONE with the chant.</span>
          </p>
        </section>

        {/* Ways in */}
        <section>
          <h2 className="eyebrow mb-4 flex items-center gap-2.5">
            <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
            Where to begin
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/?view=fundamentals"
              className="group rounded-2xl border border-hairline px-5 py-5 transition hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:bg-surface"
            >
              <span className="block font-serif text-xl text-ink">Start with the sounds</span>
              <span className="mt-1 block text-sm text-ink-3">
                How the sounds are made, how they are held, and why the difference matters —
                {" "}{modules.length} modules.
              </span>
            </Link>
            <Link
              href="/?view=chants"
              className="group rounded-2xl border border-hairline px-5 py-5 transition hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:bg-surface"
            >
              <span className="block font-serif text-xl text-ink">Go to the chants</span>
              <span className="mt-1 block text-sm text-ink-3">
                {chants.length} chants with text, meaning and audio at two speeds.
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
