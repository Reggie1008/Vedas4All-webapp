/**
 * Emblems for the traditions quoted alongside each chant, echoing the
 * Sarvadharma symbol on the Mantrapuṣpaṃ artwork.
 *
 * Drawn as inline SVG rather than emoji so they render identically on
 * every device, inherit the chant's accent colour, and stay legible at
 * the small size they appear in.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Christianity() {
  return (
    <g {...STROKE}>
      <path d="M12 3v18M6.5 8.5h11" />
    </g>
  );
}

function Islam() {
  return (
    <g {...STROKE}>
      {/* Crescent: outer arc swept back by a tighter inner arc */}
      <path d="M16.2 4.6a8 8 0 1 0 0 14.8 9.3 9.3 0 0 1 0-14.8Z" />
      <path d="m19.4 9.4.95 1.93 2.13.31-1.54 1.5.36 2.12-1.9-1-1.9 1 .36-2.12-1.54-1.5 2.13-.31Z" />
    </g>
  );
}

function Judaism() {
  return (
    <g {...STROKE}>
      <path d="M12 3.2 20 17.4H4Z" />
      <path d="M12 20.8 4 6.6h16Z" />
    </g>
  );
}

function Buddhism() {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return {
      x1: 12 + Math.cos(a) * 3,
      y1: 12 + Math.sin(a) * 3,
      x2: 12 + Math.cos(a) * 8.6,
      y2: 12 + Math.sin(a) * 8.6,
    };
  });
  return (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.6" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
      ))}
    </g>
  );
}

function Sikhism() {
  return (
    <g {...STROKE}>
      {/* Khanda: central double-edged sword, chakkar, two flanking kirpans */}
      <path d="M12 2.5v19" />
      <circle cx="12" cy="13" r="4.6" />
      <path d="M7 21c-3.2-3.6-2.6-9.4.9-12.6" />
      <path d="M17 21c3.2-3.6 2.6-9.4-.9-12.6" />
    </g>
  );
}

function Zoroastrianism() {
  return (
    <g {...STROKE}>
      {/* Sacred fire in its chalice */}
      <path d="M12 3.6c1.7 2.1 2.7 3.4 2.7 4.8a2.7 2.7 0 1 1-5.4 0c0-1.4 1-2.7 2.7-4.8Z" />
      <path d="M7.8 12.8h8.4l-1.3 4.8H9.1Z" />
      <path d="M12 17.6v2.6M9 20.4h6" />
    </g>
  );
}

/** Ensō — used for Japanese teaching, which is a proverb, not a faith. */
function Enso() {
  return (
    <g {...STROKE}>
      <path d="M15.6 4.7a8.6 8.6 0 1 0 4 6.6" />
    </g>
  );
}

function Generic() {
  return (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="8.6" />
    </g>
  );
}

const SYMBOLS: { match: string[]; render: () => React.ReactElement }[] = [
  { match: ["christian", "catholic", "bible"], render: Christianity },
  { match: ["islam", "muslim", "qur"], render: Islam },
  { match: ["jud", "jewish", "hebrew", "torah"], render: Judaism },
  { match: ["buddh"], render: Buddhism },
  { match: ["sikh"], render: Sikhism },
  { match: ["zoroastr", "parsi"], render: Zoroastrianism },
  { match: ["japan"], render: Enso },
];

export default function TraditionSymbol({
  tradition,
  className = "",
}: {
  tradition: string;
  className?: string;
}) {
  const key = tradition.toLowerCase();

  // Hinduism uses the Devanagari glyph — the font is already loaded and
  // it reads far better than any outline of the same mark.
  if (/hindu|vedic|sanatan/.test(key)) {
    return (
      <span
        aria-hidden
        className={`font-devanagari leading-none ${className}`}
        style={{ fontSize: "1.15em" }}
      >
        ॐ
      </span>
    );
  }

  const entry = SYMBOLS.find((s) => s.match.some((m) => key.includes(m)));
  const Render = entry?.render ?? Generic;

  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <Render />
    </svg>
  );
}
