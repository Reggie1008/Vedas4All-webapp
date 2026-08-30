import chantsData from "../../content/chants.json";

export interface Verse {
  devanagari: string;
  iast: string;
  source?: string;
  /** Overrides the positional counter, for booklets that number their
   *  own verses (Sarvadevatā Gāyatrī runs 1-12 then jumps to 18). */
  number?: string;
  /** Per-stanza translation, where the booklet provides one. */
  meaning?: string;
  /** Word-by-word glosses for this stanza only. */
  words?: WordMeaning[];
}

/** One faith's reading of a Mantrapuṣpaṃ stanza, per the Sarvadharma teaching. */
export interface SarvadharmaEntry {
  tradition: string;
  stanza: number;
  keyword: string;
  text: string;
  saiQuote?: string;
  chant?: string;
  chantMeaning?: string;
}

export interface Sarvadharma {
  emblem: string;
  intro: string;
  source?: string;
  entries: SarvadharmaEntry[];
  closing?: string;
  closingQuote?: Quote;
}

export interface WordMeaning {
  word: string;
  meaning: string;
}

export interface Parallel {
  tradition: string;
  text: string;
  source: string;
}

/** One tutorial video. Chants taught over several sessions have one per part. */
export interface ChantVideo {
  id: string;
  label?: string;
}

export interface Quote {
  text: string;
  attribution: string;
}

/** One anuvāka of a sectioned chant, with its own recording and video. */
export interface Anuvaka {
  n: number;
  label: string;
  verses: Verse[];
  audio?: { normal: string; slow?: string; source?: string };
  videoId?: string;
}

/** Namakam / Chamakam. Only Śrī Rudram uses this shape. */
export interface ChantSection {
  id: string;
  label: string;
  note?: string;
  anuvakas: Anuvaka[];
}

/**
 * A sustained reading of one chant against the life of a single figure —
 * distinct from `parallels`, which collects short quotations from many
 * traditions. The emblem is drawn once for the whole section.
 */
export interface FigureParallel {
  /** Drives the emblem, e.g. "Judaism". */
  tradition: string;
  figure: string;
  heading: string;
  intro?: string;
  items: { title: string; text: string }[];
  source?: string;
}

export interface Chant {
  id: string;
  title: {
    sanskrit: string;
    iast: string;
    english: string;
  };
  category: string;
  order: number;
  note?: string;
  verses: Verse[];
  overview: string;
  structure?: string;
  teachingNote?: string;
  wordMeanings: WordMeaning[];
  universalReflection: string;
  quotes?: Quote[];
  parallels?: Parallel[];
  /** A sustained parallel with one figure, e.g. Durgā Sūktam and Moses. */
  figureParallel?: FigureParallel;
  sarvadharma?: Sarvadharma;
  /** Present only for chants recited in sections of anuvākas (Śrī Rudram). */
  sections?: ChantSection[];
  audio: { normal: string; slow?: string; /** Attribution for the recording, e.g. who chanted it. */ source?: string };
  /** Single tutorial video. Use `videos` instead when a chant is taught in parts. */
  youtubeId?: string;
  videos?: ChantVideo[];
  booklet: string;
}

export const chants: Chant[] = (chantsData as Chant[]).slice().sort((a, b) => a.order - b.order);

export function getChantById(id: string): Chant | undefined {
  return chants.find((c) => c.id === id);
}

