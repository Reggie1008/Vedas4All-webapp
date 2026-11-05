"use client";

import { useEffect, useState } from "react";
import { prose } from "@/lib/richText";

/**
 * The meaning of a chant, in whichever South African language the reader
 * wants it. English is always there; the rest appear only where someone has
 * translated that chant, so a language is never offered empty.
 *
 * The choice is remembered across chants, since a Xhosa speaker reading one
 * chant in Xhosa will want the next one the same way — but it falls back to
 * English on a chant that has not been translated yet.
 */

/** All eleven official languages, so a new translation needs no code change. */
const LANGUAGES: Record<string, string> = {
  en: "English",
  af: "Afrikaans",
  nr: "isiNdebele",
  xh: "isiXhosa",
  zu: "isiZulu",
  nso: "Sepedi",
  st: "Sesotho",
  ts: "Xitsonga",
  tn: "Setswana",
  ss: "siSwati",
  ve: "Tshivenḓa",
};

const STORE = "v4a-meaning-language";

export default function MeaningLanguage({
  english,
  translations,
}: {
  english: string;
  translations?: Record<string, string>;
}) {
  const available = ["en", ...Object.keys(translations ?? {}).filter((k) => translations![k])];
  const [lang, setLang] = useState("en");

  // Read after mount, so server and client render the same markup.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved && available.includes(saved)) setLang(saved);
    } catch {
      /* storage blocked — English stands */
    }
    // `available` is derived from props that do not change for a given chant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(next: string) {
    setLang(next);
    try {
      localStorage.setItem(STORE, next);
    } catch {
      /* nothing to do */
    }
  }

  const text = lang === "en" ? english : (translations?.[lang] ?? english);

  return (
    <>
      {available.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Language">
          {available.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => pick(code)}
              aria-pressed={lang === code}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                lang === code
                  ? "border-transparent bg-[var(--accent)] text-[#08111a]"
                  : "border-hairline text-ink-3 hover:border-hairline-hi hover:text-ink"
              }`}
            >
              {LANGUAGES[code] ?? code}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3" lang={lang}>
        {prose(text, "leading-relaxed text-ink-2")}
      </div>
    </>
  );
}
