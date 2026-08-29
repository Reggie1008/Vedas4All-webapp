"use client";

import { useState } from "react";
import type { Place } from "@/lib/fundamentals";

/**
 * The five places of articulation, front of the mouth to the throat.
 * The deck teaches these as positions in the mouth rather than a list,
 * so the selector runs lips → throat in that physical order and each
 * place opens to the sounds actually formed there.
 */
export default function ArticulationChart({ places }: { places: Place[] }) {
  const [active, setActive] = useState(0);
  const place = places[active];

  return (
    <div>
      {/* Place selector */}
      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist">
        {places.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
              i === active
                ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
            }`}
          >
            <span className="block text-sm font-semibold">{p.label}</span>
            <span
              className={`mt-0.5 block text-[0.7rem] ${
                i === active ? "text-[#08111a]/70" : "text-ink-3"
              }`}
            >
              {p.counts.vowels} vowels · {p.counts.consonants} consonants
            </span>
          </button>
        ))}
      </div>

      {/* Selected place */}
      <div className="mt-3 animate-fade-up rounded-2xl border border-hairline p-5">
        <p className="text-sm text-ink-3">{place.where}</p>

        <Group label="Vowels" hint="formed with no aid">
          {place.vowels.map((v) => (
            <Sound key={v} value={v} />
          ))}
        </Group>

        <Group label="Varga consonants" hint="the five of this place">
          {place.varga.map((c) => (
            <Sound key={c} value={c} muted />
          ))}
        </Group>

        {place.other.length > 0 && (
          <Group label="Also here">
            {place.other.map((o) => (
              <span key={o.sound} className="inline-flex flex-col items-center">
                <Sound value={o.sound} muted />
                <span className="mt-1 text-[0.65rem] text-ink-3">
                  {o.kind}
                  {o.example ? ` · ${o.example}` : ""}
                </span>
              </span>
            ))}
          </Group>
        )}
      </div>
    </div>
  );
}

function Group({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="eyebrow mb-2">
        {label}
        {hint && <span className="ml-2 normal-case tracking-normal opacity-70">{hint}</span>}
      </p>
      <div className="flex flex-wrap items-start gap-2">{children}</div>
    </div>
  );
}

function Sound({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <span
      className={`inline-flex min-w-[3rem] items-center justify-center rounded-xl border px-3 py-2 font-serif text-xl ${
        muted
          ? "border-hairline text-ink"
          : "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-ink"
      }`}
    >
      {value}
    </span>
  );
}
