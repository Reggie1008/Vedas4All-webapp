import data from "../../content/vedas101.json";

export interface Quote {
  text: string;
  attribution: string;
}

export interface LinkTo {
  href: string;
  label: string;
}

export type Block =
  | { type: "mission"; heading?: string; label: string; text: string }
  /** Paragraphs beginning "## " are sub-headings within the story. */
  | {
      type: "story";
      heading: string;
      eyebrow?: string;
      source?: string;
      images?: string[];
      paragraphs: string[];
      lesson?: { heading?: string; lead: string; paragraphs?: string[] };
    }
  | {
      type: "quiz";
      heading?: string;
      question: string;
      options: string[];
      answer: number;
      explanation?: Quote;
      note?: string;
      /** Show the symbols of the world's faiths with the answer. */
      symbols?: boolean;
      link?: LinkTo;
    }
  | ({ type: "quote"; heading?: string } & Quote)
  | {
      type: "definition";
      term: string;
      meaning: string;
      root: string;
      rootMeaning: string;
      text: string;
    }
  | {
      type: "truths";
      heading: string;
      items: { sanskrit: string; english: string; parallel?: string }[];
    }
  | {
      type: "term";
      term: string;
      gloss?: string;
      quote?: Quote;
      points?: string[];
      /** Titles of books that do have authors — the contrast for Apaurushaya. */
      books?: string[];
      /** Two ends of the line of hearing, for Shruti. */
      relay?: [string, string];
    }
  | { type: "metres"; heading: string; intro?: string; items: { name: string; syllables: number }[] }
  | { type: "syllables"; heading: string; intro?: string; lines: string[][] }
  | {
      type: "vedas";
      heading: string;
      intro?: string;
      items: { name: string; letter: string; points: string[]; link?: LinkTo }[];
    }
  | {
      type: "chants";
      heading: string;
      intro?: string;
      items: {
        title: string;
        subtitle?: string;
        text?: string;
        link?: LinkTo;
        lines: { sanskrit?: string; english: string }[];
      }[];
    }
  | { type: "chain"; heading: string; items: string[] }
  | {
      type: "facts";
      items: { eyebrow: string; text: string }[];
      footnote?: string;
      link?: LinkTo;
    };

export interface Part {
  id: string;
  title: string;
  summary: string;
  blocks: Block[];
}

interface Course {
  title: string;
  intro: string;
  source: string;
  parts: Part[];
}

export const course = data as Course;
export const parts: Part[] = course.parts;

export function getPart(id: string): { part: Part; index: number } | undefined {
  const index = parts.findIndex((p) => p.id === id);
  return index === -1 ? undefined : { part: parts[index], index };
}

/** Accent for the Vedas 101 side of the portal: the brand green, lifted
 *  enough to read on the dark canvas (--accent-ink darkens it on light). */
export const VEDAS101_ACCENT = "#4FB57A";
