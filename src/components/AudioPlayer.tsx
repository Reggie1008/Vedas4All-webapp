"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  normalSrc,
  slowSrc,
  source,
}: {
  normalSrc: string;
  slowSrc?: string;
  /** Attribution for the recording, shown beneath the player. */
  source?: string;
}) {
  const hasSlow = Boolean(slowSrc);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [speed, setSpeed] = useState<"normal" | "slow">("normal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pointA, setPointA] = useState<number | null>(null);
  const [pointB, setPointB] = useState<number | null>(null);
  const [loopActive, setLoopActive] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const src = speed === "slow" && slowSrc ? slowSrc : normalSrc;

  useEffect(() => {
    setUnavailable(false);
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    function onTimeUpdate() {
      if (!el) return;
      setCurrentTime(el.currentTime);
      if (loopActive && pointB !== null && el.currentTime >= pointB) {
        el.currentTime = pointA ?? 0;
      }
    }
    function onLoadedMetadata() {
      if (el) setDuration(el.duration);
    }
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setUnavailable(true);

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onError);
    };
  }, [loopActive, pointA, pointB]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
      const el = audioRef.current;
      if (!el || unavailable) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        el.currentTime = Math.min(el.duration || 0, el.currentTime + 5);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        el.currentTime = Math.max(0, el.currentTime - 5);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [unavailable, togglePlay]);

  function changeSpeed(next: "normal" | "slow") {
    const el = audioRef.current;
    const wasPlaying = !el?.paused;
    const time = el?.currentTime ?? 0;
    setSpeed(next);
    requestAnimationFrame(() => {
      const newEl = audioRef.current;
      if (!newEl) return;
      newEl.currentTime = time;
      if (wasPlaying) newEl.play();
    });
  }

  function seekTo(value: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  }

  function setLoopPoint(which: "A" | "B") {
    const t = audioRef.current?.currentTime ?? 0;
    if (which === "A") {
      setPointA(t);
      if (pointB !== null && t >= pointB) setPointB(null);
    } else {
      setPointB(t);
      if (pointA !== null && t <= pointA) setPointA(null);
    }
  }

  function clearLoop() {
    setPointA(null);
    setPointB(null);
    setLoopActive(false);
  }

  if (unavailable || !normalSrc) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline px-5 py-6 text-center text-sm text-ink-3">
        Audio for this chant is coming soon.
      </div>
    );
  }

  const pct = (t: number) => (duration ? (t / duration) * 100 : 0);
  const canLoop = pointA !== null && pointB !== null;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="none" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[#08111a] shadow-[0_6px_20px_-4px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition hover:brightness-110 active:scale-95"
        >
          {isPlaying ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="2.5" y="1.5" width="4" height="13" rx="1.2" />
              <rect x="9.5" y="1.5" width="4" height="13" rx="1.2" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden className="ml-0.5">
              <path d="M3 1.8v12.4a.6.6 0 0 0 .92.5l9.7-6.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {/* Track with the A–B region drawn in */}
          <div className="relative h-6">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-hi">
              {canLoop && (
                <div
                  className="absolute inset-y-0 bg-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
                  style={{ left: `${pct(pointA)}%`, width: `${pct(pointB) - pct(pointA)}%` }}
                />
              )}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
                style={{ width: `${pct(currentTime)}%` }}
              />
            </div>

            {(["A", "B"] as const).map((label) => {
              const t = label === "A" ? pointA : pointB;
              if (t === null) return null;
              return (
                <span
                  key={label}
                  className="pointer-events-none absolute top-1/2 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent-ink bg-canvas text-[0.5rem] font-bold text-accent-ink"
                  style={{ left: `${pct(t)}%` }}
                >
                  {label}
                </span>
              );
            })}

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:shadow-md"
              aria-label="Seek"
            />
          </div>

          <div className="mt-0.5 flex justify-between text-[0.7rem] tabular-nums text-ink-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
        {/* Only offer the speed switch where a slow recording actually exists */}
        {hasSlow && (
          <>
            <div className="flex overflow-hidden rounded-full border border-hairline text-xs font-semibold">
              {(["normal", "slow"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`px-3.5 py-1.5 capitalize transition ${
                    speed === s ? "bg-ink text-canvas" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mx-1 h-5 w-px bg-hairline" aria-hidden />
          </>
        )}

        <span className="eyebrow mr-0.5">Loop</span>
        {(["A", "B"] as const).map((label) => {
          const t = label === "A" ? pointA : pointB;
          return (
            <button
              key={label}
              onClick={() => setLoopPoint(label)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums transition ${
                t !== null
                  ? "border-accent-ink text-accent-ink"
                  : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
              }`}
            >
              {label}
              {t !== null && ` ${formatTime(t)}`}
            </button>
          );
        })}

        <button
          onClick={() => setLoopActive((v) => !v)}
          disabled={!canLoop}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${
            loopActive
              ? "bg-[var(--accent)] text-[#08111a]"
              : "border border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
          }`}
        >
          {loopActive ? "Looping" : "Repeat A–B"}
        </button>

        {(pointA !== null || pointB !== null) && (
          <button
            onClick={clearLoop}
            className="text-xs text-ink-3 underline underline-offset-2 transition hover:text-ink"
          >
            Clear
          </button>
        )}

        <span className="ml-auto hidden text-[0.7rem] text-ink-3 lg:block">
          Space to play · ← → to seek
        </span>
      </div>

      {source && (
        <p className="mt-3 border-t border-hairline pt-3 text-xs leading-relaxed text-ink-3">
          Recording: {source}
        </p>
      )}
    </div>
  );
}
