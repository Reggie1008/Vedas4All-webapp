import React from "react";

/**
 * A deliberately tiny Markdown subset for the prose fields in
 * content/chants.json:
 *
 *   **bold**   ->  <strong>
 *   *italic*   ->  <em>
 *   ***both*** ->  <strong><em>
 *
 * Parsed into React elements rather than injected as HTML, so nothing
 * in the content file can inject markup — React escapes the text
 * either way. Anything that isn't a complete, matched pair is left
 * exactly as typed, so a stray asterisk shows as an asterisk.
 */

// Order matters: the three-star form must be tried before the two- and
// one-star forms, and ** before *, or the shorter pattern wins first.
// [\s\S] rather than . with the /s flag, which needs a newer compile target.
const TOKEN = /\*\*\*([\s\S]+?)\*\*\*|\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*/g;

export function rich(text: string | undefined | null): React.ReactNode {
  if (!text) return text ?? null;
  if (!text.includes("*")) return text;

  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));

    const [, both, bold, italic] = m;
    if (both !== undefined) {
      out.push(
        <strong key={key++}>
          <em>{both}</em>
        </strong>
      );
    } else if (bold !== undefined) {
      out.push(<strong key={key++}>{bold}</strong>);
    } else {
      out.push(<em key={key++}>{italic}</em>);
    }
    last = start + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out.length === 1 ? out[0] : out;
}

/**
 * The same subset, but for fields long enough to be written in
 * paragraphs. A blank line in the JSON starts a new one. Returns the
 * paragraphs themselves, so the caller must not wrap this in a <p>.
 */
export function prose(
  text: string | undefined | null,
  className?: string
): React.ReactNode {
  if (!text) return null;
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paras.length <= 1) return <p className={className}>{rich(text)}</p>;
  return paras.map((p, i) => (
    <p key={i} className={className}>
      {rich(p)}
    </p>
  ));
}
