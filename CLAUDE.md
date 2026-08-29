# Vedas4All — Chant Library

## What this is

A web app supporting the Veda chanting classes run by Vedas4All
(vedas4all.org), a South African non-profit inspired by the teachings of
Sri Sathya Sai Baba. Mission: taking the Vedas to every household in
South Africa.

The app puts every chant we teach in one place: Sanskrit text with svara
marks, transliteration, word-by-word meaning, audio at two speeds, and
the YouTube tutorial.

## Who uses it

Students in our online classes — all faiths, all backgrounds, all ages,
across KwaZulu-Natal, Gauteng and the Western Cape. Many join class from
a **laptop** while following the chant text on screen. Others use phones
on limited mobile data.

Design for both properly. Not a phone app stretched wide.

- **Laptop (≥1024px):** two-column layout — Sanskrit text on the left,
  meanings on the right, so a student can read along while the class runs
  in another window. Assume the browser is sharing the screen with Zoom
  or YouTube, so the app must stay readable at roughly half screen width.
- **Phone:** single column, large tap targets, text large enough to read
  at arm's length while sitting.
- Keyboard shortcuts on desktop: space to play/pause, arrow keys to seek.

## Non-negotiables

1. **Svara marks must render correctly.** Bundle Noto Serif Devanagari
   as a local font file — do not rely on system fonts. Verify these
   render at large sizes and never get clipped by line-height:
   - U+0952 anudātta (line below)
   - U+0951 svarita (line above)
   - U+1CDA compound/double svarita
   - U+A8F3 Vedic anusvāra ꣳ
   Devanagari needs more line-height than Latin. Test with the Ganapati
   Prarthana text, which uses all four marks.
2. **Works on bad connections.** Offline-first PWA. Once a chant is
   opened it stays readable with no connection. Audio cached on demand,
   never auto-downloaded. YouTube is click-to-load only — never an
   auto-embedded iframe.
3. **Audio player must support A–B loop and slow/normal speed.**
   Repeating one line until it settles is how chanting is actually
   learnt. This matters more than any other feature.
4. **Font size control** on every chant page. Older students need it.

## Tone and framing

- Universal. Accessible to someone of any faith or none. Avoid
  India-specific or sectarian framing.
- Chanting is framed as an offering to the world and to Mother Nature —
  not as personal wellness, not as religious ritual, not as
  self-improvement.
- Each chant carries a short "universal reflection" — the value it holds
  for anyone living today.
- Never present one tradition as superior. Where the booklets draw
  parallels to other traditions, present them as parallels, with the
  source named.

## Content

All chant content lives in `/content/chants.json`. No database. No CMS.
Editing that file is how content gets updated.

Do not invent, alter, or "improve" Sanskrit text, transliteration, or
meanings. They are transcribed from our teaching booklets. If something
looks wrong, flag it — do not silently correct it.

Categories are free text. Do not add difficulty or level fields.

## Brand

- Gold `#DDA83F`
- Powder blue `#CEDEEB`
- Green `#008037`
- Deep navy `#2B5773`

Footer on every page:
`Samasta Lokāḥ Sukhino Bhavantu` — vedas4all.org

## Brand assets

All in `/public/brand/`:

- `logo.svg` — primary logo with wordmark. Header, top left, links home.
- `logo-mark.png` — square mark, no text. App icon and favicon source.
- `icon-192.png`, `icon-512.png` — PWA manifest icons.
- `apple-touch-icon.png` — 180×512, iOS home screen.
- `og-image.png` — 1200×630 social preview.

Open Graph tags are required on every page. Links to this app get shared
constantly in WhatsApp groups, and a chant link with no preview image
looks broken. Each chant page should set its own OG title (the chant
name) against the shared `og-image.png`.

## Deployment

Deployed to Vercel at **learn.vedas4all.org**. The main site
(vedas4all.org) stays on Wix and links across.

This means:

- Every page must have a clean, shareable, permanent URL —
  `learn.vedas4all.org/chant/gayatri-mantra` — so a specific chant can
  be pasted directly into a WhatsApp group.
- Header carries a "← vedas4all.org" link back to the main site.
- Set `metadataBase` to `https://learn.vedas4all.org`.
- Static export is preferred. No server-side rendering, no API routes,
  nothing that needs a running server.

## Stack

Next.js (App Router) + Tailwind. Static export. No user accounts, no
login, no analytics that track individuals.
