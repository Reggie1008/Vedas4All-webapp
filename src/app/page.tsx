import { chants } from "@/lib/chants";
import { modules } from "@/lib/fundamentals";
import ChantCard from "@/components/ChantCard";
import ModuleCard from "@/components/ModuleCard";
import PortalTabs from "@/components/PortalTabs";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="accent-glow pointer-events-none absolute inset-x-0 -top-24 h-72" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Vedas4All{" "}
            {/* Plain inline, so it sits beside the wordmark and wraps with it
                rather than dropping to a line of its own. The script face has
                no bold and runs wide, hence the slight step down. */}
            <span className="bg-gradient-to-r from-gold-bright to-gold bg-clip-text font-script text-[0.82em] font-normal tracking-normal text-transparent">
              Learn to Chant
            </span>
          </h1>

          <figure className="mt-6 max-w-xl border-l-2 border-gold pl-4">
            <blockquote className="font-serif text-xl italic leading-snug text-ink sm:text-2xl">
              “I want each of you to learn the Vedas properly”
            </blockquote>
            <figcaption className="mt-2 text-sm text-ink-3">— Sri Sathya Sai Baba</figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <PortalTabs
          chants={
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {chants.map((chant, i) => (
                <ChantCard key={chant.id} chant={chant} index={i} />
              ))}
            </div>
          }
          fundamentals={
            <div>
              <p className="mb-6 max-w-xl text-pretty leading-relaxed text-ink-2">
                Before the chants themselves — how the sounds are made, how they
                are held, and why the difference matters.
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m, i) => (
                  <ModuleCard key={m.id} module={m} index={i} />
                ))}
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
}
