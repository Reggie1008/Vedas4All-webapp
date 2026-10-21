"use client";

import { useCallback, useEffect, useState } from "react";
import type { WordMeaning } from "@/lib/chants";

type Pick = { side: "word" | "meaning"; i: number } | null;

/**
 * Pair each word with what it means.
 *
 * Tap one on the left, then its match on the right. Wrong pairs simply
 * clear — nothing is scored or counted. The aim is to have met the words
 * a few times, not to be ranked.
 */
export default function MatchMeanings({ words }: { words: WordMeaning[] }) {
  const [leftOrder, setLeftOrder] = useState<number[]>([]);
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [pick, setPick] = useState<Pick>(null);
  const [wrong, setWrong] = useState<number | null>(null);

  const deal = useCallback(() => {
    const shuffle = () => {
      const a = words.map((_, i) => i);
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    setLeftOrder(shuffle());
    setRightOrder(shuffle());
    setSolved([]);
    setPick(null);
    setWrong(null);
  }, [words]);

  useEffect(() => {
    deal();
  }, [deal]);

  function choose(side: "word" | "meaning", i: number) {
    if (solved.includes(i)) return;
    if (!pick) {
      setPick({ side, i });
      return;
    }
    if (pick.side === side) {
      setPick({ side, i });
      return;
    }
    if (pick.i === i) {
      setSolved((s) => [...s, i]);
      setPick(null);
    } else {
      // Flash the mistaken pair, then clear it.
      setWrong(i);
      setPick(null);
      setTimeout(() => setWrong(null), 550);
    }
  }

  const done = solved.length === words.length && words.length > 0;

  const cell = (side: "word" | "meaning", i: number, text: string) => {
    const isSolved = solved.includes(i);
    const isPicked = pick?.side === side && pick.i === i;
    const isWrong = wrong === i;
    return (
      <button
        key={i}
        type="button"
        onClick={() => choose(side, i)}
        disabled={isSolved}
        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
          isSolved
            ? "border-[color-mix(in_srgb,var(--accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] opacity-70"
            : isPicked
              ? "border-transparent bg-[var(--accent)] text-[#08111a]"
              : isWrong
                ? "border-[#d08a6a] bg-[color-mix(in_srgb,#d08a6a_14%,transparent)]"
                : "border-hairline hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:bg-surface"
        }`}
      >
        <span
          className={
            side === "word"
              ? "iast-text font-serif text-base text-inherit"
              : "text-sm leading-snug text-inherit"
          }
        >
          {text}
        </span>
      </button>
    );
  };

  return (
    <div>
      <p className="text-sm leading-relaxed text-ink-2">
        Tap a word, then the meaning that belongs to it.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="eyebrow">Word</p>
          {leftOrder.map((i) => cell("word", i, words[i].word))}
        </div>
        <div className="space-y-2">
          <p className="eyebrow">Meaning</p>
          {rightOrder.map((i) => cell("meaning", i, words[i].meaning))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={deal}
          className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink-2 transition hover:text-ink"
        >
          Shuffle again
        </button>
        <span className="text-sm text-ink-2">
          {done
            ? "Every word matched."
            : `${solved.length} of ${words.length} matched`}
        </span>
      </div>
    </div>
  );
}
