# EZO TH — The Devil

An interactive character showcase for **Ezoth (Satan) · อีซอต**, an original character by **[Holly001.usagi](https://www.facebook.com/Holly001.usagi?locale=th_TH)**.

> Character, design, description and both artworks © Holly001.usagi.
> This is a non-commercial fan character showcase. All rights to the character and artwork remain with the creator — please ask them before reusing any of it.

Art direction: *Crimson Devil × Gothic Romance × Editorial Scrapbook* — ivory paper, crimson card panels, tape, stickers, torn edges and hand-drawn scribbles, built around the two original artworks.

---

## Sections

| Section | What it does |
| --- | --- |
| **Opening** | Loading heart that fills with crimson as the art loads, then a drawn heart, the EZO♥TH wordmark and a typed “Ah.. my little pet”. *Enter website* (optionally with music) or *Skip intro*. |
| **Hero** | The original portrait in a taped polaroid on a crimson card, giant EZO / TH type, stickers. Layers follow the mouse (parallax). |
| **Character Profile** | Name card, the creator's description with an **EN / ไทย original** toggle, identity stickers that flip to the creator's own Thai words, a pull-quote in Ezoth's own voice, and the card artwork as a 3D tilt card. |
| **Gallery** | Both artworks in an editorial spread. Click to open the lightbox (keyboard ←/→/Esc, swipe on touch, focus trap). |
| **Archive** | Seven sealed files — Identity, Origin, Personality, Nature, Favourite Food, Facts, Creator's Notes. Break a wax seal to open one. Every line shows its original Thai source. |
| **Creator** | Credit card with a button to the creator's Facebook. |
| **Footer** | Name, creator credit, fan-showcase disclaimer, *Replay intro*. |

### Interactive features
Signature heart cursor with sparkle/heart trail and click bursts (desktop only) · opening + loading animation · mouse parallax · scroll reveals · crimson curtain page transitions · flip stickers · 3D tilt card · lightbox with transitions · sealed archive · original synthesized sound effects · background music toggle · master mute · responsive navigation with mobile menu · heart-shaped back-to-top with scroll progress.

### Easter egg
*The devil counts to six.* Press the little heart speech-bubble in the hero six times, or type `666` or `mine`.

---

## Character information

All text comes from the creator's own notes (kept verbatim in Thai in `js/data.js`): the first description, the origin story (an angel who served God, fled to the human world, then to London, where they took in Pandora), favourite food, and facts. English lines are only a re-wording for the interface. Nothing beyond the creator's notes has been added — no age, height, powers or fixed gender. Per the lore, Ezoth has no sex; the English text uses *they*.

## Sound

Every sound is generated live with the Web Audio API — no audio files, nothing licensed. Audio only starts after a click (browser autoplay policy), music is **off** by default, and the mute setting is remembered in the browser.

## Accessibility & devices

- Custom cursor only on devices with a fine, hovering pointer; touch devices use normal touch.
- `prefers-reduced-motion`: no particles, parallax, tilt or curtain; content appears without animation.
- Keyboard: skip link, visible focus, lightbox and menu close with Esc, archive and tags are real buttons with `aria-expanded` / `aria-pressed`.
- Tested at 1440, 1280, 800 and 375 px wide in Chromium; no console errors.

---

## Project structure

```
index.html                     Markup for all sections
css/style.css                  Visual system, layout, responsive, reduced motion
js/data.js                     Character data + variants (edit this to add versions)
js/audio.js                    Synthesized SFX + generative music box waltz
js/cursor.js                   Heart cursor + shared particle canvas
js/main.js                     Rendering, opening, transitions, gallery, lightbox, archive, easter egg
assets/favicon.svg
assets/images/ezoth/devil/     Original artwork (JPG original + WebP + 640px WebP)
scripts/check.mjs              Pre-deploy check (JS syntax + every local asset path exists)
.github/workflows/pages.yml    GitHub Pages deploy
.nojekyll
```

No build step, no dependencies, no backend. Fonts load from Google Fonts with system fallbacks. All paths are relative, so the site works at a domain root or a project sub-path (`username.github.io/repo/`).

### Artwork

| File | Size | Used for |
| --- | --- | --- |
| `the-devil-card` | 1030 × 1500 | Profile tilt card, gallery, lightbox |
| `portrait` | 848 × 1500 | Hero main portrait, gallery, lightbox |

Images are the creator's originals, only re-encoded (WebP) and resized — never redrawn or recolored.

---

## Adding a new version (e.g. a Fairy version)

The site is driven by `variants` in `js/data.js`. When the creator releases a new version:

1. Put its images in `assets/images/ezoth/<id>/` (e.g. `fairy/`).
2. Add an object to `variants` — copy the `devil` entry and change `id`, `label`, `note`, `hero`, `gallery`.
3. Optional: `archive` for version-only files, `profile.tags` for version-only stickers, `theme` to override CSS colors (e.g. `{ "--crimson": "#…" }`).

A version switcher appears automatically in the profile once there are two or more variants, the gallery gets per-version filters, and `?v=<id>` in the URL opens that version directly. No other code changes are needed. *(No Fairy version is included yet — there is no original art or info for it.)*

---

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Before deploying:

```bash
node scripts/check.mjs
```

## Deploy to GitHub Pages

1. Push this folder to its GitHub repository (branch `main`).
2. Repository **Settings → Pages → Source: GitHub Actions**.
3. The workflow checks the site and publishes it on every push to `main`.

---

## Credits

- **Ezoth (Satan)** — character, description and artwork by [Holly001.usagi](https://www.facebook.com/Holly001.usagi?locale=th_TH)
- Fonts: Bodoni Moda, Archivo, Space Mono, Caveat, Noto Serif Thai, Sriracha (Google Fonts, SIL Open Font License)
- Sound: original, synthesized in the browser
