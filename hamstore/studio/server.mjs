#!/usr/bin/env node
/**
 * HamStore Studio — the back office.
 *
 * The site itself is a static export, so it has no server to talk to and no
 * API routes it is allowed to declare. This is that server, kept separate and
 * deliberately small: it reads and writes `content/site.json`, accepts image
 * uploads into `public/uploads/`, and can kick off a rebuild. Nothing else.
 *
 * No dependencies — node:http and node:fs only. `npm run studio` and it runs.
 *
 *   GET  /                → the editor
 *   GET  /api/content     → current site.json
 *   PUT  /api/content     → validate, back up, write site.json
 *   POST /api/upload      → save an image, return its public path
 *   POST /api/build       → run `npm run build` so the change goes live
 *   GET  /uploads/<file>  → serve an uploaded image back to the editor
 *
 * Auth is a shared token in HAMSTORE_STUDIO_TOKEN. When it isn't set the
 * server binds to 127.0.0.1 and says so — fine on your own machine, not
 * something to expose without setting the token first.
 */

import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = path.join(ROOT, 'content', 'site.json')
const BACKUPS = path.join(ROOT, 'content', 'backups')
const UPLOADS = path.join(ROOT, 'public', 'uploads')
const EDITOR = path.join(ROOT, 'studio', 'index.html')

const PORT = Number(process.env.PORT || 4321)
const TOKEN = process.env.HAMSTORE_STUDIO_TOKEN || ''
const HOST = TOKEN ? '0.0.0.0' : '127.0.0.1'

/* Images only, and only the formats a browser will actually render. */
const IMAGE_TYPES = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
}
const MAX_UPLOAD = 8 * 1024 * 1024

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function authorized(req) {
  if (!TOKEN) return true
  const header = req.headers.authorization || ''
  return header === `Bearer ${TOKEN}`
}

async function readBody(req, limit) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new Error('too large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

/**
 * Reject a payload that would break the site before it reaches disk.
 * A studio that can save a file the build then chokes on is worse than one
 * that refuses — the person editing copy has no way to read a webpack trace.
 */
function validate(next) {
  const problems = []
  const need = (cond, msg) => { if (!cond) problems.push(msg) }

  need(next && typeof next === 'object', 'ไฟล์ไม่ใช่ object')
  if (problems.length) return problems

  need(Array.isArray(next.items), 'items ต้องเป็น array')
  need(Array.isArray(next.assets), 'assets ต้องเป็น array')
  need(next.store && next.library && next.nav && next.footer, 'ขาดส่วน nav/store/library/footer')

  for (const item of next.items ?? []) {
    need(typeof item.id === 'number', `item ${item?.name ?? '?'}: id ต้องเป็นตัวเลข`)
    need(typeof item.name === 'string' && item.name.trim(), `item ${item.id}: ชื่อว่างไม่ได้`)
    need(Number.isFinite(item.coins) && item.coins >= 0, `item ${item.id}: ราคาต้องเป็นตัวเลขไม่ติดลบ`)
    need(Number.isFinite(item.sale) && item.sale >= 0 && item.sale < 100, `item ${item.id}: ส่วนลดต้องอยู่ 0–99`)
    need(Array.isArray(item.art) && item.art.length === 2, `item ${item.id}: art ต้องมีสองสี`)
  }
  for (const asset of next.assets ?? []) {
    need(typeof asset.id === 'number', `asset ${asset?.title ?? '?'}: id ต้องเป็นตัวเลข`)
    need(typeof asset.title === 'string' && asset.title.trim(), `asset ${asset.id}: ชื่อว่างไม่ได้`)
    need(Number.isFinite(asset.size) && asset.size >= 0, `asset ${asset.id}: ขนาดไฟล์ต้องเป็นตัวเลข`)
    need(Number.isFinite(asset.coins) && asset.coins >= 0, `asset ${asset.id}: ราคาต้องเป็นตัวเลขไม่ติดลบ`)
    need(Number.isFinite(asset.sale) && asset.sale >= 0 && asset.sale < 100, `asset ${asset.id}: ส่วนลดต้องอยู่ 0–99`)
    need(!asset.owned || asset.purchasedAt, `asset ${asset.id}: ตั้งเป็นซื้อแล้วต้องมีวันที่แลก`)
  }

  const ids = (next.items ?? []).map(i => i.id)
  need(new Set(ids).size === ids.length, 'มี item id ซ้ำกัน')

  /* Every recommendation has to point at something that still exists —
     otherwise the shelf renders four empty cards after a delete. */
  for (const pick of next.recommended ?? []) {
    need(ids.includes(pick.id), `แนะนำ id ${pick.id} แต่ไม่มีไอเทมนี้แล้ว`)
  }

  return problems
}

async function writeContent(next) {
  await fs.mkdir(BACKUPS, { recursive: true })
  /* Keep the version being replaced. Editing copy should never be the thing
     that loses an afternoon's work. */
  const previous = await fs.readFile(CONTENT, 'utf8').catch(() => null)
  if (previous) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    await fs.writeFile(path.join(BACKUPS, `site-${stamp}.json`), previous)
    const kept = (await fs.readdir(BACKUPS)).filter(f => f.startsWith('site-')).sort()
    for (const old of kept.slice(0, -20)) await fs.unlink(path.join(BACKUPS, old))
  }
  await fs.writeFile(CONTENT, JSON.stringify(next, null, 2) + '\n')
}

function safeName(name) {
  const base = path.basename(name || 'image').replace(/[^\w.-]+/g, '-').slice(0, 60)
  return base || 'image'
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  try {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      return res.end(await fs.readFile(EDITOR))
    }

    /* Uploaded images, so the editor can preview what it just saved. */
    if (url.pathname.startsWith('/uploads/')) {
      const file = path.join(UPLOADS, path.basename(url.pathname))
      const body = await fs.readFile(file).catch(() => null)
      if (!body) return json(res, 404, { error: 'ไม่พบไฟล์' })
      const ext = path.extname(file)
      const type = Object.entries(IMAGE_TYPES).find(([, e]) => e === ext)?.[0] || 'application/octet-stream'
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' })
      return res.end(body)
    }

    if (!url.pathname.startsWith('/api/')) return json(res, 404, { error: 'ไม่พบหน้านี้' })
    if (!authorized(req)) return json(res, 401, { error: 'token ไม่ถูกต้อง' })

    if (url.pathname === '/api/content' && req.method === 'GET') {
      const body = JSON.parse(await fs.readFile(CONTENT, 'utf8'))
      return json(res, 200, body)
    }

    if (url.pathname === '/api/content' && req.method === 'PUT') {
      const raw = await readBody(req, 4 * 1024 * 1024)
      let next
      try {
        next = JSON.parse(raw.toString('utf8'))
      } catch {
        return json(res, 400, { error: 'JSON เสีย' })
      }
      const problems = validate(next)
      if (problems.length) return json(res, 422, { error: 'ข้อมูลไม่ผ่านการตรวจ', problems })
      await writeContent(next)
      return json(res, 200, { ok: true, savedAt: new Date().toISOString() })
    }

    if (url.pathname === '/api/upload' && req.method === 'POST') {
      const type = (req.headers['content-type'] || '').split(';')[0].trim()
      const ext = IMAGE_TYPES[type]
      if (!ext) return json(res, 415, { error: `รับเฉพาะรูป: ${Object.keys(IMAGE_TYPES).join(', ')}` })

      let body
      try {
        body = await readBody(req, MAX_UPLOAD)
      } catch {
        return json(res, 413, { error: 'ไฟล์ใหญ่เกิน 8 MB' })
      }
      if (!body.length) return json(res, 400, { error: 'ไฟล์ว่าง' })

      await fs.mkdir(UPLOADS, { recursive: true })
      const stem = safeName(url.searchParams.get('name') || 'image').replace(/\.[^.]+$/, '')
      const file = `${Date.now()}-${stem}${ext}`
      await fs.writeFile(path.join(UPLOADS, file), body)
      return json(res, 200, { path: `/uploads/${file}`, bytes: body.length })
    }

    if (url.pathname === '/api/build' && req.method === 'POST') {
      const child = spawn('npm', ['run', 'build'], { cwd: ROOT })
      let log = ''
      child.stdout.on('data', d => { log += d })
      child.stderr.on('data', d => { log += d })
      child.on('close', code => {
        json(res, code === 0 ? 200 : 500, { ok: code === 0, log: log.slice(-4000) })
      })
      return
    }

    return json(res, 404, { error: 'ไม่พบ endpoint นี้' })
  } catch (err) {
    return json(res, 500, { error: String(err?.message || err) })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`\n  HamStore Studio  →  http://localhost:${PORT}`)
  console.log(`  แก้ไข            →  ${path.relative(process.cwd(), CONTENT)}`)
  console.log(`  รูปที่อัปโหลด      →  ${path.relative(process.cwd(), UPLOADS)}`)
  console.log(
    TOKEN
      ? `  auth             →  ต้องใส่ token (HAMSTORE_STUDIO_TOKEN)\n`
      : `  auth             →  ไม่ได้ตั้ง token จึงเปิดเฉพาะเครื่องนี้ (127.0.0.1)\n`,
  )
})
