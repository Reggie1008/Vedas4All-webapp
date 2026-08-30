import data from "../../content/fundamentals.json";

export interface Place {
  id: string;
  label: string;
  where: string;
  vowels: string[];
  varga: string[];
  other: { sound: string; kind: string; example?: string }[];
  counts: { vowels: number; consonants: number };
}

/** One sound meeting another and changing: the shape of both continuity modules. */
export interface SandhiGroup {
  id: string;
  label: string;
  /** What the incoming sound turns into here, e.g. "ṅa". */
  result?: string;
  rules: { from: string; to: string }[];
  examples: { text: string; note?: string }[];
  note?: string;
}

export type Block =
  | { type: "levels"; heading: string; intro?: string; items: { sanskrit: string; english: string; seat: string }[] }
  | { type: "verse"; heading: string; iast: string; notes: { term: string; meaning: string }[] }
  | { type: "articulation"; heading: string; intro?: string; places: Place[]; footnotes?: string[] }
  | { type: "aspirated"; heading: string; intro?: string; pairs: { sound: string; example: string }[] }
  | { type: "practice"; heading: string; intro?: string; words: { word: string; focus: string }[] }
  | { type: "sandhi"; heading: string; intro?: string; groups: SandhiGroup[]; footnotes?: string[] }
  | { type: "rule"; heading: string; intro?: string; transforms?: { from: string; to: string; note?: string }[]; examples?: { text: string; note?: string }[]; footnotes?: string[] }
  | { type: "points"; heading: string; intro?: string; forms?: { glyph: string; label: string }[]; items: string[] }
  | { type: "recap"; heading: string; intro?: string; stats: { value: string; label: string }[] }
  | { type: "guides"; heading: string; intro?: string; items: { label: string; text?: string; examples?: string[] }[]; footnotes?: string[] }
  | { type: "figures"; heading: string; intro?: string; items: { src: string; alt: string; caption?: string }[]; footnotes?: string[] }
  | { type: "next"; heading: string; items: { sound: string; label: string; place: string }[] };

export interface Module {
  id: string;
  order: number;
  module: string;
  title: string;
  subtitle?: string;
  summary: string;
  quote?: { text: string; attribution: string };
  blocks: Block[];
  source?: string;
}

export const modules: Module[] = (data as Module[])
  .slice()
  .sort((a, b) => a.order - b.order);

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

/** Accent used for the Fundamentals side of the portal. */
export const FUNDAMENTALS_ACCENT = "#7BC5F0";
