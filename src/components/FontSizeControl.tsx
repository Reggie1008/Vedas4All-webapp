"use client";

import { useEffect, useState } from "react";

const MIN = 0.8;
const MAX = 1.6;
const STEP = 0.1;
const STORAGE_KEY = "v4a-font-scale";

export default function FontSizeControl() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (stored >= MIN && stored <= MAX) setScale(stored);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(scale));
    localStorage.setItem(STORAGE_KEY, String(scale));
  }, [scale]);

  const step = (dir: -1 | 1) =>
    setScale((s) => {
      const next = Math.round((s + dir * STEP) * 10) / 10;
      return Math.min(MAX, Math.max(MIN, next));
    });

  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-hairline p-0.5">
      <span className="eyebrow px-2">Size</span>
      <button
        onClick={() => step(-1)}
        disabled={scale <= MIN}
        aria-label="Decrease text size"
        className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-ink-2 transition hover:bg-surface-hi hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      >
        A−
      </button>
      <button
        onClick={() => step(1)}
        disabled={scale >= MAX}
        aria-label="Increase text size"
        className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-ink-2 transition hover:bg-surface-hi hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      >
        A+
      </button>
    </div>
  );
}
