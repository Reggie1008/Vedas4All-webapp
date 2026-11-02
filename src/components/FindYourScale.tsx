"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Listens to someone chanting a line and tells them which note they are on.
 *
 * Veda chanting is pitched against one base note, so the useful question is
 * not "what note shall I take" but "what note do I already chant on". The
 * pitch is found by autocorrelation of the microphone signal, entirely in the
 * browser — nothing is recorded, and nothing leaves the device.
 */

const LINE = "oṃ śrī sā̱yīśva̍rāya̱ nama̍ḥ";

const NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

/** Hz -> note name, octave, and how many cents sharp or flat it sits. */
function describe(hz: number) {
  const midi = 69 + 12 * Math.log2(hz / 440);
  const nearest = Math.round(midi);
  const cents = Math.round((midi - nearest) * 100);
  return {
    name: NAMES[((nearest % 12) + 12) % 12],
    octave: Math.floor(nearest / 12) - 1,
    cents,
    midi: nearest,
  };
}

/**
 * YIN's cumulative mean normalised difference. A plain autocorrelation
 * rewards long lags and so reports sub-harmonics — a voice on G3 reads as
 * G2 — which this is built to avoid. Returns null when the signal is too
 * quiet or too noisy to trust, so silence never reads as a note.
 */
function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  let sumSquares = 0;
  for (let i = 0; i < buf.length; i++) sumSquares += buf[i] * buf[i];
  if (Math.sqrt(sumSquares / buf.length) < 0.012) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / 500));
  const maxLag = Math.min(Math.floor(sampleRate / 70), Math.floor(buf.length / 2));

  const diffs = new Float32Array(maxLag + 2);
  for (let lag = 1; lag <= maxLag + 1; lag++) {
    let sum = 0;
    for (let i = 0; i + lag < buf.length; i++) {
      const d = buf[i] - buf[i + lag];
      sum += d * d;
    }
    diffs[lag] = sum;
  }

  const cmnd = new Float32Array(maxLag + 2);
  cmnd[0] = 1;
  let running = 0;
  for (let lag = 1; lag <= maxLag + 1; lag++) {
    running += diffs[lag];
    cmnd[lag] = running === 0 ? 1 : (diffs[lag] * lag) / running;
  }

  // The first lag that dips below the threshold is the period — not the
  // deepest dip, which is often an octave down.
  let best = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    if (cmnd[lag] < 0.15) {
      while (lag + 1 <= maxLag && cmnd[lag + 1] < cmnd[lag]) lag++;
      best = lag;
      break;
    }
  }
  if (best < 0) {
    let lowest = Infinity;
    for (let lag = minLag; lag <= maxLag; lag++) {
      if (cmnd[lag] < lowest) {
        lowest = cmnd[lag];
        best = lag;
      }
    }
    if (lowest > 0.5) return null; // nothing periodic enough to call a pitch
  }

  let lag = best;
  if (best > minLag && best < maxLag) {
    const a = cmnd[best - 1];
    const b = cmnd[best];
    const c = cmnd[best + 1];
    const denom = a + c - 2 * b;
    if (denom !== 0) lag = best - (c - a) / (2 * denom);
  }

  const hz = sampleRate / lag;
  return hz >= 70 && hz <= 500 ? hz : null;
}

type Phase = "idle" | "asking" | "listening" | "done" | "denied" | "unsupported";

export default function FindYourScale() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [live, setLive] = useState<number | null>(null);
  const [result, setResult] = useState<{ hz: number; steadiness: number } | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      setSaved(localStorage.getItem("v4a-scale"));
    } catch {
      /* storage blocked */
    }
  }, []);

  const teardown = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const finish = useCallback(() => {
    const got = samplesRef.current;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    teardown();
    setLive(null);

    if (got.length < 8) {
      setPhase("idle");
      setResult(null);
      return;
    }
    // The median resists the odd octave error that creeps into any detector.
    const sorted = [...got].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    // How much of the chant sat within a semitone of that — i.e. how steady.
    const near = got.filter((h) => Math.abs(12 * Math.log2(h / median)) <= 0.5).length;
    setResult({ hz: median, steadiness: near / got.length });
    setPhase("done");
  }, [teardown]);

  const begin = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhase("unsupported");
      return;
    }
    setPhase("asking");
    setResult(null);
    samplesRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // The processing meant for speech would fight a sustained tone.
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      streamRef.current = stream;
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);

      setPhase("listening");
      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        const hz = detectPitch(buf, ctx.sampleRate);
        if (hz) {
          samplesRef.current.push(hz);
          setLive(hz);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setPhase("denied");
      teardown();
    }
  }, [teardown]);

  const shown = live ?? result?.hz ?? null;
  const note = shown ? describe(shown) : null;
  const listening = phase === "listening";

  return (
    <div>
      <p className="max-w-3xl text-pretty leading-relaxed text-ink-2">
        Veda chanting is pitched against a single base note rather than a melody. Chant the
        line below in your normal voice, and this will tell you which note you are on — so
        you can practise on the same one at home.
      </p>

      {/* What to chant */}
      <div className="mt-6 rounded-2xl border border-hairline px-5 py-5 sm:px-7">
        <p className="eyebrow mb-2">Chant this</p>
        <p className="iast-text-primary text-ink">{LINE}</p>
      </div>

      {/* The reading */}
      <div
        className={`mt-4 flex flex-col items-center rounded-3xl border px-6 py-8 transition ${
          listening
            ? "border-[color-mix(in_srgb,var(--accent)_70%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
            : "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
        }`}
      >
        {note ? (
          <>
            <p className="font-serif text-6xl leading-none text-ink">
              {note.name}
              <span className="align-super text-2xl text-ink-3">{note.octave}</span>
            </p>
            <p className="mt-2 text-sm tabular-nums text-ink-3">
              {shown!.toFixed(1)} Hz
              {note.cents !== 0 && (
                <> · {note.cents > 0 ? "+" : ""}{note.cents} cents</>
              )}
            </p>
          </>
        ) : (
          <p className="font-serif text-4xl leading-none text-ink-3">
            {listening ? "listening…" : "—"}
          </p>
        )}

        <p className="mt-4 min-h-[1.5rem] text-center text-sm text-ink-2">
          {phase === "idle" && "Press start, then chant the line above."}
          {phase === "asking" && "Waiting for permission to use the microphone…"}
          {listening && "Keep chanting. Press done when you reach the end of the line."}
          {phase === "done" &&
            result &&
            (result.steadiness >= 0.7
              ? "Steady. This is your note."
              : "Your pitch moved about — chant it again, holding one note.")}
          {phase === "denied" &&
            "The microphone was not allowed. Permit it in your browser and try again."}
          {phase === "unsupported" && "This browser cannot reach the microphone."}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {!listening ? (
            <button
              type="button"
              onClick={begin}
              disabled={phase === "asking"}
              className="rounded-full bg-[var(--accent)] px-7 py-3 text-base font-semibold text-[#08111a] transition disabled:opacity-40"
            >
              {phase === "done" ? "Chant again" : "Start"}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-full border-2 border-[color-mix(in_srgb,var(--accent)_70%,transparent)] px-7 py-3 text-base font-semibold text-ink transition"
            >
              Done
            </button>
          )}

          {phase === "done" && result && (
            <button
              type="button"
              onClick={() => {
                const d = describe(result.hz);
                const label = `${d.name}${d.octave}`;
                try {
                  localStorage.setItem("v4a-scale", label);
                  setSaved(label);
                } catch {
                  /* storage blocked */
                }
              }}
              className="rounded-full border border-hairline px-5 py-3 text-sm font-semibold text-ink-2 transition hover:text-ink"
            >
              Save as my scale
            </button>
          )}
        </div>

        {saved && (
          <p className="mt-3 text-sm text-ink-2">
            Your scale: <strong className="text-ink">{saved}</strong>
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-3">
        Nothing is recorded and nothing is sent anywhere. The sound is measured on your own
        device and discarded as it goes.
      </p>

      <section className="mt-10">
        <h2 className="eyebrow mb-3 flex items-center gap-2.5">
          <span aria-hidden className="h-px w-6 bg-[var(--accent)]" />
          Why it matters
        </h2>
        <div className="space-y-4 leading-relaxed text-ink-2">
          <p>
            The svaras are not fixed pitches — they are positions{" "}
            <em>relative to your base note</em>. Udātta sits on it, anudātta below it, and
            svarita moves. Chanting on a different note each day means learning those
            positions again each day.
          </p>
          <p>
            It matters in company too. When a group chants on one note the vibrations
            reinforce one another rather than fight, which is where the volume and the
            steadiness come from.
          </p>
        </div>
      </section>
    </div>
  );
}
