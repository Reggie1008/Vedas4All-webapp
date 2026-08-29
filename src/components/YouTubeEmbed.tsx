"use client";

import { useState } from "react";
import type { ChantVideo } from "@/lib/chants";

/**
 * Click-to-load only — never an auto-embedded iframe, and the poster is
 * served from our own origin rather than img.youtube.com, so opening a
 * chant costs nothing to YouTube until the student asks for the video.
 *
 * Handles chants taught across several parts: the parts appear as tabs
 * and only the selected one is ever loaded.
 */
export default function YouTubeEmbed({
  videos,
  thumbnail,
}: {
  videos: ChantVideo[];
  thumbnail: string | null;
}) {
  const [selected, setSelected] = useState(0);
  const [loaded, setLoaded] = useState<number | null>(null);

  const usable = videos.filter((v) => v.id);
  if (usable.length === 0) return null;

  const current = usable[Math.min(selected, usable.length - 1)];
  const isLoaded = loaded === selected;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline">
      {usable.length > 1 && (
        <div className="hide-scrollbar flex gap-1.5 overflow-x-auto border-b border-hairline p-2">
          {usable.map((v, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(i);
                setLoaded(null);
              }}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                i === selected
                  ? "bg-[var(--accent)] text-[#08111a]"
                  : "text-ink-2 hover:bg-surface-hi hover:text-ink"
              }`}
            >
              {v.label || `Part ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-video w-full bg-elevated">
        {isLoaded ? (
          <iframe
            key={current.id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${current.id}?autoplay=1`}
            title={current.label || "Chant tutorial video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setLoaded(selected)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play ${current.label || "the tutorial video"} on YouTube`}
          >
            {thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/thumbnails/${thumbnail}.webp`}
                srcSet={`/thumbnails/${thumbnail}-sm.webp 640w, /thumbnails/${thumbnail}.webp 1280w`}
                sizes="(max-width: 1024px) 100vw, 620px"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform duration-300 ease-smooth group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="#08111a" aria-hidden className="ml-1">
                  <path d="M3 1.8v12.4a.6.6 0 0 0 .92.5l9.7-6.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
                </svg>
              </span>
            </span>
            <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 drop-shadow">
              {usable.length > 1
                ? `Watch ${current.label || `part ${selected + 1}`} on YouTube`
                : "Watch the tutorial on YouTube"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
