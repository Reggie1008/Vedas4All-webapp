"use client";

import { useVerseAudio } from "@/components/VerseAudioContext";

/**
 * Some recordings begin with the words spoken one at a time before the
 * chant itself. That stretch is useful on its own — it is how a student
 * first learns what the words are — so it gets its own control, above
 * the verses, rather than being buried at the head of the full track.
 */
export default function WalkthroughButton({
  start,
  end,
}: {
  start: number;
  end: number;
}) {
  const audio = useVerseAudio();
  if (!audio?.hasAudio) return null;

  const playing =
    audio.isPlaying && audio.currentTime >= start - 0.2 && audio.currentTime < end;
  const length = Math.round(end - start);

  return (
    <button
      type="button"
      onClick={() => (playing ? audio.stop() : audio.playRange(start, end))}
      className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition ${
        playing
          ? "border-transparent bg-[var(--accent)] text-[#08111a]"
          : "border-hairline hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:bg-surface"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
          playing
            ? "border-[#08111a]/30"
            : "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-accent-ink"
        }`}
      >
        {playing ? (
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <rect x="2.5" y="2" width="4" height="12" rx="1" />
            <rect x="9.5" y="2" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M3.5 1.8v12.4L14 8z" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">
          {playing ? "Playing — word by word" : "Hear it word by word"}
        </span>
        <span className={`block text-xs ${playing ? "text-[#08111a]/70" : "text-ink-3"}`}>
          Each word spoken on its own, before the chant · {length}s
        </span>
      </span>
    </button>
  );
}
