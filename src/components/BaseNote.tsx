"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A drone to find a comfortable base note on, and to hold it while practising.
 *
 * Veda chanting is pitched against one base note rather than a melody, so a
 * student practising at home needs a reference to start from — and the same
 * one each time, or the svaras drift. The tone is synthesised rather than
 * recorded: a few harmonics over a sine, which carries better under a voice
 * than a raw sine and costs nothing to download.
 */

const NOTES = [
  { name: "C", octave: 3, hz: 130.81 },
  { name: "C♯", octave: 3, hz: 138.59 },
  { name: "D", octave: 3, hz: 146.83 },
  { name: "D♯", octave: 3, hz: 155.56 },
  { name: "E", octave: 3, hz: 164.81 },
  { name: "F", octave: 3, hz: 174.61 },
  { name: "F♯", octave: 3, hz: 185.0 },
  { name: "G", octave: 3, hz: 196.0 },
  { name: "G♯", octave: 3, hz: 207.65 },
  { name: "A", octave: 3, hz: 220.0 },
  { name: "A♯", octave: 3, hz: 233.08 },
  { name: "B", octave: 3, hz: 246.94 },
  { name: "C", octave: 4, hz: 261.63 },
  { name: "C♯", octave: 4, hz: 277.18 },
  { name: "D", octave: 4, hz: 293.66 },
  { name: "D♯", octave: 4, hz: 311.13 },
  { name: "E", octave: 4, hz: 329.63 },
  { name: "F", octave: 4, hz: 349.23 },
];

const STORE = "v4a-base-note";

export default function BaseNote() {
  const [idx, setIdx] = useState(7); // G3, mid-range for most voices
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const voicesRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  // Read after mount, so server and client render alike.
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORE);
      if (v !== null) {
        const n = Number(v);
        if (Number.isInteger(n) && n >= 0 && n < NOTES.length) {
          setIdx(n);
          setSaved(n);
        }
      }
    } catch {
      /* private window, or storage blocked */
    }
  }, []);

  const stop = useCallback(() => {
    const g = gainRef.current;
    const ctx = ctxRef.current;
    if (g && ctx) {
      // Fade out, or it clicks.
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    }
    const voices = voicesRef.current;
    voicesRef.current = [];
    gainRef.current = null;
    setPlaying(false);
    window.setTimeout(() => voices.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }), 180);
  }, []);

  const start = useCallback(
    (hz: number) => {
      // Built on a gesture, which is what the autoplay policy requires.
      let ctx = ctxRef.current;
      if (!ctx) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new Ctor();
        ctxRef.current = ctx;
      }
      void ctx.resume();

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.25);

      // Softens the upper harmonics so it sits under a voice.
      const tone = ctx.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.setValueAtTime(1600, ctx.currentTime);

      master.connect(tone);
      tone.connect(ctx.destination);

      // Fundamental, octave and fifth — a shruti box in miniature.
      const parts: [number, number, number][] = [
        [1, 0.6, 0],
        [1, 0.25, 1.5],   // a touch of detune gives it some life
        [2, 0.18, 0],
        [3, 0.08, 0],
      ];
      const made: OscillatorNode[] = [];
      for (const [mult, level, detune] of parts) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(hz * mult, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);
        const g = ctx.createGain();
        g.gain.setValueAtTime(level, ctx.currentTime);
        osc.connect(g);
        g.connect(master);
        osc.start();
        made.push(osc);
      }
      voicesRef.current = made;
      gainRef.current = master;
      setPlaying(true);
    },
    []
  );

  const toggle = () => (playing ? stop() : start(NOTES[idx].hz));

  // Changing note while it sounds should glide, not restart.
  const pick = (next: number) => {
    setIdx(next);
    const ctx = ctxRef.current;
    if (playing && ctx) {
      const hz = NOTES[next].hz;
      voicesRef.current.forEach((osc, i) => {
        const mult = [1, 1, 2, 3][i] ?? 1;
        osc.frequency.cancelScheduledValues(ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(hz * mult, ctx.currentTime + 0.08);
      });
    }
  };

  useEffect(() => () => { voicesRef.current.forEach((o) => { try { o.stop(); } catch { /* gone */ } }); }, []);

  const note = NOTES[idx];
  const label = `${note.name}${note.octave}`;

  return (
    <div>
      {/* The drone */}
      <div className="flex flex-col items-center rounded-3xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-6 py-8">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Stop the drone" : "Play the drone"}
          className={`flex h-24 w-24 items-center justify-center rounded-full border-2 transition ${
            playing
              ? "border-transparent bg-[var(--accent)] text-[#08111a]"
              : "border-[color-mix(in_srgb,var(--accent)_60%,transparent)] text-accent-ink hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
          }`}
        >
          {playing ? (
            <svg width="26" height="26" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="2.5" y="2" width="4" height="12" rx="1" />
              <rect x="9.5" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M3.5 1.8v12.4L14 8z" />
            </svg>
          )}
        </button>

        <p className="mt-5 font-serif text-5xl leading-none text-ink">{label}</p>
        <p className="mt-1.5 text-sm tabular-nums text-ink-3">{note.hz.toFixed(2)} Hz</p>
        <p className="mt-3 text-center text-sm text-ink-2">
          {playing ? "Hum along. Move up or down until it sits easily." : "Press play, then hum with it."}
        </p>
      </div>

      {/* Picking the note */}
      <div className="mt-6">
        <p className="eyebrow mb-2">Try a different note</p>
        <div className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
          {NOTES.map((n, i) => (
            <button
              key={`${n.name}${n.octave}`}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === idx}
              className={`shrink-0 rounded-xl border px-3 py-2.5 text-center transition ${
                i === idx
                  ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                  : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
              }`}
            >
              <span className="block font-serif text-base leading-none">{n.name}</span>
              <span
                className={`mt-0.5 block text-[0.6rem] ${i === idx ? "text-[#08111a]/70" : "text-ink-3"}`}
              >
                {n.octave}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Keeping it */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(STORE, String(idx));
              setSaved(idx);
            } catch {
              /* nothing to do if storage is blocked */
            }
          }}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[#08111a] transition"
        >
          This is my note
        </button>
        {saved !== null && (
          <span className="text-sm text-ink-2">
            Saved — <strong className="text-ink">{NOTES[saved].name}{NOTES[saved].octave}</strong>
            {saved !== idx && " (you have moved since)"}
          </span>
        )}
      </div>
    </div>
  );
}
