#!/usr/bin/env node
/**
 * Puts your own photographs on the cards.
 *
 * The drawn covers are a stand-in. When you have real photographs — a shirt,
 * a cushion, a lamp, shot yourself or taken from a library that permits it —
 * this is how they get in without opening the studio eighteen times.
 *
 *   node tools/import-photos.mjs ~/photos
 *   node tools/import-photos.mjs ~/photos --assets     # page two instead
 *   node tools/import-photos.mjs ~/photos --dry        # report, change nothing
 *   node tools/import-photos.mjs links.txt             # a list of image URLs
 *
 * A links file is one URL per line, optionally with the item id in front —
 * `3 https://…`. Bare lines take rows in order. Nothing is downloaded: the
 * URL is stored and the visitor's browser fetches it, which is why this works
 * even where the photo hosts are unreachable from here.
 *
 * Matching, in order of preference:
 *
 *   1. The filename starts with the item's id — `7.jpg`, `07-lamp.jpg`,
 *      `item-7.png`. Unambiguous, so this wins.
 *   2. The filename contains the item's name — `แฮมพ่อครัว.jpg`, or a slug of
 *      it like `chef-hamster.jpg` against an item named that.
 *   3. Nothing matched, and the file is reported rather than guessed at.
 *
 * Nothing is overwritten in place: every import is copied in under a fresh
 * name, so the previous cover stays on disk and reverting is a git checkout.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const UPLOADS = path.join(ROOT, 'public', 'uploads')
const CONTENT = path.join(ROOT, 'content', 'site.json')

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

/** Loose comparison, so "Chef Hamster" matches "chef-hamster". */
const slug = s =>
  s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, '')

function matchRow(file, rows, labelOf) {
  const base = path.basename(file, path.extname(file))

  /* An id at the front of the name is explicit — take it and stop. */
  const leading = base.match(/^(?:item|asset)?[-_ ]?(\d+)\b/)
  if (leading) {
    const byId = rows.find(r => r.id === Number(leading[1]))
    if (byId) return { row: byId, how: `id ${leading[1]}` }
  }

  const key = slug(base)
  if (key.length >= 3) {
    const byName = rows.find(r => {
      const label = slug(labelOf(r))
      return label.length >= 3 && (key.includes(label) || label.includes(key))
    })
    if (byName) return { row: byName, how: `ชื่อ “${labelOf(byName)}”` }
  }

  return null
}

/** A links file: one URL per line, `id url` to name a row outright. */
async function importLinks(file, rows, labelOf, dry) {
  const lines = (await fs.readFile(file, 'utf8'))
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  const taken = new Set()
  let cursor = 0
  const plan = []

  for (const line of lines) {
    const explicit = line.match(/^(\d+)\s*[=\s]\s*(\S+)$/)
    const url = explicit ? explicit[2] : line
    const ok = /^https?:\/\/\S+$/i.test(url)

    let row = null
    if (explicit) row = rows.find(r => r.id === Number(explicit[1])) ?? null
    else {
      while (cursor < rows.length && taken.has(rows[cursor].id)) cursor++
      row = rows[cursor] ?? null
    }
    if (row) taken.add(row.id)
    plan.push({ url, row, ok })
  }

  console.log(`\n  ${lines.length} บรรทัดใน ${file}\n`)
  for (const { url, row, ok } of plan) {
    const target = !ok ? 'ไม่ใช่ลิงก์' : row ? labelOf(row) : 'ไม่มีไอเทมให้ใส่'
    console.log(`  ${ok && row ? '✓' : '·'} ${target.padEnd(24)} ${url.slice(0, 64)}`)
  }

  const usable = plan.filter(p => p.ok && p.row)
  if (dry) {
    console.log(`\n  ดูอย่างเดียว ยังไม่ได้แก้อะไร\n`)
    return null
  }
  for (const { url, row } of usable) row.image = url
  return usable.length
}

async function main() {
  const args = process.argv.slice(2)
  const dir = args.find(a => !a.startsWith('--'))
  const dry = args.includes('--dry')
  const toAssets = args.includes('--assets')

  if (!dir) {
    console.error(`
  ใส่รูปจริงลงการ์ด

    node tools/import-photos.mjs <โฟลเดอร์รูป>            # ไฟล์ในเครื่อง
    node tools/import-photos.mjs <ไฟล์ลิงก์.txt>          # ลิงก์รูป บรรทัดละอัน
    node tools/import-photos.mjs <ที่อยู่> --assets       # หน้า Unity Asset
    node tools/import-photos.mjs <ที่อยู่> --dry          # ดูผลก่อน ไม่แก้อะไร

  ไฟล์:   ตั้งชื่อให้ตรงกับไอเทม — 3.jpg / item-3.jpg / แฮมนินจา.jpg
  ลิงก์:  บรรทัดละหนึ่ง URL หรือ "3 https://…" เพื่อระบุไอเทม
`)
    process.exit(1)
  }

  const source = path.resolve(dir)

  /* A file rather than a folder means a list of links. */
  const stat = await fs.stat(source).catch(() => null)
  if (stat?.isFile()) {
    const site = JSON.parse(await fs.readFile(CONTENT, 'utf8'))
    const rows = toAssets ? site.assets : site.items
    const n = await importLinks(source, rows, r => (toAssets ? r.title : r.name), dry)
    if (n === null) return
    await fs.writeFile(CONTENT, JSON.stringify(site, null, 2) + '\n')
    console.log(`
  ใส่ลิงก์แล้ว ${n} อัน
  ต่อไป:  npm run build
  ย้อนกลับ:  git checkout content/site.json
`)
    return
  }

  const entries = await fs.readdir(source).catch(() => null)
  if (!entries) {
    console.error(`\n  ไม่พบโฟลเดอร์: ${source}\n`)
    process.exit(1)
  }

  const photos = entries.filter(f => EXTENSIONS.has(path.extname(f).toLowerCase())).sort()
  if (!photos.length) {
    console.error(`\n  ไม่เจอไฟล์รูปใน ${source}\n`)
    process.exit(1)
  }

  const site = JSON.parse(await fs.readFile(CONTENT, 'utf8'))
  const rows = toAssets ? site.assets : site.items
  const labelOf = r => (toAssets ? r.title : r.name)

  await fs.mkdir(UPLOADS, { recursive: true })

  const matched = []
  const unmatched = []
  const taken = new Set()

  for (const file of photos) {
    const hit = matchRow(file, rows, labelOf)
    if (!hit || taken.has(hit.row.id)) {
      unmatched.push({ file, why: hit ? `ชนกับรูปก่อนหน้าที่จับคู่ ${labelOf(hit.row)}` : 'จับคู่ไม่ได้' })
      continue
    }
    taken.add(hit.row.id)
    matched.push({ file, ...hit })
  }

  console.log(`\n  ${photos.length} ไฟล์ใน ${source}\n`)
  for (const { file, row, how } of matched) {
    console.log(`  ✓ ${file.padEnd(28)} → ${labelOf(row)}   (${how})`)
  }
  for (const { file, why } of unmatched) {
    console.log(`  · ${file.padEnd(28)} → ${why}`)
  }

  if (dry) {
    console.log(`\n  ดูอย่างเดียว ยังไม่ได้แก้อะไร\n`)
    return
  }

  const stamp = Date.now()
  for (const { file, row } of matched) {
    const ext = path.extname(file).toLowerCase()
    const name = `${toAssets ? 'asset' : 'item'}-${row.id}-${stamp}${ext}`
    await fs.copyFile(path.join(source, file), path.join(UPLOADS, name))
    row.image = `/uploads/${name}`
  }

  await fs.writeFile(CONTENT, JSON.stringify(site, null, 2) + '\n')

  console.log(`
  ใส่รูปแล้ว ${matched.length} ชิ้น${unmatched.length ? `  (ข้าม ${unmatched.length})` : ''}
  ต่อไป:  npm run build   แล้วรูปจะขึ้นในเว็บ
  ย้อนกลับ:  git checkout content/site.json
`)
}

main()
