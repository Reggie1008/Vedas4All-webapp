"use client";

import { useCallback, useEffect, useState } from "react";
import type { Verse } from "@/lib/chants";

/**
 * Put the lines back in order.
 *
 * Tapping is the primary way to place a line: HTML5 drag does not work on
 * a phone at all, and it is awkward for older hands. Dragging also works
 * on a laptop for those who reach for it, but nothing depends on it.
 */
export default function OrderLines({ verses }: { verses: Verse[] }) {
  const lines = verses.map((v) => v.iast);
  const [pool, setPool] = useState<number[]>([]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);

  // Shuffled after mount, so the server and client render the same markup.
  const deal = useCallback(() => {
    const order = lines.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // A shuffle that happens to be the answer helps nobody.
    if (lines.length > 2 && order.every((v, i) => v === i)) order.reverse();
    setPool(order);
    setPlaced([]);
    setChecked(false);
  }, [lines.length]);

  useEffect(() => {
    deal();
  }, [deal]);

  const place = (idx: number) => {
    setPool((p) => p.filter((x) => x !== idx));
    setPlaced((p) => [...p, idx]);
    setChecked(false);
  };
  const unplace = (idx: number) => {
    setPlaced((p) => p.filter((x) => x !== idx));
    setPool((p) => [...p, idx]);
    setChecked(false);
  };

  const full = placed.length === lines.length;
  const correct = placed.every((v, i) => v === i);
  const rightCount = placed.filter((v, i) => v === i).length;

  return (
    <div>
      <p className="text-sm leading-relaxed text-ink-2">
        The lines are jumbled. Tap them in the right order — or drag them across
        if you prefer. Tap a line you have placed to take it back.
      </p>

      {/* Where the lines go */}
      <ol
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragging !== null && pool.includes(dragging)) place(dragging);
          setDragging(null);
        }}
        className="mt-5 space-y-2"
      >
        {Array.from({ length: lines.length }).map((_, slot) => {
          const idx = placed[slot];
          const isEmpty = idx === undefined;
          const isRight = checked && idx === slot;
          const isWrong = checked && !isEmpty && idx !== slot;
          return (
            <li key={slot}>
              {isEmpty ? (
                <div className="flex min-h-[3.5rem] items-center gap-3 rounded-xl border border-dashed border-hairline px-4 py-3 text-sm text-ink-3">
                  <span className="font-serif tabular-nums text-ink-3/60">{slot + 1}</span>
                  <span>…</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => unplace(idx)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    isRight
                      ? "border-[color-mix(in_srgb,var(--accent)_60%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
                      : isWrong
                        ? "border-[#d08a6a] bg-[color-mix(in_srgb,#d08a6a_12%,transparent)]"
                        : "border-hairline hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)]"
                  }`}
                >
                  <span className="font-serif tabular-nums text-ink-3">{slot + 1}</span>
                  <span className="iast-text min-w-0 flex-1 font-serif text-ink">
                    {lines[idx]}
                  </span>
                  {checked && (
                    <span aria-hidden className="shrink-0 text-sm">
                      {isRight ? "✓" : "↻"}
                    </span>
                  )}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* The jumbled lines still to place */}
      {pool.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow mb-2">Still to place</p>
          <div className="space-y-2">
            {pool.map((idx) => (
              <button
                key={idx}
                type="button"
                draggable
                onDragStart={() => setDragging(idx)}
                onDragEnd={() => setDragging(null)}
                onClick={() => place(idx)}
                className="block w-full cursor-grab rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-surface px-4 py-3 text-left transition hover:border-[color-mix(in_srgb,var(--accent)_70%,transparent)] active:cursor-grabbing"
              >
                <span className="iast-text font-serif text-ink">{lines[idx]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!full}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[#08111a] transition disabled:opacity-40"
        >
          Check
        </button>
        <button
          type="button"
          onClick={deal}
          className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink-2 transition hover:text-ink"
        >
          Shuffle again
        </button>

        {checked && (
          <span className="text-sm text-ink-2">
            {correct
              ? "That is the whole chant, in order."
              : `${rightCount} of ${lines.length} in place — tap the marked lines to move them.`}
          </span>
        )}
      </div>
    </div>
  );
}
