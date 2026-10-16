"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Shared ground between the audio player and the verses listed beside it.
 *
 * The player owns the <audio> element and hands it over here on mount; the
 * verses ask for a stretch of it to be played. They are siblings in the tree,
 * so neither can reach the other directly.
 */
type VerseAudio = {
  /** Called by the player once its element exists. */
  register: (el: HTMLAudioElement | null) => void;
  /** Play from `start`, stopping at `end` if one is given. */
  playRange: (start: number, end?: number) => void | Promise<void>;
  stop: () => void;
  /** The playhead read straight off the element, for marking timings
   *  more precisely than the ~4/sec timeupdate event allows. */
  now: () => number;
  currentTime: number;
  isPlaying: boolean;
  /** False until a player has registered, so verses can hide their buttons. */
  hasAudio: boolean;
};

const Ctx = createContext<VerseAudio | null>(null);

export function VerseAudioProvider({ children }: { children: React.ReactNode }) {
  const elRef = useRef<HTMLAudioElement | null>(null);
  const stopAtRef = useRef<number | null>(null);
  // Distinguishes our own seek from the listener dragging the scrubber.
  const selfSeekRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  const register = useCallback((el: HTMLAudioElement | null) => {
    elRef.current = el;
    setHasAudio(Boolean(el));
  }, []);

  // The listeners live here rather than in the player so that a line can be
  // stopped at its end without the player needing to know about verses.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    function onTimeUpdate() {
      if (!el) return;
      setCurrentTime(el.currentTime);
      const stopAt = stopAtRef.current;
      if (stopAt !== null && el.currentTime >= stopAt) {
        stopAtRef.current = null;
        el.pause();
      }
    }
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    // A drag on the scrubber means the listener has taken over again — but
    // the seek playRange does itself must not cancel the stop point.
    const onSeeking = () => {
      if (selfSeekRef.current) selfSeekRef.current = false;
      else stopAtRef.current = null;
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("seeking", onSeeking);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("seeking", onSeeking);
    };
  }, [hasAudio]);

  const playRange = useCallback(async (start: number, end?: number) => {
    const el = elRef.current;
    if (!el) return;
    // Pause before seeking. Seeking while a play request is in flight
    // rejects it, and playing before seeking sounds a moment of the wrong
    // part of the recording before the playhead lands.
    el.pause();
    selfSeekRef.current = true;
    el.currentTime = start;
    stopAtRef.current = end ?? null;
    try {
      await el.play();
    } catch {
      // Autoplay refused, or the element went away mid-flight.
      selfSeekRef.current = false;
      stopAtRef.current = null;
    }
  }, []);

  const now = useCallback(() => elRef.current?.currentTime ?? 0, []);

  const stop = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    stopAtRef.current = null;
    el.pause();
  }, []);

  const value = useMemo(
    () => ({ register, playRange, stop, now, currentTime, isPlaying, hasAudio }),
    [register, playRange, stop, now, currentTime, isPlaying, hasAudio]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Null outside a provider, so the verses simply render without buttons. */
export function useVerseAudio(): VerseAudio | null {
  return useContext(Ctx);
}
