# LIGTAS

**Maximalist edition.** Loud colors, clashing type, thick outlines, sticker shadows and 3D motion throughout.

A responsive, interactive website about **street and online sexual harassment in the Philippines**, made for Filipino students and young adults aged 16 to 25.

Midterm project by **Daniel Diaz, BSIT 4-4**.

---

## How to run it

1. Unzip the folder.
2. Open `index.html` in Chrome, Edge or Firefox. No install or build step is needed.
3. For the best result, serve it from a local server so the 3D model and videos load reliably:
   - **VS Code:** install the "Live Server" extension, right-click `index.html`, then choose *Open with Live Server*.
   - **Python:** run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

The site needs an internet connection the first time. The fonts, libraries and Higgsfield assets load from the web.

### Optional: keep local copies of the assets

By default the images, videos and 3D model load from Higgsfield's CDN. To store them inside `assets/` (recommended before submitting or deploying):

- **Windows:** `powershell -ExecutionPolicy Bypass -File assets\download-assets.ps1`
- **Mac / Linux / Git Bash:** `bash assets/download-assets.sh`

The script downloads all 13 files. It then rewrites `index.html` to use the local copies and saves the original as `index.cdn.html`.

### Optional: compress the videos (MP4 + WebM, under 4 MB)

The Higgsfield clips have not been compressed yet. After downloading them, run these commands with [ffmpeg](https://ffmpeg.org):

```bash
cd assets/video
ffmpeg -i hero-loop.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart hero-loop-small.mp4
ffmpeg -i hero-loop.mp4 -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 38 -b:v 0 hero-loop.webm
ffmpeg -i dots-shield.mp4 -an -vf "scale=960:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart dots-shield-small.mp4
```

Check the output sizes. If a file is still over 4 MB, raise `-crf` by 2 and run it again. Then, in `index.html`:
- Point `data-src-mp4` on `#heroVideo` to `hero-loop-small.mp4`.
- Set its `data-src-webm` to `assets/video/hero-loop.webm`. The script loads WebM first and falls back to MP4.

---

## Files

| File | What it is |
|---|---|
| `index.html` | All 9 sections, in order |
| `style.css` | Mobile-first styles, design tokens, breakpoints at 640 / 768 / 1024 / 1440 px |
| `script.js` | Animations, quiz, pledge counter, accordion, flip cards, charts, 3D and menu |
| `ASSETS.md` | Asset table: every Higgsfield URL and where it is used |
| `assets/download-assets.sh`, `assets/download-assets.ps1` | Download the assets and switch to local paths |

## Libraries

| Library | Version | Used for |
|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | Intro, word reveals, fade-up staggers, parallax, pinned numbers section, counters, magnetic buttons, card tilt |
| Chart.js | 4.4.1 | The three bar charts in *By the Numbers* |
| `<model-viewer>` (Google) | 3.5.0 | Rotating, draggable 3D shield |
| Three.js | r128 | Hero 3D scene: outlined low-poly shapes and extruded shields |
| Google Fonts | – | Bricolage Grotesque (display), Instrument Serif italic (accent words), Atkinson Hyperlegible (body; designed for legibility) |

Everything else is plain HTML, CSS and vanilla JavaScript. No frameworks are used.

---

## The maximalist design

| Element | What it looks like |
|---|---|
| Color | Violet, teal and coral from the original brief, plus hot yellow and pastel tints (mint, lilac, blush). Every fill was checked for AA text contrast. |
| Type | Three faces that clash on purpose: heavy Bricolage Grotesque, italic Instrument Serif for accent words, and Atkinson Hyperlegible so body text stays easy to read. |
| Shape | 3px ink outlines, offset "sticker" shadows, tilted cards, arch and blob photo frames, laws styled as ticket stubs. |
| Pattern | Each section has its own: halftone dots (hero), grid paper (issue), diagonal stripes (laws), glows (3D section). |
| Extras | Scrolling ticker band, rotated sticker labels, a round "3 in 5" stat badge, and a giant extruded "ligtas" wordmark in the footer. |

## 3D animations

| Where | What happens |
|---|---|
| Hero | A Three.js scene of floating, outlined low-poly shapes and extruded shields. They spin, bob, follow the pointer and roll away as you scroll. Shapes stay at the edges so the headline is never covered. |
| Hero collage | The video arch, photo tile, badge and star fly in from depth, then tilt in 3D with the pointer (parallax layers). |
| Headline | The italic second line flips down on its top edge; stickers pop in. |
| Section headings | Tip forward out of the page as they scroll into view. |
| Cards | Every card swings up from a 45° tilt when it enters the screen; on desktop, cards tilt in 3D under the pointer. |
| Numbers | The four counter cards flip in on their vertical axis while the numbers count up. |
| Myths and facts | Cards turn over in 3D when tapped. |
| Laws | Each panel unfolds downward from its ticket like a hinged flap. |
| 3D shield | The model-viewer shield rotates and can be dragged; three orbit rings spin around it in 3D and tilt as you scroll. |
| Footer | The extruded "ligtas" wordmark rises out of the page and tilts with the pointer. |

All of this switches off under `prefers-reduced-motion`. The Three.js canvas is hidden and the ticker stops. The rest of the page still shows its final, static layout. The hero scene also pauses whenever it's off screen, uses fewer, smaller shapes on phones, and is skipped entirely if the browser has no WebGL.

## How it meets each midterm requirement

**Functional.**
- The quiz scores six scenarios and explains each answer.
- The pledge form validates input and updates a live counter and name list. It is saved in the browser with `localStorage`, so the count is per device and is never faked.
- The law accordion, myth/fact flip cards, working LawPhil links and tap-to-call hotlines all work.

**Responsive.**
- The layout is mobile-first, tested at 360 px and 1440 px with no horizontal scrolling. The grids reflow at 640, 768, 1024 and 1440 px.
- Mobile gets a hamburger menu, square image crops through `<picture>`, and a poster image instead of the hero video. The poster is also used on screens under 768 px, on Save-Data and on 2G connections.
- The 3D model lazy-loads.

**Interactive.**
- **Motion:** word-by-word hero headline, 3D scroll reveals, parallax images, and a pinned numbers section with counters. Charts draw on scroll.
- **3D:** a Three.js hero scene, 3D card flips and fold-outs, and a draggable 3D shield with orbiting rings (see the table above).
- **Pointer effects:** magnetic buttons, card tilt, and a custom cursor on desktop only.

**One issue.** Every section ties back to street and online sexual harassment in the Philippines:
- the issue itself and its myths;
- the statistics;
- the laws against it;
- who it affects and how bystanders can help;
- what to do about it.

**Original design.**
- **Visuals:** all images, both videos and the 3D model were generated with Higgsfield AI for this project (see `ASSETS.md`), in one violet, teal and coral style.
- **Text:** all wording is original and paraphrases its sources.

**Statistics, laws and claims with references.**
- **Statistics:** each one shows its source and year directly under it, with a link to its numbered reference.
- **Laws:** each one links to its full text on LawPhil and to its reference.
- **References:** 17 entries in APA 7th edition, numbered, in section 8.
- **Placeholder:** one statistic (current count of Safe Spaces Act complaints) could not be verified, so it is shown as a clearly marked placeholder rather than invented.

### Accessibility
- **Keyboard:** skip link, and a keyboard-operable menu (Escape closes it), accordion, flip cards and quiz. Focus rings are visible.
- **Colors:** WCAG AA contrast for text on each background (darker "ink" versions of teal, violet and coral on light backgrounds).
- **Screen readers:** alt text on every image and aria-labels on both videos. The quiz feedback is announced through `aria-live`.
- **Video control:** a pause button for the hero video.
- **`prefers-reduced-motion`:**
  - No intro animation, parallax, autoplay video or 3D rotation.
  - The static shield image replaces the 3D model.
  - Charts and counters appear without animation.

---

## Before you submit: checklist

- [ ] Put your school guidance office's number in the "Your school guidance office" card (search `Add your campus number` in `index.html`).
- [ ] Replace or remove the placeholder in *By the Numbers* if you get the official figure from the PNP Women and Children Protection Center.
- [ ] Run the asset download script, then compress the videos (see above).
- [ ] Check `assets/model/shield.glb` is under 5 MB. If it isn't, run it through [gltf.report](https://gltf.report) with Draco compression.
- [ ] Run Lighthouse in Chrome DevTools. Local, compressed assets make the biggest difference to the performance score.
- [ ] Double-check the hotline numbers before publishing. Agencies occasionally change them.

## Notes on sources
- **SWS 2016:** figures come from the Social Weather Stations survey in two Quezon City barangays (UN Women Safe Cities Metro Manila programme). They are cited through the news reports that published the findings, because the original SWS release was not available online.
- **Rights:** the 5 D's of bystander intervention are Right To Be's method.
- **3D model:** the Higgsfield 3D model came out untextured. `script.js` colors it violet with a coral glow when it loads.
