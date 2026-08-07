#!/usr/bin/env node
/**
 * Draws the cover art as real image files.
 *
 * The generated SVG motifs in `Artwork.tsx` are abstract by design — they were
 * a stand-in for pictures nobody had. This draws the actual products instead:
 * a hamster wearing the outfit you would be buying, the pet that follows your
 * cursor, the frame around a portrait. Each one is composed in a headless
 * browser and screenshotted, so what lands in `public/uploads` is a genuine
 * raster file that any host can serve and the studio can replace.
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
  <ellipse cx="200" cy="336" rx="118" ry="17" fill="#0B0A09" opacity=".085"/>`

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

/** The astronaut helmet — an object, shot like one. */
const helmet = `
  <g>
    <ellipse cx="200" cy="322" rx="74" ry="20" fill="#D8DBE4"/>
    <rect x="126" y="252" width="148" height="70" rx="18" fill="#EDEFF4"/>
    <rect x="126" y="252" width="148" height="16" rx="8" fill="#F97316"/>
    <circle cx="200" cy="196" r="106" fill="#F4F5F8"/>
    <path d="M200 90a106 106 0 0 1 106 106c0 24-40 44-106 44S94 220 94 196A106 106 0 0 1 200 90Z" fill="#CBD8EA"/>
    <path d="M200 104a92 92 0 0 1 92 92c0 20-36 36-92 36s-92-16-92-36a92 92 0 0 1 92-92Z" fill="#8FA9C9" opacity=".55"/>
    <path d="M126 158a94 94 0 0 1 52-44" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round" opacity=".85"/>
    <circle cx="200" cy="196" r="106" fill="none" stroke="#DFE3EB" stroke-width="8"/>
  </g>`

/** The mortarboard, for the graduation set. */
const mortarboard = `
  <g>
    <path d="M200 176 92 218l108 42 108-42Z" fill="#20233A"/>
    <path d="M200 260 92 218v12c0 8 46 24 108 24s108-16 108-24v-12Z" fill="#171A2C"/>
    <path d="M296 226v56" stroke="#FBBF24" stroke-width="7" stroke-linecap="round"/>
    <circle cx="296" cy="290" r="14" fill="#FBBF24"/>
    <circle cx="200" cy="218" r="9" fill="#0F1120"/>
  </g>`

/** Pets photographed as plush, which is what a cosmetic pet is: a soft toy. */
function plush(inner) {
  return `<g>${inner}</g>`
}

const PLUSH = {
  cat: plush(`
    <path d="M128 176 150 106l46 40Z" fill="#F5A524"/>
    <path d="M272 176 250 106l-46 40Z" fill="#F5A524"/>
    <path d="M128 176 150 118l34 30Z" fill="#F7BC5E"/>
    <ellipse cx="200" cy="216" rx="94" ry="82" fill="#F5A524"/>
    <ellipse cx="200" cy="296" rx="72" ry="40" fill="#EE9A12"/>
    <path d="M270 300c40-8 60-34 54-66" stroke="#F5A524" stroke-width="26" fill="none" stroke-linecap="round"/>
    <ellipse cx="170" cy="208" rx="11" ry="15" fill="#2A211A"/>
    <ellipse cx="230" cy="208" rx="11" ry="15" fill="#2A211A"/>
    <path d="M190 238h20l-10 11Z" fill="#E06A6A"/>
    <g stroke="#2A211A" stroke-width="3.5" stroke-linecap="round" opacity=".5">
      <path d="M116 222h44M116 238h44M284 222h-44M284 238h-44"/>
    </g>`),
  slime: plush(`
    <path d="M200 116c54 0 100 60 100 114 0 42-44 62-100 62s-100-20-100-62c0-54 46-114 100-114Z" fill="#34D399"/>
    <path d="M200 116c54 0 100 60 100 114 0 42-44 62-100 62" fill="none" stroke="#0E9F6E" stroke-width="6" opacity=".45"/>
    <ellipse cx="166" cy="174" rx="24" ry="32" fill="#fff" opacity=".55" transform="rotate(-18 166 174)"/>
    <circle cx="174" cy="230" r="12" fill="#0B3B2E"/>
    <circle cx="226" cy="230" r="12" fill="#0B3B2E"/>
    <path d="M184 260c10 12 24 12 34 0" stroke="#0B3B2E" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  dragon: plush(`
    <path d="M196 218 82 164l14 88Z" fill="#A855F7"/>
    <path d="M204 218 318 164l-14 88Z" fill="#9333EA"/>
    <path d="M200 128 134 246h132Z" fill="#EC4899"/>
    <path d="M200 128 134 246h66Z" fill="#DB2777"/>
    <path d="M134 246h132l-66 62Z" fill="#F472B6"/>
    <path d="M134 246h66v62Z" fill="#EC4899"/>
    <circle cx="184" cy="214" r="9" fill="#fff"/>
    <circle cx="216" cy="214" r="9" fill="#fff"/>
    <circle cx="184" cy="214" r="4" fill="#3B0A2A"/>
    <circle cx="216" cy="214" r="4" fill="#3B0A2A"/>`),
}

/** A theme is software, so it is shot as the screen it changes. */
function screen({ bg, panel, accent, text }) {
  return `
    <g>
      <rect x="66" y="92" width="268" height="196" rx="16" fill="#2A2A2E"/>
      <rect x="74" y="100" width="252" height="180" rx="10" fill="${bg}"/>
      <rect x="74" y="100" width="252" height="30" rx="10" fill="${panel}"/>
      <rect x="74" y="118" width="252" height="12" fill="${panel}"/>
      <circle cx="92" cy="115" r="5" fill="${accent}"/>
      <rect x="106" y="110" width="48" height="10" rx="5" fill="${text}" opacity=".4"/>
      <rect x="94" y="152" width="118" height="15" rx="7" fill="${text}" opacity=".85"/>
      <rect x="94" y="178" width="170" height="8" rx="4" fill="${text}" opacity=".32"/>
      <rect x="94" y="194" width="140" height="8" rx="4" fill="${text}" opacity=".32"/>
      <rect x="94" y="220" width="76" height="24" rx="12" fill="${accent}"/>
      <rect x="182" y="220" width="58" height="24" rx="12" fill="${panel}"/>
      <path d="M170 288h60l8 26h-76Z" fill="#3A3A40"/>
      <rect x="140" y="312" width="120" height="10" rx="5" fill="#2A2A2E"/>
    </g>`
}

/** A sticker pack, shot as the physical sheet it would come on. */
function sheet(tints) {
  const faces = []
  const grid = [[140, 154], [200, 142], [260, 154], [128, 222], [200, 214], [272, 222], [158, 288], [242, 288]]
  grid.forEach(([x, y], i) => {
    const tint = tints[i % tints.length]
    const r = i === 4 ? 36 : 28
    faces.push(`
      <g>
        <circle cx="${x}" cy="${y}" r="${r + 5}" fill="#fff"/>
        <circle cx="${x}" cy="${y}" r="${r}" fill="${tint}"/>
        <circle cx="${x - r * 0.62}" cy="${y - r * 0.66}" r="${r * 0.3}" fill="${tint}"/>
        <circle cx="${x + r * 0.62}" cy="${y - r * 0.66}" r="${r * 0.3}" fill="${tint}"/>
        <circle cx="${x - r * 0.26}" cy="${y - r * 0.04}" r="${r * 0.12}" fill="#2A211A"/>
        <circle cx="${x + r * 0.26}" cy="${y - r * 0.04}" r="${r * 0.12}" fill="#2A211A"/>
        <path d="M${x - r * 0.22} ${y + r * 0.3}q${r * 0.22} ${r * 0.2} ${r * 0.44} 0"
              stroke="#2A211A" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>
      </g>`)
  })
  return `
    <g>
      <rect x="84" y="102" width="232" height="216" rx="12" fill="#fff"/>
      <rect x="84" y="102" width="232" height="216" rx="12" fill="none" stroke="#E4E4E8" stroke-width="3"/>
      <g stroke="#E4E4E8" stroke-width="2" stroke-dasharray="5 5">
        <path d="M84 210h232M200 102v216"/>
      </g>
      ${faces.join('')}
    </g>`
}

/** A frame, shot as the object rather than around anything. */
function frameObject(inner) {
  return `
    <g>
      <circle cx="200" cy="204" r="116" fill="#fff"/>
      <!-- The portrait a frame is always sold around. Kept grey so the border
           stays the product and the sitter stays the sample. -->
      <clipPath id="portrait"><circle cx="200" cy="204" r="116"/></clipPath>
      <g clip-path="url(#portrait)">
        <rect x="84" y="88" width="232" height="232" fill="#EDEDF0"/>
        <circle cx="200" cy="186" r="46" fill="#C9C9D2"/>
        <path d="M118 330c0-46 37-72 82-72s82 26 82 72Z" fill="#C9C9D2"/>
      </g>
      <circle cx="200" cy="204" r="116" fill="none" stroke="#E2E2E8" stroke-width="3"/>
      ${inner}
    </g>`
}

/**
 * One entry per catalogue item id.
 *
 * No per-item background: every one shares the studio ground, which is the
 * whole point of shooting a catalogue this way. Only the object changes.
 */
const ITEM_ART = {
  // Skins, shot as the garment you would be buying.
  1: () => garment({
        body: '#EFF1F5', shade: '#D6DAE3', trim: '#F97316', sleeve: 'long',
        chest: chestMark(`
          <rect x="-34" y="-26" width="68" height="46" rx="8" fill="#D6DAE3"/>
          <rect x="-26" y="-18" width="52" height="18" rx="4" fill="#8FA9C9"/>
          <circle cx="-14" cy="10" r="5" fill="#F97316"/>
          <circle cx="0" cy="10" r="5" fill="#9AA3B2"/>
          <circle cx="14" cy="10" r="5" fill="#9AA3B2"/>`),
      }),
  2: () => garment({
        body: '#FBF8F3', shade: '#E4DED4', sleeve: 'long',
        chest: `<path d="M200 130v186" stroke="#E4DED4" stroke-width="4" fill="none"/>
                <g fill="#E4DED4">
                  <circle cx="176" cy="170" r="6"/><circle cx="176" cy="204" r="6"/>
                  <circle cx="176" cy="238" r="6"/><circle cx="176" cy="272" r="6"/>
                </g>`,
      }),
  3: () => garment({
        body: '#26262B', shade: '#141417', hood: true, sleeve: 'long', trim: '#B0121A',
        chest: chestMark(wordmark('HAMSTER', '#B0121A', 12), 250),
      }),
  4: () => garment({
        body: '#20233A', shade: '#171A2C', sleeve: 'long',
        chest: `<path d="M170 128 200 244 230 128l-14-6-16 74-16-74Z" fill="#F5F5F7" opacity=".92"/>
                <path d="M186 268h28v10h-28Z" fill="#FBBF24"/>`,
      }),

  // Pets, shot as plush — which is what a cosmetic pet is: a soft toy.
  5: () => PLUSH.cat,
  6: () => PLUSH.slime,
  7: () => PLUSH.dragon,

  // Themes, shot as the screen they change.
  8:  () => screen({ bg: '#17161A', panel: '#232228', accent: '#F97316', text: '#F5F5F7' }),
  9:  () => screen({ bg: '#160E2E', panel: '#241546', accent: '#22D3EE', text: '#E9D5FF' }),
  10: () => screen({ bg: '#F2FBF4', panel: '#DCF3E3', accent: '#16A34A', text: '#14532D' }),
  11: () => screen({ bg: '#0F172A', panel: '#1E293B', accent: '#F472B6', text: '#E2E8F0' }),

  // Sticker packs, shot as the sheet.
  12: () => sheet(['#FDBA74', '#FCD34D', '#FB923C']),
  13: () => sheet(['#67E8F9', '#6EE7B7', '#5EEAD4']),
  14: () => sheet(['#F9A8D4', '#FCD34D', '#FDA4AF']),

  // Frames, shot as the object.
  15: () => frameObject(`
        <circle cx="200" cy="204" r="128" fill="none" stroke="#F1B419" stroke-width="17"/>
        <circle cx="200" cy="204" r="140" fill="none" stroke="#E09B0B" stroke-width="5" opacity=".65"/>
        <circle cx="291" cy="139" r="11" fill="#FDE68A"/>`),
  16: () => frameObject(`
        <circle cx="200" cy="204" r="128" fill="none" stroke="#EF5A1E" stroke-width="18"/>
        <g fill="#F9A825">
          <path d="M200 62c13 21 4 32 0 44-10-14-15-23 0-44Z"/>
          <path d="M342 204c-21 13-32 4-44 0 14-10 23-15 44 0Z"/>
          <path d="M200 346c-13-21-4-32 0-44 10 14 15 23 0 44Z"/>
          <path d="M58 204c21-13 32-4 44 0-14 10-23 15-44 0Z"/>
        </g>`),
  17: () => frameObject(`
        <circle cx="200" cy="204" r="128" fill="none" stroke="#65A30D" stroke-width="15"/>
        <g fill="#4D7C0F">
          <ellipse cx="200" cy="76" rx="25" ry="13"/>
          <ellipse cx="328" cy="204" rx="13" ry="25"/>
          <ellipse cx="200" cy="332" rx="25" ry="13"/>
          <ellipse cx="72" cy="204" rx="13" ry="25"/>
        </g>`),
  18: () => frameObject(`
        <circle cx="200" cy="204" r="128" fill="none" stroke="#6366F1" stroke-width="15"/>
        <g fill="#4F46E5">
          <circle cx="200" cy="76" r="8"/><circle cx="290" cy="124" r="5"/>
          <circle cx="328" cy="228" r="7"/><circle cx="244" cy="330" r="5"/>
          <circle cx="130" cy="322" r="8"/><circle cx="72" cy="222" r="5"/>
          <circle cx="106" cy="118" r="6"/>
        </g>`),
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
const productPage = shell(`
  <linearGradient id="studio" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#FAFAFB"/>
    <stop offset="58%" stop-color="#F1F1F3"/>
    <stop offset="100%" stop-color="#E7E7EA"/>
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
