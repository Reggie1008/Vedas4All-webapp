/**
 * The introduction that opens the portal — what Veda is, and why it is
 * chanted together. Sits as the first of the three tabs on the home page.
 */
export default function Welcome() {
  return (
    <div>
      <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        With 8.4 million species on Planet Earth alone, each having its own form of
        awareness — from ants to human beings — Veda isn&rsquo;t just ancient knowledge.
        It is the collective awareness of all life on planet Earth and beyond.
      </p>
      <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-2">
        When we chant the Vedas, let us rediscover what it means to be truly aware.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
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

        <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["vyaṣṭi", "the individual"],
            ["samaṣṭi", "the collective"],
            ["sṝṣṭi", "creation"],
            ["parameṣṭi", "the Ultimate ONE"],
          ].map(([term, gloss], i) => (
            <li key={term} className="rounded-xl border border-hairline px-4 py-3">
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

      </div>

      <section className="relative mt-10 overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] p-7 sm:p-9">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_70%)]"
        />
        <p className="relative text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
          Don&rsquo;t just chant — feel the chant, live with the chant,{" "}
          <span className="script-accent !text-[1.1em]">become ONE with the chant.</span>
        </p>
      </section>
    </div>
  );
}
