'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START, SPRING_SOFT } from '@/lib/motion'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'
import { priceOf } from '@/components/WalletProvider'

const ORDER: ItemKind[] = ['skin', 'pet', 'theme', 'emoji', 'frame']

const COPY: Record<ItemKind, string> = {
  skin:  'เปลี่ยนหน้าตาแฮมสเตอร์ประจำตัวคุณ ทุกคนที่เปิดโปรไฟล์คุณจะเห็นทันที',
  pet:   'เพื่อนตัวเล็กที่เดินตามคุณไปทั่วเว็บ บางตัวเปลี่ยนสีตามธีมที่ใช้อยู่ด้วย',
  theme: 'เปลี่ยนสีทั้งเว็บ HamsterHub ตั้งแต่พื้นหลังยันปุ่ม เลือกให้เข้ากับเวลาที่คุณนั่งโค้ด',
  emoji: 'ชุดอิโมจิเฉพาะของ HamsterHub ใช้ได้ทั้งในคอมเมนต์ ฟอรัม และแชท',
  frame: 'กรอบรอบรูปโปรไฟล์ บางอันมีประกายหรือเปลวไฟขยับได้',
}

const SECTIONS = ORDER.map((kind, i) => ({
  kind,
  meta: KIND_META[kind],
  copy: COPY[kind],
  items: PLATFORM_ITEMS.filter(item => item.kind === kind),
  /* Art swaps sides band to band, and the ground alternates with it. */
  artRight: i % 2 === 1,
  onMist: i % 2 === 0,
}))

export function FeatureSections() {
  const root = useRef<HTMLDivElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-feature]').forEach(section => {
        gsap.from(section.querySelectorAll('[data-feature-el]'), {
          ...REVEAL,
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: REVEAL_START },
        })

        /* Fades on its own element; the drift below writes a transform to the
           inner layer, so the two never fight over one node. */
        gsap.from(section.querySelector('[data-feature-art]'), {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: REVEAL_START },
        })

        /* The inner layer overscans its cell by 10% each way, so drifting it
           7.2% of the cell height never uncovers the panel edge. */
        gsap.to(section.querySelector('[data-feature-art-inner]'), {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
  })

  return (
    <div ref={root}>
      {SECTIONS.map(section => {
        const [from, to] = section.items[0]?.art ?? ['#F97316', '#DC2626']

        return (
          <section
            key={section.kind}
            data-feature
            className={`grid w-full items-stretch md:grid-cols-2 ${
              section.onMist ? 'bg-mist' : 'bg-paper'
            }`}
          >
            {/* Art — runs to the screen edge on its side. */}
            <div
              data-feature-art
              className={`relative min-h-[340px] overflow-hidden md:min-h-[620px] ${
                section.artRight ? 'md:order-2' : ''
              }`}
            >
              <div
                data-feature-art-inner
                className="absolute inset-x-0 -top-[10%] flex h-[120%] items-center justify-center"
                style={{
                  background: `radial-gradient(ellipse at 50% 45%, ${from}26 0%, ${to}0f 42%, transparent 72%)`,
                }}
              >
                <motion.span
                  className="select-none text-[clamp(6rem,16vw,14rem)] leading-none"
                  whileHover={{ scale: 1.05 }}
                  transition={SPRING_SOFT}
                >
                  {section.meta.icon}
                </motion.span>
              </div>
            </div>

            {/* Copy */}
            <div
              className={`flex flex-col justify-center px-6 py-20 sm:px-10 md:px-14 lg:px-20 ${
                section.artRight ? 'md:order-1' : ''
              }`}
            >
              <p className="eyebrow mb-4" data-feature-el>
                {section.items.length} ชิ้น
              </p>
              <h2 className="display-lg mb-5 max-w-md text-graphite" data-feature-el>
                {section.meta.label}
              </h2>
              <p className="lede mb-10 max-w-md" data-feature-el>
                {section.copy}
              </p>

              <ul className="mb-10 flex max-w-md flex-col" data-feature-el>
                {section.items.slice(0, 3).map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-hairline/70 py-3"
                  >
                    <span className="truncate text-[15px] font-medium text-graphite">{item.name}</span>
                    <span className="shrink-0 text-[15px] text-slate">
                      {item.coins === 0 ? 'ฟรี' : `🪙 ${priceOf(item)}`}
                    </span>
                  </li>
                ))}
              </ul>

              <a href="#items" className="btn-ghost self-start" data-feature-el>
                ดู{section.meta.label}ทั้งหมด <span aria-hidden>›</span>
              </a>
            </div>
          </section>
        )
      })}
    </div>
  )
}
