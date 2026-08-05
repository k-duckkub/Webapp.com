'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK, MOTION_REDUCED } from '@/lib/gsap'
import { OWNED_ASSETS, formatSize } from '@/lib/library'

const totalSize = OWNED_ASSETS.reduce((sum, a) => sum + a.size, 0)
const updateCount = OWNED_ASSETS.filter(a => a.hasUpdate).length
const publisherCount = new Set(OWNED_ASSETS.map(a => a.publisher)).size

const STATS = [
  { id: 'assets',     value: OWNED_ASSETS.length, label: 'asset ที่ซื้อแล้ว', suffix: '' },
  { id: 'size',       value: totalSize,           label: 'ขนาดรวม',          suffix: '', format: formatSize },
  { id: 'updates',    value: updateCount,         label: 'มีอัปเดตใหม่',      suffix: '' },
  { id: 'publishers', value: publisherCount,      label: 'ผู้พัฒนา',          suffix: '' },
]

export function LibraryHero() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-lib-title] > *', { y: 26, opacity: 0, stagger: 0.1, duration: 0.6 })

      /* Count each stat up from zero. */
      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach(el => {
        const target = Number(el.dataset.statValue)
        const isSize = el.dataset.statFormat === 'size'
        const counter = { n: 0 }

        gsap.to(counter, {
          n: target,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.25,
          onUpdate: () => {
            el.textContent = isSize
              ? formatSize(counter.n)
              : Math.round(counter.n).toLocaleString('th-TH')
          },
        })
      })
    })

    mm.add(MOTION_REDUCED, () => {
      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach(el => {
        const target = Number(el.dataset.statValue)
        el.textContent =
          el.dataset.statFormat === 'size'
            ? formatSize(target)
            : Math.round(target).toLocaleString('th-TH')
      })
    })
  })

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1a0a3a 0%, #0a1a3a 55%, #0d2a1a 100%)' }}
      />
      <div className="bg-grid absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div data-lib-title className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            HamStore · คลังของฉัน
          </p>
          <h1 className="mb-3 text-3xl font-black leading-tight text-white sm:text-4xl">
            Unity Asset ที่คุณซื้อไว้
          </h1>
          <p className="text-sm leading-relaxed text-white/60">
            ทุกชิ้นที่แลกด้วย HamCoin ไปแล้วจะมาอยู่ที่นี่ถาวร — ดาวน์โหลดซ้ำได้ไม่จำกัด
            และดูได้ว่าชิ้นไหนมีเวอร์ชันใหม่ให้อัปเดต
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(stat => (
            <div
              key={stat.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur"
            >
              <dd
                data-stat-value={stat.value}
                data-stat-format={stat.format ? 'size' : 'number'}
                className="text-xl font-black tabular-nums text-white"
              >
                {stat.format ? stat.format(stat.value) : stat.value.toLocaleString('th-TH')}
              </dd>
              <dt className="mt-0.5 text-xs text-white/50">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
