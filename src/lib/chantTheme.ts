/**
 * Presentation metadata for each chant — deliberately kept out of
 * content/chants.json, which stays purely the transcribed teaching text.
 *
 * `accent` is sampled from the chant's own YouTube thumbnail (the most
 * saturated hue in the image), so each page carries the colour of its
 * own video: fire for Gaṇapati, sunrise gold for Gāyatrī, and so on.
 */
export interface ChantTheme {
  /** Basename in /public/thumbnails, or null when no video art exists yet. */
  thumbnail: string | null;
  /** Bright enough to read as a highlight on the dark surface. */
  accent: string;
}

const THEMES: Record<string, ChantTheme> = {
  "ganapati-prarthana": { thumbnail: "ganapati-prarthana", accent: "#FF8A3D" },
  "gayatri-mantra": { thumbnail: "gayatri-mantra", accent: "#F0B84A" },
  "shanti-mantra": { thumbnail: "shanti-mantra", accent: "#EFC98F" },
  "kshama-prarthana": { thumbnail: "kshama-prarthana", accent: "#86B0D4" },
  mantrapushpam: { thumbnail: "mantrapushpam", accent: "#E85FD0" },
  "sai-gayatri": { thumbnail: null, accent: "#35C46E" },
  shivopasana: { thumbnail: "shivopasana", accent: "#8B9BF0" },
  "krimi-nashaka": { thumbnail: "krimi-nashaka", accent: "#5CC8DC" },
  "saha-na-vavatu": { thumbnail: "saha-na-vavatu", accent: "#EDC55B" },
  "sarvadevata-gayatri": { thumbnail: "sarvadevata-gayatri", accent: "#A98AE8" },
  "food-prayer": { thumbnail: "food-prayer", accent: "#DD8A5F" },
  "purusha-suktam": { thumbnail: null, accent: "#6FD3B8" },
  "sri-rudram": { thumbnail: "sri-rudram", accent: "#86C07C" },
  "durga-suktam": { thumbnail: "durga-suktam", accent: "#E09250" },
  "medha-suktam": { thumbnail: null, accent: "#D9A6E0" },
};

const FALLBACK: ChantTheme = { thumbnail: null, accent: "#DDA83F" };

export function getChantTheme(id: string): ChantTheme {
  return THEMES[id] ?? FALLBACK;
}
