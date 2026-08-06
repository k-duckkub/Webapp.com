'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'

const ORDER: ItemKind[] = ['skin', 'pet', 'theme', 'emoji', 'frame']

const COPY: Record<ItemKind, string> = {
  skin:  'เปลี่ยนหน้าตาแฮมสเตอร์ประจำตัวคุณ ทุกคนที่เปิดโปรไฟล์คุณจะเห็นทันที',
  pet:   'เพื่อนตัวเล็กที่เดินตามคุณไปทั่วเว็บ บางตัวเปลี่ยนสีตามธีมที่ใช้อยู่ด้วย',
  theme: 'เปลี่ยนสีทั้งเว็บ HamsterHub ตั้งแต่พื้นหลังยันปุ่ม เลือกให้เข้ากับเวลาที่คุณนั่งโค้ด',
  emoji: 'ชุดอิโมจิเฉพาะของ HamsterHub ใช้ได้ทั้งในคอมเมนต์ ฟอรัม และแชท',
  frame: 'กรอบรอบรูปโปรไฟล์ บางอันมีประกายหรือเปลวไฟขยับได้',
}

const BANDS = ORDER.map((kind, i) => ({
  kind,
  meta: KIND_META[kind],
  copy: COPY[kind],
  items: PLATFORM_ITEMS.filter(item => item.kind === kind),
  /* Alternate which side the art lands on, band by band. */
  artRight: i % 2 === 1,
}))

export function CategoryBands() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-band]').forEach(band => {
        gsap.from(band.querySelector('[data-band-copy]'), {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: band, start: 'top 78%' },
        })

        /* Fade the art in on its own element — the drift below writes a
           transform on the inner layer, so the two never fight over one. */
        gsap.from(band.querySelector('[data-band-art]'), {
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: band, start: 'top 78%' },
        })

        /* The inner layer is taller than its cell, so drifting it never
           uncovers the edge of the panel. */
        gsap.to(band.querySelector('[data-band-art-inner]'), {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
  })

  return (
    <section ref={root} className="w-full bg-ink-900">
      {BANDS.map(band => {
        const [from, to] = band.items[0]?.art ?? ['#F97316', '#DC2626']

        return (
          <article
            key={band.kind}
            data-band
            className="grid w-full border-b border-ink-700 md:grid-cols-2"
          >
            {/* Art — runs to the edge of the screen on its side. */}
            <div
              data-band-art
              className={`relative min-h-[280px] overflow-hidden md:min-h-[520px] ${
                band.artRight ? 'md:order-2' : ''
              }`}
            >
              {/* Overscans the cell by 10% each way; the drift below moves it 7.2%
                  of the cell height, so the panel edges never come into view. */}
              <div
                data-band-art-inner
                className="absolute inset-x-0 -top-[10%] flex h-[120%] items-center justify-center"
                style={{ background: `linear-gradient(145deg, ${from}55 0%, #0b0a09 100%)` }}
              >
                <div className="bg-diag absolute inset-0 opacity-[0.05]" />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 50% 50%, ${to}33 0%, transparent 65%)` }}
                />
                <motion.span
                  className="relative select-none text-[clamp(5rem,14vw,11rem)] leading-none"
                  whileHover={{ scale: 1.06, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {band.meta.icon}
                </motion.span>
              </div>
            </div>

            {/* Copy */}
            <div
              data-band-copy
              className={`flex flex-col justify-center px-6 py-14 sm:px-10 md:px-14 lg:px-20 ${
                band.artRight ? 'md:order-1' : ''
              }`}
            >
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: band.meta.color }}
              >
                {band.items.length} ชิ้น
              </p>
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-black leading-tight text-white">
                {band.meta.label}
              </h2>
              <p className="mb-7 max-w-md text-sm leading-relaxed text-muted">{band.copy}</p>

              <ul className="mb-8 flex max-w-md flex-col gap-2">
                {band.items.slice(0, 3).map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-ink-700 pb-2"
                  >
                    <span className="truncate text-sm font-bold text-white">{item.name}</span>
                    <span className="shrink-0 text-xs font-black text-coin">
                      {item.coins === 0 ? 'ฟรี' : `🪙 ${item.coins}`}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="#items"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="self-start rounded bg-brand px-6 py-3 text-xs font-black uppercase tracking-wide text-white"
              >
                ดู{band.meta.label}ทั้งหมด ›
              </motion.a>
            </div>
          </article>
        )
      })}
    </section>
  )
}
