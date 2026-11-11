"use client";

import { useEffect, useRef, useState } from "react";
import { rich } from "@/lib/richText";

/**
 * One sound of the alphabet: how it is written, how it is said, and an
 * English word that carries it. Where a recording of the sound exists the
 * whole tile is the button — a student on a phone should not have to aim
 * for a small icon to hear it again.
 */

// Only one sound plays at a time across the page; starting another stops
// the one before it.
let current: HTMLAudioElement | null = null;

export interface Sound {
  iast: string;
  devanagari: string;
  guide: string;
  /** English words carrying the sound; **bold** marks the letters that do. */
  example: string;
  audio?: string;
}

export default function SoundTile({ sound, hasAudio }: { sound: Sound; hasAudio: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      ref.current?.pause();
      if (current === ref.current) current = null;
    },
    []
  );

  function toggle() {
    if (!sound.audio) return;
    if (playing) {
      ref.current?.pause();
      return;
    }
    current?.pause();
    if (!ref.current) {
      const el = new Audio(sound.audio);
      el.addEventListener("pause", () => setPlaying(false));
      el.addEventListener("ended", () => setPlaying(false));
      ref.current = el;
    }
    const el = ref.current;
    el.currentTime = 0;
    current = el;
    setPlaying(true);
    el.play().catch(() => setPlaying(false));
  }

  const body = (
    <>
      {/* Baseline, not centre: Devanagari hangs from its headline and
          would otherwise float above the Latin letter beside it. */}
      <span className="flex min-h-10 items-baseline gap-3">
        <span className="font-serif text-4xl leading-none text-[var(--accent)]">
          {sound.iast}
        </span>
        <span className="font-devanagari text-[1.7rem] leading-none text-ink-2">
          {sound.devanagari}
        </span>
        {hasAudio && (
          <span
            aria-hidden
            className={`ml-auto flex h-10 w-10 shrink-0 items-center self-center justify-center rounded-full border transition ${
              playing
                ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                : "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] text-accent-ink group-hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
            }`}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2.5" y="2" width="4" height="12" rx="1" />
                <rect x="9.5" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.5 1.8v12.4L14 8z" />
              </svg>
            )}
          </span>
        )}
      </span>
      <span className="mt-3 block text-xs font-medium uppercase tracking-wider text-ink-3">
        {sound.guide}
      </span>
      <span className="mt-1 block text-base leading-snug text-ink-2 [&_strong]:font-bold [&_strong]:text-ink">
        {rich(sound.example)}
      </span>
    </>
  );

  const frame =
    "group block w-full rounded-2xl border px-5 py-4 text-left transition-colors";

  return hasAudio ? (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${playing ? "Stop" : "Hear"} the sound ${sound.iast}`}
      className={`${frame} ${
        playing
          ? "border-[color-mix(in_srgb,var(--accent)_70%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
          : "border-hairline hover:bg-surface"
      }`}
    >
      {body}
    </button>
  ) : (
    <div className={`${frame} border-hairline`}>{body}</div>
  );
}
