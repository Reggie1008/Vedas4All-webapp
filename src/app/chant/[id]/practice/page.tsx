import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chants, getChantById } from "@/lib/chants";
import { getChantTheme } from "@/lib/chantTheme";
import FontSizeControl from "@/components/FontSizeControl";
import PracticeTabs from "@/components/practice/PracticeTabs";

export function generateStaticParams() {
  return chants.map((chant) => ({ id: chant.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chant = getChantById(id);
  if (!chant) return {};
  return {
    title: `Practise ${chant.title.iast}`,
    description: `Put the lines in order and match the meanings of ${chant.title.iast}.`,
    openGraph: {
      title: `Practise ${chant.title.iast} — Vedas4All`,
      description: `Put the lines in order and match the meanings of ${chant.title.iast}.`,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chant = getChantById(id);
  if (!chant) notFound();

  const { accent } = getChantTheme(chant.id);
  // Śrī Rudram keeps its lines inside anuvākas; practice is per-chant for now.
  const verses = chant.verses;
  const words = chant.wordMeanings ?? [];

  return (
    <div style={{ "--accent": accent } as React.CSSProperties}>
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent)_26%,transparent)_0%,color-mix(in_srgb,var(--accent)_8%,transparent)_45%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6">
          <Link
            href={`/chant/${chant.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to {chant.title.iast}
          </Link>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="eyebrow">Practice</span>
              <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                {chant.title.iast}
              </h1>
            </div>
            <FontSizeControl />
          </div>
        </div>
      </section>

      <div className="scalable-text mx-auto max-w-3xl px-4 py-9 sm:px-6">
        <PracticeTabs verses={verses} words={words} />
      </div>
    </div>
  );
}
