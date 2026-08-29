# START HERE

This folder is the starting point for the Vedas4All Chant Library.
Everything here is **content and instructions**. No code yet — Claude
Code writes all of that.

Run it entirely on your own laptop first. Nothing goes online until you
are happy with it.

---

## Step 1 — Put your files in

**Logo** → `public/brand/`

Drop in whatever you have. If you only have one file, that's fine — name
it `logo.png` or `logo.svg` and Claude Code will generate the icon sizes
from it later.

**Audio** → `public/audio/`

Six files, named exactly like this (lowercase, hyphens, no spaces):

```
ganapati-prarthana.mp3
ganapati-prarthana-slow.mp3
gayatri-mantra.mp3
gayatri-mantra-slow.mp3
shanti-mantra.mp3
shanti-mantra-slow.mp3
```

If you don't have slow versions yet, just copy the normal file and
rename it. Replace it properly later.

**YouTube links** → `content/chants.json`

Find `"youtubeId": ""` for each chant and paste in the 11-character code
from the URL — the part after `v=`, not the whole link.

```
https://www.youtube.com/watch?v=xWjlEV8UZcc
                                 ^^^^^^^^^^^
                                 this bit only
```

Leave it empty if you don't have one yet. The app will simply not show a
video section for that chant.

---

## Step 2 — Install what you need

You need two things on your laptop.

**Node.js** — go to nodejs.org, download the LTS version, install it.

**Claude Code** — open a terminal and run:

```
npm install -g @anthropic-ai/claude-code
```

To check both worked:

```
node --version
claude --version
```

---

## Step 3 — Build it

Open a terminal, navigate into this folder, and start Claude Code:

```
cd path/to/vedas4all-app
claude
```

Then type this as your first message:

```
Read CLAUDE.md and build the app as described. Use Next.js with
Tailwind. Start with the chant detail page for Gayatri Mantra so I can
check the Devanagari and svara marks render correctly, then build the
rest.
```

It will ask permission before creating files. Say yes.

---

## Step 4 — See it on your laptop

When it finishes, run:

```
npm run dev
```

Open **http://localhost:3000** in your browser. That's the app, running
entirely on your own machine. Nothing is on the internet.

Leave this running while you work. Any change Claude Code makes appears
in the browser within a second or two.

To stop it: press `Ctrl + C` in the terminal.

---

## Step 5 — See it on your phone (still local)

Useful, because most students are on phones.

With `npm run dev` running, find your laptop's local IP address:

- **Mac:** System Settings → Wi-Fi → Details → look for something like
  `192.168.1.42`
- **Windows:** open a terminal and run `ipconfig`, look for "IPv4
  Address"

Then on your phone, with both devices on the same Wi-Fi, open:

```
http://192.168.1.42:3000
```

(substituting your own number)

If it doesn't load, your laptop firewall is blocking it — allow Node.js
through, or just skip this step and test on the phone after deploying.

---

## Step 6 — Check these before going further

Work through this list on the laptop, then the phone:

- [ ] Svara marks all visible — the line **below** letters (anudātta),
      the line **above** (svarita), the double mark, and the ꣳ
- [ ] No marks clipped or overlapping the line above
- [ ] Ganapati Prarthana is the test case — it uses all four
- [ ] Audio plays, slow/normal toggle works
- [ ] A–B loop works — this is the most important feature in the app
- [ ] Two-column layout on laptop, single column on phone
- [ ] Still readable with the browser at half screen width (as it will
      be during a Zoom class)
- [ ] Font size control works
- [ ] Footer shows *Samasta Lokāḥ Sukhino Bhavantu* and vedas4all.org

Anything wrong — just tell Claude Code in plain words. "The svarita mark
above vareṇyaṃ is being cut off at the top." It will fix it.

---

## Step 7 — Only when you're satisfied

Add the remaining chants to `content/chants.json`, following the same
shape as the three already there. Then deploy — see the Deployment
section in CLAUDE.md for the Vercel and DNS steps.

---

## A note on the Sanskrit

The three chants were transcribed from the CHARM 2024 Sadhana Booklet
pages. Two spots worth your eye before you build:

1. **Ganapati, line 5** — `आ नः॑ शृ॒ण्वन्नू॒तिभि॑स्सीद॒` — the mark
   between `आन` and `शृ` in the booklet scan could be visarga or
   ardhavisarga. Written here as visarga.
2. **Gayatri, line 2** — `वरे॓ण्यं` — marked as compound svarita; the
   scan is ambiguous whether it's compound or plain.

Correct those in `chants.json` before building, and the text is sound.

---

*Samasta Lokāḥ Sukhino Bhavantu* — vedas4all.org
