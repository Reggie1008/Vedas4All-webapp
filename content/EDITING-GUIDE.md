# Editing `chants.json`

The whole file uses **one scheme, taken from the SB IAST booklets**. Those
booklets were checked directly (their PDF text layer), and they use exactly
three marks. Use these three and nothing else.

## The three marks

| Accent | Looks like | Character to type | JSON `\u` escape | Unicode name |
|---|---|---|---|---|
| **Anudātta** (low) | a̱ — line *below* | `̱` | `̱` | COMBINING MACRON BELOW |
| **Svarita** (falling) | a̍ — one line *above* | `̍` | `̍` | COMBINING VERTICAL LINE ABOVE |
| **Double svarita** | a̎ — two lines *above* | `̎` | `̎` | COMBINING DOUBLE VERTICAL LINE ABOVE |

**Udātta is not marked.** In this notation the unmarked syllable is the
udātta, so there is no character to type for it.

## The rule that matters

The accent goes **immediately after** the vowel it belongs to — including
after a long vowel that is already a single character.

```
ga  +  ̱   ->  ga̱          (short vowel + anudātta)
ā   +  ̎   ->  ā̎           (long vowel + double svarita)
pa  +  ̍   ->  pa̍          (short vowel + svarita)
```

Long vowels are **one** character, not two. Type `ā` (`ā`), then the
accent. Do **not** type `a` + macron + accent.

```json
"iast": "oṃ ga̱ṇānā̎ntvā ga̱ṇapa̍tiṃ havāmahe"
```

Written as escapes, that same line begins:

```json
"iast": "oṃ ga̱ṇānā̎ntvā ..."
```

Both forms are identical once parsed. **Escapes are never required** — type
the characters directly if that is easier. They are only useful if you want
the file to stay pure ASCII.

## Easiest way to enter them

Copy the mark from the table above and paste it after the vowel. That is the
most reliable method, because the marks are invisible on their own — a bare
`̱` looks like nothing until it attaches to a letter.

On macOS you can also enable **Unicode Hex Input** (System Settings →
Keyboard → Input Sources → Add → Others → Unicode Hex Input), then hold
**⌥ Option** and type the four digits: `0331`, `030D`, `030E`.

## Why a mark disappears when you edit

This is the most common problem, and it is silent.

The mark is a **separate, invisible character** that sits after the letter.
`de̱` is not one character — it is `d`, then `e`, then the mark. So:

- One press of **Backspace** after `de̱` deletes the *mark*, not the `e`. The
  text still looks like `de`, so nothing appears to have gone wrong.
- Retyping the word by hand gives you `de` with no mark, because the mark is
  not on your keyboard.
- Selecting "just the letter" with the mouse often grabs the mark too.

This is exactly how `de̱vasya̍` in the Gāyatrī became `devasya̍` — the line
under the `e` was deleted while the line was being edited, and it was
invisible until someone noticed the accent was missing on the page.

**If a mark goes missing:** put the cursor immediately after the letter and
paste the mark from the table above. Do not retype the letter.

## Do not use these

These all *look* nearly identical on screen but are different characters, and
mixing them breaks search, sorting and copy-paste. They were all removed from
this file on 2026-08-27.

| Wrong | Why | Use instead |
|---|---|---|
| `̠` COMBINING MINUS SIGN BELOW | was mixed with `̱` for anudātta | `̱` |
| `᳚` VEDIC TONE DOUBLE SVARITA | correct in principle, but **not in Gentium Plus** — renders as a blank box | `̎` |
| `̲` COMBINING LOW LINE | a general-IAST convention, not the booklets' | `̱` |
| `̀` / `́` grave / acute | a general-IAST convention, not the booklets' | `̍` |

## Two things to keep in mind

**Punctuation.** Some lines use the Devanagari daṇḍa `।` `॥` and others use
ASCII `|` `||`. Both render fine. The daṇḍa is not in Gentium Plus, so it
falls through to Noto Serif Devanagari — which is already loaded, so it costs
nothing. Just be consistent within a chant.

**File encoding.** Save as **UTF-8 without BOM**. It already is; most editors
keep it that way, but "UTF-8 with BOM" will break the first line.

## Bold and italics in the prose fields

Use asterisks. They work in every prose field — `overview`, `structure`,
`teachingNote`, `universalReflection`, each verse's `meaning`, every
`meaning` in `wordMeanings` and `words`, `quotes`, `parallels`, and all the
Sarvadharma text.

| You type | You get |
|---|---|
| `**important**` | **important** |
| `*gentle emphasis*` | *gentle emphasis* |
| `***both at once***` | ***both at once*** |

```json
"overview": "The word **krimi** works on *two levels at once*."
```

Two things to know:

- A lone asterisk is left alone — `2 * 3` stays as typed. Only complete,
  matched pairs are turned into formatting.
- It does **not** work in `iast` or `devanagari`. The chant text is
  deliberately left exactly as transcribed, so an asterisk there would
  show as an asterisk.

## Chants taught in more than one video

For a single video, keep using `youtubeId`. For a chant taught across
several sessions, use `videos` instead — the parts appear as tabs above the
player, and only the part someone clicks is ever loaded:

```json
"videos": [
  { "id": "AbC123", "label": "Part 1" },
  { "id": "DeF456", "label": "Part 2" },
  { "id": "GhI789", "label": "Part 3" }
]
```

The `id` is the part of the YouTube URL after `v=` — in
`youtube.com/watch?v=AbC123` the id is `AbC123`. `label` is optional and
defaults to "Part 1", "Part 2" and so on. A part with an empty `id` is
skipped, so you can add the slots now and fill the ids in later.

If both `videos` and `youtubeId` are present, `videos` wins.

## Recording credit under the audio player

Each chant's `audio` block takes an optional `source`. Fill it in and it
appears beneath the loop controls as "Recording: …". Leave it empty and
nothing shows.

```json
"audio": {
  "normal": "/audio/shivopasana.mp3",
  "slow": "",
  "source": "Chanted by the Vedas4All teachers, Durban, 2025"
}
```

Leave `slow` empty when there is no slow recording — the Normal/Slow switch
hides itself rather than offering a button that does nothing.

## Checking your work

From the app folder, this prints every accent mark in the file. Anything
other than U+0331, U+030D and U+030E means something slipped in:

```bash
node -e "const d=require('fs').readFileSync('content/chants.json','utf8');const c={};for(const ch of d){const p=ch.codePointAt(0);if((p>=0x0300&&p<=0x036F)||(p>=0x1CD0&&p<=0x1CFF))c[p]=(c[p]||0)+1}Object.entries(c).sort((a,b)=>b[1]-a[1]).forEach(([p,n])=>console.log('U+'+(+p).toString(16).toUpperCase().padStart(4,'0'),n))"
```

Expected output (after Śivopāsana was added): `U+0331 350`, `U+030D 237`, `U+030E 19`.
