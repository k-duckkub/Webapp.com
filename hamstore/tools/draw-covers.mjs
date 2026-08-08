#!/usr/bin/env node
/**
 * Draws the cover art as real image files.
 *
 * The generated SVG motifs in `Artwork.tsx` are abstract by design — they were
 * a stand-in for pictures nobody had. This draws the actual goods instead: the
 * tee laid flat, the mug with its handle out, the lamp on the sweep. Each one
 * is composed in a headless browser and screenshotted, so what lands in
 * `public/uploads` is a genuine raster file that any host can serve and the
 * studio can replace with a real photograph the day one exists.
 *
 * Nothing is downloaded. Outbound image hosts are blocked by the network
 * policy here, and copying someone's photography into a shop would be the
 * wrong answer even if they weren't — so every pixel is drawn from scratch.
 *
 *   node tools/draw-covers.mjs          # write PNGs and point site.json at them
 *   node tools/draw-covers.mjs --dry    # render only, leave the content alone
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Playwright is a heavy dependency for a drawing script, so it is not in
 * package.json — this looks for it locally, then globally, and says how to
 * get it rather than failing with a module-resolution stack trace.
 */
async function loadChromium() {
  /* Playwright ships CommonJS, so an ESM import of it lands the whole module
     on `default` rather than as named exports — take whichever has chromium. */
  const pick = mod => mod?.chromium ?? mod?.default?.chromium

  const candidates = ['playwright', 'playwright-core']
  for (const name of candidates) {
    try {
      const found = pick(await import(name))
      if (found) return found
    } catch {}
  }
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim()
    for (const name of candidates) {
      try {
        const found = pick(await import(pathToFileURL(path.join(globalRoot, name, 'index.js')).href))
        if (found) return found
      } catch {}
    }
  } catch {}
  console.error(
    '\n  ต้องมี Playwright ก่อน:  npm i -D playwright && npx playwright install chromium\n',
  )
  process.exit(1)
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'uploads')
const CONTENT = path.join(ROOT, 'content', 'site.json')
/* 640² covers a 320px card at 2x, which is the largest any of these are drawn.
   JPEG rather than PNG: these are full-bleed gradient art with no transparency,
   and 36 lossless covers came to 15 MB — enough to push the single-file build
   past what it is allowed to weigh. */
const SIZE = 640
const QUALITY = 86

/* ------------------------------------------------------------------ parts */

/**
 * Product-shot framing.
 *
 * The reference is how apparel is actually photographed for a shop: the piece
 * alone on a pale, near-neutral ground, centred, shot at the same distance
 * every time, with one soft contact shadow underneath. What makes a row of
 * those read as a catalogue is not the styling of any single frame — it is
 * that all of them share the ground, the crop and the light. So the ground
 * lives here, once, and every item only supplies its own object.
 */
const GROUND = `
  <rect width="400" height="400" fill="url(#studio)"/>
  <ellipse cx="200" cy="336" rx="118" ry="17" fill="#4A3520" opacity=".10"/>`

/* ---------------------------------------------------------------- garments */

/**
 * A garment, laid flat.
 *
 * One silhouette builder rather than four hand-drawn tops: sleeve length and
 * hem move, everything else stays put, which is what keeps the shoulders on
 * the same line across the whole shelf.
 */
function garment({
  body,
  shade,
  trim = null,
  sleeve = 'short',   // 'short' | 'long'
  hem = 316,
  chest = '',
  hood = false,
} = {}) {
  const long = sleeve === 'long'
  const cuffY = long ? 300 : 196
  const sleeveOuterTop = long ? 132 : 126
  const armX = long ? 74 : 84

  /* Left half is mirrored, so the piece can never come out lopsided. */
  const half = (dir) => {
    const s = dir // 1 right, -1 left
    const x = v => 200 + s * v
    return `
      L${x(48)},100
      L${x(96)},${sleeveOuterTop}
      L${x(126 - (long ? 0 : 6))},${cuffY - (long ? 8 : 0)}
      L${x(long ? 92 : 68)},${cuffY + (long ? 8 : 2)}
      L${x(56)},${long ? 172 : 168}
      L${x(56)},${hem}`
  }

  return `
    <g>
      ${hood ? `<path d="M144 118c0-34 25-56 56-56s56 22 56 56c0 20-25 30-56 30s-56-10-56-30Z" fill="${shade}"/>` : ''}
      <path d="M200,92 ${half(1)} L${200 - 56},${hem} ${half(-1).split('\n').reverse().join('\n')} Z"
            fill="${body}"/>

      <!-- shading down the left of the body, the way a folded piece falls -->
      <path d="M144,${hem} L144,168 L156,168 L156,${hem} Z" fill="${shade}" opacity=".55"/>
      <path d="M244,168 L256,168 L256,${hem} L244,${hem} Z" fill="${shade}" opacity=".3"/>

      <!-- collar -->
      ${hood
        ? `<path d="M162 116c12 22 64 22 76 0 6 14 4 26-4 34-22 14-46 14-68 0-8-8-10-20-4-34Z" fill="${shade}"/>
           <path d="M186 148l6 44 8-10 8 10 6-44Z" fill="${body}" opacity=".85"/>
           <g stroke="${trim ?? shade}" stroke-width="6" stroke-linecap="round" fill="none">
             <path d="M188 150c-4 26-6 40-6 54M212 150c4 26 6 40 6 54"/>
           </g>`
        : `<path d="M168 96c8 26 56 26 64 0 6 6 8 14 6 22-10 20-66 20-76 0-2-8 0-16 6-22Z" fill="${shade}"/>`}

      ${trim && !hood ? `<rect x="144" y="${hem - 12}" width="112" height="12" fill="${trim}" opacity=".9"/>` : ''}
      ${chest}
    </g>`
}

/** A small chest print, the way a logo tee carries one. */
const chestMark = (inner, y = 196) => `<g transform="translate(200 ${y})">${inner}</g>`

const wordmark = (text, color, size = 13) =>
  `<text x="0" y="0" text-anchor="middle" font-family="system-ui,sans-serif"
         font-size="${size}" font-weight="700" letter-spacing="2"
         fill="${color}">${text}</text>`

/* ----------------------------------------------------------------- objects */

/**
 * The hamster mark, once.
 *
 * It is printed on the tee, embroidered on the cap, glazed on the mug, woven
 * into the mat and cut out as the keyring — so it is drawn in one place and
 * scaled. A shop whose logo is redrawn per product is a shop whose logo nobody
 * recognises on the second shelf.
 */
const hamsterMark = ({ fur = '#F5A524', ear = '#E9A07C', ink = '#2A211A', r = 30 } = {}) => `
  <g>
    <circle cx="${-r * 0.72}" cy="${-r * 0.68}" r="${r * 0.34}" fill="${fur}"/>
    <circle cx="${r * 0.72}" cy="${-r * 0.68}" r="${r * 0.34}" fill="${fur}"/>
    <circle cx="${-r * 0.72}" cy="${-r * 0.68}" r="${r * 0.18}" fill="${ear}"/>
    <circle cx="${r * 0.72}" cy="${-r * 0.68}" r="${r * 0.18}" fill="${ear}"/>
    <ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.9}" fill="${fur}"/>
    <ellipse cx="${-r * 0.46}" cy="${r * 0.26}" rx="${r * 0.28}" ry="${r * 0.2}" fill="#fff" opacity=".3"/>
    <ellipse cx="${r * 0.46}" cy="${r * 0.26}" rx="${r * 0.28}" ry="${r * 0.2}" fill="#fff" opacity=".3"/>
    <circle cx="${-r * 0.34}" cy="${-r * 0.06}" r="${r * 0.12}" fill="${ink}"/>
    <circle cx="${r * 0.34}" cy="${-r * 0.06}" r="${r * 0.12}" fill="${ink}"/>
    <path d="M${-r * 0.12} ${r * 0.24}h${r * 0.24}l${-r * 0.12} ${r * 0.15}Z" fill="${ink}"/>
    <path d="M${-r * 0.36} ${r * 0.46}q${r * 0.36} ${r * 0.24} ${r * 0.72} 0"
          stroke="${ink}" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>
  </g>`

/** A cap, three-quarter on with the peak toward the camera. */
const cap = `
  <g>
    <path d="M206 286c52 0 94 8 94 22 0 12-42 18-94 18-18 0-34-1-46-4l-4-34Z" fill="#12161F"/>
    <path d="M196 154c50 0 88 46 88 102 0 16-40 24-88 24s-88-8-88-24c0-56 38-102 88-102Z" fill="#1E2634"/>
    <path d="M196 154c50 0 88 46 88 102 0 11-20 18-50 21 8-58 2-99-38-123Z" fill="#151C27"/>
    <path d="M196 154v126" stroke="#151C27" stroke-width="3.5" fill="none" opacity=".7"/>
    <path d="M124 244c20-6 46-9 72-9s52 3 72 9" stroke="#151C27" stroke-width="3" fill="none" opacity=".45"/>
    <circle cx="196" cy="156" r="7" fill="#151C27"/>
    <g transform="translate(184 216)">${hamsterMark({ r: 22 })}</g>
  </g>`

/** One sock. Two of them, offset, is how a pair is photographed. */
const sock = (x, y, tilt, body, cuff) => `
  <g transform="translate(${x} ${y}) rotate(${tilt})">
    <path d="M8 0h58v124c0 20 10 29 30 38l24 11c17 8 21 26 12 41-9 14-28 18-45 10L26 200C13 193 8 180 8 160Z"
          fill="${body}"/>
    <path d="M8 0h58v26H8Z" fill="${cuff}"/>
    <path d="M8 34h58v9H8Z" fill="${cuff}" opacity=".8"/>
    <path d="M66 0v124c0 20-10 29-30 38" stroke="#00000018" stroke-width="7" fill="none"/>
    <g transform="translate(37 96) scale(.62)">${hamsterMark({ r: 26 })}</g>
  </g>`

/** A cushion — corners pulled, the way a filled cover actually sits. */
const cushion = `
  <g>
    <path d="M112 116c60-11 116-11 176 0 11 60 11 116 0 176-60 11-116 11-176 0-11-60-11-116 0-176Z"
          fill="#E8DBC4"/>
    <path d="M200 110c44 0 74 2 88 6 11 60 11 116 0 176-14 4-44 6-88 6Z" fill="#DFCFB4" opacity=".55"/>
    <path d="M112 116c60-11 116-11 176 0 11 60 11 116 0 176-60 11-116 11-176 0-11-60-11-116 0-176Z"
          fill="none" stroke="#CBB998" stroke-width="3" stroke-dasharray="9 7" opacity=".8"/>
    <g transform="translate(200 202)">${hamsterMark({ r: 52 })}</g>
  </g>`

/** The desk lamp, lit — an unlit lamp in a shop photo looks broken. */
const lamp = `
  <g transform="translate(200 330) scale(1.14) translate(-200 -330)">
    <ellipse cx="244" cy="322" rx="106" ry="26" fill="#FBBF24" opacity=".18"/>
    <ellipse cx="196" cy="320" rx="62" ry="15" fill="#C7CBD4"/>
    <ellipse cx="196" cy="311" rx="62" ry="15" fill="#E9ECF1"/>
    <rect x="189" y="132" width="15" height="180" fill="#DCE0E7"/>
    <rect x="189" y="132" width="5" height="180" fill="#F4F6F9"/>
    <path d="M196 126c0-16 13-30 30-30h68c13 0 21 8 21 17s-8 17-21 17h-98Z" fill="#E9ECF1"/>
    <path d="M226 96h68c13 0 21 8 21 17s-8 17-21 17h-68Z" fill="#DCE0E7" opacity=".7"/>
    <rect x="214" y="134" width="98" height="9" rx="4.5" fill="#FDE68A"/>
    <circle cx="196" cy="286" r="13" fill="#F97316"/>
    <circle cx="196" cy="286" r="5" fill="#C2410C"/>
  </g>`

/**
 * A throw, hanging.
 *
 * Folded flat it came out as a stack of pancakes — three rounded slabs read as
 * baking, not bedding. Hung, with a wavy hem and a fringe, there is nothing
 * else it could be: only cloth falls in that shape.
 */
const blanket = (() => {
  const left = 96, right = 304, top = 124, bottom = 286
  const hem = x => 11 * Math.sin(((x - left) / (right - left)) * Math.PI * 3)
  const shoulder = x => 7 * Math.sin(((x - left) / (right - left)) * Math.PI * 2)

  const along = f => {
    const pts = []
    for (let x = left; x <= right; x += 8) pts.push([x, f(x)])
    return pts
  }
  const upper = along(x => top + shoulder(x))
  const lower = along(x => bottom + hem(x))
  const trace = pts => pts.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join('')

  const body = `M${left} ${(top + shoulder(left)).toFixed(1)}${trace(upper)}${trace([...lower].reverse())}Z`
  const fringe = lower
    .filter((_, i) => i % 2 === 0)
    .map(([x, y]) => `<path d="M${x} ${(y - 2).toFixed(1)}v15"/>`)
    .join('')

  return `
    <g>
      <path d="${body}" fill="#E4D7BE"/>
      <!-- Drape, not panels: hard-edged full-height strips made it read as a
           folding screen, so each fold tapers from nothing at the shoulder to
           its full width at the hem, the way cloth actually gathers. -->
      <g fill="#0000000c">
        <path d="M142 129 146 129 158 297 128 296Z"/>
        <path d="M220 123 224 123 240 293 206 292Z"/>
        <path d="M282 130 286 130 296 296 268 297Z"/>
      </g>
      <path d="M96 124 118 125 112 293 96 292Z" fill="#00000008"/>
      <g stroke="#CDBD9E" stroke-width="4" stroke-linecap="round">${fringe}</g>
    </g>`
})()

/** A doormat, seen the way one is: from standing height, thick at the edge. */
const doormat = `
  <g>
    <clipPath id="matface"><path d="M62 212 200 156l138 56-138 56Z"/></clipPath>
    <path d="M62 212 200 156l138 56v26L200 294 62 238Z" fill="#3E332A"/>
    <path d="M62 212 200 156l138 56-138 56Z" fill="#8B7355"/>
    <g clip-path="url(#matface)">
      <g transform="translate(200 212) scale(1 .38)">${hamsterMark({ r: 62, fur: '#E7D7BC', ear: '#D6BF9D', ink: '#4A3B2C' })}</g>
      <!-- coir, laid the way the pile runs -->
      <g stroke="#00000016" stroke-width="2">
        <path d="M62 212 200 268M110 192 248 248M158 172 296 228M206 152 344 208M14 232 152 288"/>
      </g>
    </g>
    <path d="M62 212 200 156l138 56-138 56Z" fill="none" stroke="#6B573F" stroke-width="7"/>
  </g>`

/** A mug, handle out — the standard angle, so the handle is part of the sale. */
const mug = `
  <g>
    <path d="M262 178c28 0 48 18 48 40s-20 42-48 42" fill="none" stroke="#FDFDFE" stroke-width="22" stroke-linecap="round"/>
    <path d="M262 178c28 0 48 18 48 40s-20 42-48 42" fill="none" stroke="#E1E4EA" stroke-width="5" stroke-linecap="round"/>
    <path d="M128 152h136v146c0 11-30 18-68 18s-68-7-68-18Z" fill="#FDFDFE"/>
    <path d="M226 152h38v146c0 9-16 15-38 17Z" fill="#EDEFF3"/>
    <ellipse cx="196" cy="152" rx="68" ry="16" fill="#F5F6F9"/>
    <ellipse cx="196" cy="152" rx="68" ry="16" fill="none" stroke="#E1E4EA" stroke-width="3"/>
    <ellipse cx="196" cy="153" rx="56" ry="12" fill="#E4E7ED"/>
    <g transform="translate(186 226)">${hamsterMark({ r: 34 })}</g>
  </g>`

/** The insulated bottle, lid on. */
const bottle = `
  <g>
    <rect x="176" y="90" width="48" height="22" rx="10" fill="#2C3A44"/>
    <rect x="164" y="106" width="72" height="30" rx="13" fill="#3A4A56"/>
    <path d="M156 134h88v164c0 15-14 24-44 24s-44-9-44-24Z" fill="#0E7490"/>
    <path d="M214 134h30v164c0 13-9 20-30 23Z" fill="#0A5A70" opacity=".85"/>
    <rect x="166" y="152" width="11" height="122" rx="5.5" fill="#fff" opacity=".2"/>
    <g transform="translate(200 224)">${hamsterMark({ r: 27, fur: '#FDE68A', ear: '#FBBF24', ink: '#0A4657' })}</g>
  </g>`

/** A canvas tote, hanging with the handles up. */
const tote = `
  <g>
    <path d="M150 154c0-32 22-56 50-56s50 24 50 56" fill="none" stroke="#DCD1BA" stroke-width="13" stroke-linecap="round"/>
    <path d="M150 154c0-32 22-56 50-56" fill="none" stroke="#E9E1D0" stroke-width="13" stroke-linecap="round"/>
    <path d="M112 148h176l9 166c-33 9-64 13-97 13s-64-4-97-13Z" fill="#EDE4D2"/>
    <path d="M200 148h88l9 166c-30 8-59 12-89 13Z" fill="#E2D8C3" opacity=".7"/>
    <path d="M112 148h176l1 14H113Z" fill="#DCD1BA"/>
    <g transform="translate(200 238)">${hamsterMark({ r: 46 })}</g>
  </g>`

/**
 * The long desk mat.
 *
 * A flat dark rectangle is indistinguishable from the doormat two shelves up,
 * so the mouse sits on it: it gives the mat a scale, and it says at a glance
 * which of the two flat rectangles in this shop is the one for a desk.
 */
const deskmat = `
  <g>
    <path d="M50 236 208 190l142 40-158 46Z" fill="#30333B"/>
    <path d="M50 236v14l142 46v-14Z" fill="#1F2228"/>
    <path d="M350 230v14l-158 52v-14Z" fill="#282B32"/>
    <path d="M50 236 208 190l142 40-158 46Z" fill="none" stroke="#F97316" stroke-width="3" opacity=".75"/>
    <g transform="translate(150 246) scale(1 .34)">${hamsterMark({ r: 44, fur: '#818897', ear: '#9AA1AE', ink: '#23262C' })}</g>
    <g transform="translate(272 208)">
      <ellipse cx="0" cy="6" rx="30" ry="18" fill="#1F2228" opacity=".5"/>
      <path d="M-26 4c0-20 11-34 26-34s26 14 26 34c0 13-11 20-26 20s-26-7-26-20Z" fill="#5E6470"/>
      <path d="M0 -30c15 0 26 14 26 34 0 13-11 20-26 20Z" fill="#4A505B"/>
      <path d="M0 -26v16" stroke="#2C2F36" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>`

/** A hardcover notebook, closed, with the elastic across it. */
const notebook = `
  <g transform="rotate(-5 200 208)">
    <rect x="126" y="98" width="152" height="216" rx="9" fill="#8A6236"/>
    <rect x="126" y="98" width="18" height="216" rx="9" fill="#6B4A28"/>
    <rect x="266" y="104" width="10" height="204" rx="3" fill="#F5F1E8"/>
    <rect x="262" y="104" width="6" height="204" fill="#E5DFD2"/>
    <rect x="234" y="98" width="10" height="216" fill="#1F2937" opacity=".85"/>
    <g transform="translate(196 196)">${hamsterMark({ r: 40, fur: '#E7C48F', ear: '#D9AE72', ink: '#5B4022' })}</g>
    <text x="196" y="272" text-anchor="middle" font-family="system-ui,sans-serif"
          font-size="12" font-weight="700" letter-spacing="2.5" fill="#E7C48F" opacity=".8">HAMSTERHUB</text>
  </g>`

/** The plush. A soft toy is drawn soft — no straight edges anywhere. */
const plushHamster = `
  <g>
    <circle cx="140" cy="158" r="27" fill="#E0912F"/>
    <circle cx="260" cy="158" r="27" fill="#E0912F"/>
    <circle cx="140" cy="158" r="14" fill="#E9A07C"/>
    <circle cx="260" cy="158" r="14" fill="#E9A07C"/>
    <ellipse cx="200" cy="252" rx="100" ry="72" fill="#F5A524"/>
    <ellipse cx="200" cy="268" rx="64" ry="52" fill="#FBE6C4"/>
    <ellipse cx="200" cy="196" rx="88" ry="72" fill="#F7B24A"/>
    <ellipse cx="150" cy="212" rx="26" ry="18" fill="#fff" opacity=".28"/>
    <ellipse cx="250" cy="212" rx="26" ry="18" fill="#fff" opacity=".28"/>
    <circle cx="172" cy="188" r="11" fill="#2A211A"/>
    <circle cx="228" cy="188" r="11" fill="#2A211A"/>
    <circle cx="175" cy="184" r="3.5" fill="#fff"/>
    <circle cx="231" cy="184" r="3.5" fill="#fff"/>
    <path d="M192 210h16l-8 10Z" fill="#C2705E"/>
    <path d="M186 226q14 10 28 0" stroke="#2A211A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="138" cy="268" rx="20" ry="26" fill="#F7B24A" transform="rotate(-16 138 268)"/>
    <ellipse cx="262" cy="268" rx="20" ry="26" fill="#F7B24A" transform="rotate(16 262 268)"/>
    <ellipse cx="168" cy="316" rx="26" ry="14" fill="#EE9A12"/>
    <ellipse cx="232" cy="316" rx="26" ry="14" fill="#EE9A12"/>
  </g>`

/** The sticker pack, shot as the sheet it is cut on. */
function sheet(tints) {
  const grid = [[140, 152], [200, 140], [260, 152], [128, 220], [200, 212], [272, 220], [158, 286], [242, 286]]
  const faces = grid.map(([x, y], i) => {
    const r = i === 4 ? 34 : 26
    return `
      <g transform="translate(${x} ${y})">
        <circle cx="0" cy="0" r="${r + 7}" fill="#fff"/>
        ${hamsterMark({ r, fur: tints[i % tints.length] })}
      </g>`
  })
  return `
    <g>
      <rect x="84" y="100" width="232" height="218" rx="12" fill="#fff"/>
      <rect x="84" y="100" width="232" height="218" rx="12" fill="none" stroke="#E4E4E8" stroke-width="3"/>
      <g stroke="#E4E4E8" stroke-width="2" stroke-dasharray="5 5">
        <path d="M84 209h232M200 100v218"/>
      </g>
      ${faces.join('')}
    </g>`
}

/** An acrylic charm on a split ring — clear border, printed centre. */
const keyring = `
  <g>
    <circle cx="200" cy="112" r="28" fill="none" stroke="#B9BDC6" stroke-width="10"/>
    <circle cx="200" cy="112" r="28" fill="none" stroke="#EDEFF3" stroke-width="4"/>
    <path d="M200 140v22" stroke="#C7CBD4" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="200" cy="248" rx="88" ry="82" fill="#FFFFFF" opacity=".95"/>
    <ellipse cx="200" cy="248" rx="88" ry="82" fill="none" stroke="#DADDE4" stroke-width="3"/>
    <ellipse cx="164" cy="200" rx="26" ry="16" fill="#fff" opacity=".7" transform="rotate(-24 164 200)"/>
    <g transform="translate(200 252)">${hamsterMark({ r: 58 })}</g>
    <circle cx="200" cy="176" r="8" fill="#F0F1F5" stroke="#D3D6DD" stroke-width="2"/>
  </g>`

/** A hard enamel pin: metal rim, filled colour, one specular streak. */
const pin = `
  <g>
    <circle cx="200" cy="208" r="98" fill="#C9911A"/>
    <circle cx="200" cy="208" r="90" fill="#FAF0DC"/>
    <g transform="translate(200 208)">${hamsterMark({ r: 62 })}</g>
    <circle cx="200" cy="208" r="98" fill="none" stroke="#A8781A" stroke-width="4"/>
    <circle cx="200" cy="208" r="90" fill="none" stroke="#E4C67E" stroke-width="3"/>
    <path d="M142 150a84 84 0 0 1 44-32" stroke="#fff" stroke-width="11" opacity=".55" fill="none" stroke-linecap="round"/>
  </g>`

/**
 * One entry per catalogue item id.
 *
 * No per-item background: every one shares the studio ground, which is the
 * whole point of shooting a catalogue this way. Only the object changes.
 */
const ITEM_ART = {
  // Apparel, laid flat on the sweep.
  1: () => garment({
        body: '#1E1E22', shade: '#0F0F12', sleeve: 'short',
        chest: chestMark(hamsterMark({ r: 30 }), 206),
      }),
  2: () => garment({
        body: '#F4EBDA', shade: '#DFD2BC', sleeve: 'short',
        chest: chestMark(hamsterMark({ r: 30 }), 206),
      }),
  3: () => garment({
        body: '#2C2C32', shade: '#191A1E', hood: true, sleeve: 'long', trim: '#F97316',
        chest: chestMark(hamsterMark({ r: 26 }), 244),
      }),
  4: () => cap,
  5: () => `${sock(96, 112, -7, '#F2E9DA', '#F97316')}${sock(196, 128, 6, '#F2E9DA', '#F97316')}`,

  // Home.
  6: () => cushion,
  7: () => lamp,
  8: () => blanket,
  9: () => doormat,

  // Desk.
  10: () => mug,
  11: () => bottle,
  12: () => tote,
  13: () => deskmat,
  14: () => notebook,

  // Collectables.
  15: () => plushHamster,
  16: () => sheet(['#F5A524', '#FDBA74', '#FCD34D', '#F59E0B']),
  17: () => keyring,
  18: () => pin,
}

/**
 * Page two is Unity packages, which are somebody else's screenshots — so these
 * are honestly-labelled placeholders per category rather than a pretend
 * product shot. Swap them in the studio when the real ones exist.
 */
function placeholder({ label, color, glyph }) {
  return `
    <g>
      <g opacity=".9">${glyph}</g>
      <rect x="122" y="322" width="156" height="34" rx="17" fill="#000" opacity=".28"/>
      <text x="200" y="345" text-anchor="middle" font-family="system-ui,sans-serif"
            font-size="17" font-weight="600" fill="#fff" opacity=".92">${label}</text>
    </g>`
}

const GLYPHS = {
  CHARACTER: `<g fill="#fff" opacity=".5"><circle cx="200" cy="152" r="52"/><path d="M108 300c0-52 42-84 92-84s92 32 92 84Z"/></g>`,
  ENVIRONMENTS: `<g fill="#fff" opacity=".5"><path d="M60 292 148 148l88 144Z"/><path d="M196 292 268 172l72 120Z" opacity=".8"/></g>`,
  GUI: `<g fill="#fff" opacity=".5"><rect x="86" y="118" width="228" height="164" rx="16"/><rect x="86" y="118" width="228" height="38" rx="16" opacity=".6"/></g>`,
  VFX: `<g fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".5"><path d="M200 96v52M200 252v52M96 200h52M252 200h52M126 126l38 38M236 236l38 38M274 126l-38 38M164 236l-38 38"/></g><circle cx="200" cy="200" r="34" fill="#fff" opacity=".55"/>`,
  AUDIO: `<g fill="#fff" opacity=".5"><rect x="104" y="176" width="20" height="48" rx="10"/><rect x="144" y="140" width="20" height="120" rx="10"/><rect x="184" y="108" width="20" height="184" rx="10"/><rect x="224" y="152" width="20" height="96" rx="10"/><rect x="264" y="180" width="20" height="40" rx="10"/></g>`,
  TOOLS: `<g fill="#fff" opacity=".5"><path d="M244 96a62 62 0 0 0-54 92l-88 88 30 30 88-88a62 62 0 0 0 78-84l-36 36-30-30 36-36a61 61 0 0 0-24-8Z"/></g>`,
  TEMPLATE: `<g fill="#fff" opacity=".5"><path d="M200 92l96 54v108l-96 54-96-54V146Z"/></g>`,
}

/* ------------------------------------------------------------------- draw */

const shell = defs => body => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  svg{display:block}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 400 400">
  <defs>${defs}</defs>
  ${body}
</svg></body></html>`

/* The studio ground every product shot shares: a pale neutral lifting slightly
   toward the top, the way a paper sweep does under one soft light. */
/* Warm, not neutral. The first version used a cool grey sweep, which was fine
   on the old cool-grey page and turned visibly blue the moment the site moved
   to HamsterHub's cream. A product shot has to share the room's light. */
const productPage = shell(`
  <linearGradient id="studio" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#FDFBF7"/>
    <stop offset="58%" stop-color="#F6F1E8"/>
    <stop offset="100%" stop-color="#EDE5D8"/>
  </linearGradient>`)

const placeholderPage = (bg, body) => shell(`
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${bg[0]}"/><stop offset="100%" stop-color="${bg[1]}"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="42%" r="62%">
    <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
    <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>`)(`
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="400" fill="url(#glow)"/>
  ${body}`)

async function main() {
  const chromium = await loadChromium()
  const dry = process.argv.includes('--dry')
  await fs.mkdir(OUT, { recursive: true })

  const site = JSON.parse(await fs.readFile(CONTENT, 'utf8'))
  const browser = await chromium.launch()
  const tab = await browser.newPage({ viewport: { width: SIZE, height: SIZE } })

  let drawn = 0

  for (const item of site.items) {
    const spec = ITEM_ART[item.id]
    if (!spec) {
      console.warn(`  ! item ${item.id} (${item.name}) has no artwork — leaving its generated cover`)
      continue
    }
    await tab.setContent(productPage(GROUND + spec()))
    const file = `item-${item.id}.jpg`
    await tab.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: QUALITY })
    if (!dry) item.image = `/uploads/${file}`
    drawn++
  }

  const byId = Object.fromEntries(site.assetCategories.map(c => [c.id, c]))
  for (const asset of site.assets) {
    const cat = byId[asset.category]
    if (!cat || !GLYPHS[asset.category]) continue
    await tab.setContent(
      placeholderPage([asset.color, '#0b0a09'],
        placeholder({ label: cat.label, color: asset.color, glyph: GLYPHS[asset.category] })),
    )
    const file = `asset-${asset.id}.jpg`
    await tab.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: QUALITY })
    if (!dry) asset.image = `/uploads/${file}`
    drawn++
  }

  await browser.close()

  if (!dry) {
    await fs.writeFile(CONTENT, JSON.stringify(site, null, 2) + '\n')
    console.log(`\n  ${drawn} covers drawn into public/uploads and wired into content/site.json`)
  } else {
    console.log(`\n  ${drawn} covers drawn (dry run — content/site.json untouched)`)
  }
}

main()
