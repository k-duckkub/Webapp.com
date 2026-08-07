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

/** The hamster, drawn once and dressed differently per item. */
function hamster({ fur = '#C89B6A', belly = '#F0DCC2', pose = 'stand' } = {}) {
  const lean = pose === 'sneak' ? 'rotate(-8 200 250)' : ''
  return `
  <g transform="${lean}">
    <!-- ears -->
    <circle cx="139" cy="132" r="34" fill="${fur}"/>
    <circle cx="261" cy="132" r="34" fill="${fur}"/>
    <circle cx="139" cy="132" r="19" fill="#E6A6A6" opacity=".75"/>
    <circle cx="261" cy="132" r="19" fill="#E6A6A6" opacity=".75"/>

    <!-- body -->
    <path d="M200 316c-58 0-96-33-96-79 0-52 43-95 96-95s96 43 96 95c0 46-38 79-96 79Z" fill="${fur}"/>
    <ellipse cx="200" cy="243" rx="60" ry="62" fill="${belly}"/>

    <!-- paws -->
    <ellipse cx="146" cy="300" rx="26" ry="18" fill="${fur}"/>
    <ellipse cx="254" cy="300" rx="26" ry="18" fill="${fur}"/>

    <!-- face -->
    <circle cx="172" cy="196" r="10" fill="#2A211A"/>
    <circle cx="228" cy="196" r="10" fill="#2A211A"/>
    <circle cx="175" cy="192" r="3.4" fill="#fff"/>
    <circle cx="231" cy="192" r="3.4" fill="#fff"/>
    <ellipse cx="200" cy="220" rx="9" ry="6.5" fill="#8A5A4A"/>
    <path d="M191 231c5 5 13 5 18 0" stroke="#8A5A4A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="152" cy="218" r="13" fill="#E89A9A" opacity=".45"/>
    <circle cx="248" cy="218" r="13" fill="#E89A9A" opacity=".45"/>
    <g stroke="#7A5B44" stroke-width="3" stroke-linecap="round" opacity=".6">
      <path d="M120 210h30M120 224h30M280 210h-30M280 224h-30"/>
    </g>
  </g>`
}

/** Outfits. Each is drawn over the hamster and reads as the thing you buy. */
const OUTFITS = {
  astronaut: `
    <g>
      <path d="M200 300c-52 0-84-26-84-62 0-14 4-26 11-36h146c7 10 11 22 11 36 0 36-32 62-84 62Z" fill="#E8EAF0"/>
      <rect x="150" y="278" width="100" height="16" rx="8" fill="#F97316"/>
      <circle cx="200" cy="196" r="112" fill="#BBD6F5" opacity=".38"/>
      <circle cx="200" cy="196" r="112" fill="none" stroke="#fff" stroke-width="7" opacity=".9"/>
      <path d="M124 150a112 112 0 0 1 62-48" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".85"/>
      <rect x="290" y="176" width="30" height="42" rx="10" fill="#E8EAF0"/>
    </g>`,
  chef: `
    <g>
      <path d="M200 296c-46 0-76-22-76-52 0-9 2-17 5-24h142c3 7 5 15 5 24 0 30-30 52-76 52Z" fill="#FBF7F2"/>
      <path d="M158 220h84v-8h-84Z" fill="#E2DCD2"/>
      <path d="M143 128c-15 0-26-11-26-25s11-25 26-25c3-16 17-27 34-27 12 0 22 6 28 15 6-9 16-15 28-15 17 0 31 11 34 27 15 0 26 11 26 25s-11 25-26 25Z" fill="#FBF7F2"/>
      <rect x="139" y="126" width="122" height="22" rx="9" fill="#EFE9E0"/>
      <circle cx="200" cy="258" r="7" fill="#D8CEC0"/>
      <circle cx="200" cy="284" r="7" fill="#D8CEC0"/>
    </g>`,
  ninja: `
    <g>
      <path d="M200 316c-58 0-96-33-96-79 0-52 43-95 96-95s96 43 96 95c0 46-38 79-96 79Z" fill="#26262B"/>
      <path d="M108 196c22-16 55-26 92-26s70 10 92 26v-12c0-46-42-82-92-82s-92 36-92 82Z" fill="#17171A"/>
      <rect x="106" y="188" width="188" height="34" rx="16" fill="#17171A"/>
      <circle cx="172" cy="205" r="9" fill="#F5F5F7"/>
      <circle cx="228" cy="205" r="9" fill="#F5F5F7"/>
      <circle cx="172" cy="205" r="4" fill="#26262B"/>
      <circle cx="228" cy="205" r="4" fill="#26262B"/>
      <!-- Headband, tied at the side. The tail trails behind the head rather
           than jutting out of it, which read as a beak. -->
      <path d="M292 186c26 6 42 22 46 44-18-10-34-14-48-12Z" fill="#B0121A" opacity=".95"/>
      <rect x="104" y="176" width="192" height="16" rx="8" fill="#B0121A"/>
    </g>`,
  graduate: `
    <g>
      <path d="M200 300c-50 0-82-24-82-58 0-11 3-21 8-29h148c5 8 8 18 8 29 0 34-32 58-82 58Z" fill="#1F2233"/>
      <!-- Gown collar: two lapels meeting in a V, not a block of white. -->
      <path d="M160 244l40 34-6-46Z" fill="#F5F5F7"/>
      <path d="M240 244l-40 34 6-46Z" fill="#E8E8EE"/>
      <path d="M200 82 96 124l104 42 104-42Z" fill="#1F2233"/>
      <rect x="176" y="150" width="48" height="16" rx="6" fill="#151827"/>
      <path d="M296 130v54" stroke="#FBBF24" stroke-width="7" stroke-linecap="round"/>
      <circle cx="296" cy="190" r="13" fill="#FBBF24"/>
    </g>`,
}

/** Pets get their own creature rather than a dressed hamster. */
const CREATURES = {
  cat: `
    <g>
      <path d="M126 168 148 96l46 40Z" fill="#F5A524"/>
      <path d="M274 168 252 96l-46 40Z" fill="#F5A524"/>
      <ellipse cx="200" cy="212" rx="98" ry="86" fill="#F5A524"/>
      <ellipse cx="200" cy="300" rx="74" ry="42" fill="#E08C10"/>
      <path d="M274 300c40-6 62-32 56-64" stroke="#F5A524" stroke-width="26" fill="none" stroke-linecap="round"/>
      <ellipse cx="168" cy="204" rx="11" ry="15" fill="#2A211A"/>
      <ellipse cx="232" cy="204" rx="11" ry="15" fill="#2A211A"/>
      <path d="M188 234h24l-12 12Z" fill="#E06A6A"/>
      <g stroke="#2A211A" stroke-width="3.5" stroke-linecap="round" opacity=".55">
        <path d="M110 220h44M110 236h44M290 220h-44M290 236h-44"/>
      </g>
    </g>`,
  slime: `
    <g>
      <path d="M200 108c56 0 104 62 104 118 0 44-46 66-104 66S96 270 96 226c0-56 48-118 104-118Z" fill="#34D399" opacity=".92"/>
      <path d="M200 108c56 0 104 62 104 118 0 44-46 66-104 66" fill="none" stroke="#0E9F6E" stroke-width="6" opacity=".5"/>
      <ellipse cx="164" cy="168" rx="26" ry="34" fill="#fff" opacity=".55" transform="rotate(-18 164 168)"/>
      <circle cx="172" cy="226" r="12" fill="#0B3B2E"/>
      <circle cx="228" cy="226" r="12" fill="#0B3B2E"/>
      <path d="M182 258c10 12 26 12 36 0" stroke="#0B3B2E" stroke-width="6" fill="none" stroke-linecap="round"/>
    </g>`,
  dragon: `
    <g>
      <!-- Wings meet the body instead of hovering beside it, and the folds
           read as creases in one sheet rather than separate shapes. -->
      <path d="M196 214 78 158l14 92Z" fill="#A855F7"/>
      <path d="M204 214 322 158l-14 92Z" fill="#9333EA"/>
      <path d="M200 120 130 246h140Z" fill="#EC4899"/>
      <path d="M200 120 130 246h70Z" fill="#DB2777"/>
      <path d="M130 246h140l-70 66Z" fill="#F472B6"/>
      <path d="M130 246h70v66Z" fill="#EC4899"/>
      <circle cx="182" cy="212" r="9" fill="#fff"/>
      <circle cx="218" cy="212" r="9" fill="#fff"/>
      <circle cx="182" cy="212" r="4" fill="#3B0A2A"/>
      <circle cx="218" cy="212" r="4" fill="#3B0A2A"/>
    </g>`,
}

/** A theme is a website, so the cover is one — a little page in that palette. */
function themeMock({ bg, panel, accent, text }) {
  return `
    <g>
      <rect x="52" y="76" width="296" height="248" rx="22" fill="${bg}"/>
      <rect x="52" y="76" width="296" height="44" rx="22" fill="${panel}"/>
      <rect x="52" y="98" width="296" height="22" fill="${panel}"/>
      <circle cx="76" cy="98" r="7" fill="${accent}"/>
      <rect x="94" y="92" width="60" height="12" rx="6" fill="${text}" opacity=".45"/>
      <rect x="76" y="146" width="150" height="18" rx="9" fill="${text}" opacity=".85"/>
      <rect x="76" y="176" width="210" height="10" rx="5" fill="${text}" opacity=".35"/>
      <rect x="76" y="194" width="176" height="10" rx="5" fill="${text}" opacity=".35"/>
      <rect x="76" y="228" width="92" height="30" rx="15" fill="${accent}"/>
      <rect x="184" y="228" width="72" height="30" rx="15" fill="${panel}"/>
      <rect x="76" y="280" width="248" height="12" rx="6" fill="${text}" opacity=".18"/>
    </g>`
}

/** A sticker pack is a sheet of faces. */
function stickerSheet(tints) {
  const faces = []
  const grid = [
    [128, 150], [200, 132], [272, 150],
    [116, 232], [200, 214], [284, 232],
    [150, 306], [250, 306],
  ]
  grid.forEach(([x, y], i) => {
    const tint = tints[i % tints.length]
    const r = i === 4 ? 52 : 40
    faces.push(`
      <g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>
        <circle cx="${x}" cy="${y}" r="${r - 6}" fill="${tint}"/>
        <circle cx="${x - r * 0.62}" cy="${y - r * 0.66}" r="${r * 0.3}" fill="${tint}"/>
        <circle cx="${x + r * 0.62}" cy="${y - r * 0.66}" r="${r * 0.3}" fill="${tint}"/>
        <circle cx="${x - r * 0.28}" cy="${y - r * 0.06}" r="${r * 0.12}" fill="#2A211A"/>
        <circle cx="${x + r * 0.28}" cy="${y - r * 0.06}" r="${r * 0.12}" fill="#2A211A"/>
        <path d="M${x - r * 0.24} ${y + r * 0.3}q${r * 0.24} ${r * 0.22} ${r * 0.48} 0"
              stroke="#2A211A" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>
      </g>`)
  })
  return faces.join('')
}

/** A frame is a frame — shown around a portrait so the product is the border. */
function portraitFrame(inner) {
  return `
    <g>
      <circle cx="200" cy="200" r="118" fill="#F1EDE6"/>
      <g transform="translate(0,26) scale(0.62) translate(122,60)">${hamster()}</g>
      <circle cx="200" cy="200" r="118" fill="none" stroke="#fff" stroke-width="10"/>
      ${inner}
    </g>`
}

/* ------------------------------------------------------------------ specs */

/** One entry per catalogue item id. */
const ITEM_ART = {
  1:  { bg: ['#4C1D95', '#1E3A8A'], art: () => hamster({ fur: '#D8B78C' }) + OUTFITS.astronaut },
  2:  { bg: ['#DC2626', '#F97316'], art: () => hamster({ fur: '#C89B6A' }) + OUTFITS.chef },
  3:  { bg: ['#18181B', '#5B21B6'], art: () => OUTFITS.ninja },
  4:  { bg: ['#1E1B33', '#B45309'], art: () => hamster({ fur: '#C89B6A' }) + OUTFITS.graduate },

  5:  { bg: ['#F59E0B', '#DC2626'], art: () => CREATURES.cat },
  6:  { bg: ['#047857', '#0891B2'], art: () => CREATURES.slime },
  7:  { bg: ['#BE185D', '#6D28D9'], art: () => CREATURES.dragon },

  8:  { bg: ['#111014', '#F97316'], art: () => themeMock({ bg: '#17161A', panel: '#232228', accent: '#F97316', text: '#F5F5F7' }) },
  9:  { bg: ['#4C1D95', '#0E7490'], art: () => themeMock({ bg: '#160E2E', panel: '#241546', accent: '#22D3EE', text: '#E9D5FF' }) },
  10: { bg: ['#047857', '#CA8A04'], art: () => themeMock({ bg: '#F2FBF4', panel: '#DCF3E3', accent: '#16A34A', text: '#14532D' }) },
  11: { bg: ['#1D4ED8', '#BE185D'], art: () => themeMock({ bg: '#0F172A', panel: '#1E293B', accent: '#F472B6', text: '#E2E8F0' }) },

  12: { bg: ['#F97316', '#EAB308'], art: () => stickerSheet(['#FDBA74', '#FCD34D', '#FB923C']) },
  13: { bg: ['#0891B2', '#059669'], art: () => stickerSheet(['#67E8F9', '#6EE7B7', '#5EEAD4']) },
  14: { bg: ['#DB2777', '#F59E0B'], art: () => stickerSheet(['#F9A8D4', '#FCD34D', '#FDA4AF']) },

  15: { bg: ['#B45309', '#FBBF24'], art: () => portraitFrame(`
        <circle cx="200" cy="200" r="132" fill="none" stroke="#FBBF24" stroke-width="16"/>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#F59E0B" stroke-width="6" opacity=".7"/>
        <circle cx="318" cy="146" r="13" fill="#FDE68A"/>`) },
  16: { bg: ['#B91C1C', '#F97316'], art: () => portraitFrame(`
        <circle cx="200" cy="200" r="134" fill="none" stroke="#F97316" stroke-width="18"/>
        <g fill="#FBBF24">
          <path d="M200 48c14 22 4 34 0 46-10-14-16-24 0-46Z"/>
          <path d="M332 200c-22 14-34 4-46 0 14-10 24-16 46 0Z"/>
          <path d="M200 352c-14-22-4-34 0-46 10 14 16 24 0 46Z"/>
          <path d="M68 200c22-14 34-4 46 0-14 10-24 16-46 0Z"/>
        </g>`) },
  17: { bg: ['#047857', '#65A30D'], art: () => portraitFrame(`
        <circle cx="200" cy="200" r="132" fill="none" stroke="#65A30D" stroke-width="14"/>
        <g fill="#4D7C0F">
          <ellipse cx="200" cy="66" rx="26" ry="14"/>
          <ellipse cx="334" cy="200" rx="14" ry="26"/>
          <ellipse cx="200" cy="334" rx="26" ry="14"/>
          <ellipse cx="66" cy="200" rx="14" ry="26"/>
        </g>`) },
  18: { bg: ['#1D4ED8', '#6D28D9'], art: () => portraitFrame(`
        <circle cx="200" cy="200" r="134" fill="none" stroke="#818CF8" stroke-width="14"/>
        <g fill="#E0E7FF">
          <circle cx="200" cy="60" r="9"/><circle cx="312" cy="118" r="6"/>
          <circle cx="340" cy="232" r="8"/><circle cx="248" cy="336" r="6"/>
          <circle cx="126" cy="330" r="9"/><circle cx="58" cy="216" r="6"/>
          <circle cx="92" cy="104" r="7"/>
        </g>`) },
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

const page = (bg, body) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent}
  svg{display:block}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg[0]}"/><stop offset="100%" stop-color="${bg[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="400" fill="url(#glow)"/>
  ${body}
</svg></body></html>`

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
    await tab.setContent(page(spec.bg, spec.art()))
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
      page([asset.color, '#0b0a09'], placeholder({ label: cat.label, color: asset.color, glyph: GLYPHS[asset.category] })),
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
