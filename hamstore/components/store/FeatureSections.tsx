'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START } from '@/lib/motion'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'

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
  /* Alternate ground colour, the way Apple alternates white and #f5f5f7. */
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

        /* The panel lifts a touch as the section crosses the viewport. */
        gsap.to(section.querySelector('[data-feature-art-inner]'), {
          yPercent: -5,
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
            className={section.onMist ? 'bg-mist py-24 sm:py-32' : 'bg-paper py-24 sm:py-32'}
          >
            <div className="shell text-center">
              <p className="eyebrow mb-4" data-feature-el>
                {section.items.length} ชิ้น
              </p>
              <h2 className="display-lg mb-5 text-graphite" data-feature-el>
                {section.meta.label}
              </h2>
              <p className="lede mx-auto mb-12 max-w-xl" data-feature-el>
                {section.copy}
              </p>

              {/* Product panel */}
              <div
                data-feature-el
                className={`relative mx-auto mb-12 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-panel ${
                  section.onMist ? 'bg-paper' : 'bg-mist'
                }`}
              >
                <div
                  data-feature-art-inner
                  className="absolute inset-x-0 -top-[8%] flex h-[116%] items-center justify-center"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at 50% 50%, ${from}22 0%, ${to}0d 40%, transparent 70%)`,
                    }}
                  />
                  <span className="relative select-none text-[clamp(5rem,15vw,11rem)] leading-none">
                    {section.meta.icon}
                  </span>
                </div>
              </div>

              <ul
                data-feature-el
                className="mx-auto mb-10 grid max-w-2xl gap-px overflow-hidden rounded-card bg-hairline/70 text-left sm:grid-cols-3"
              >
                {section.items.slice(0, 3).map(item => (
                  <li
                    key={item.id}
                    className={`px-5 py-4 ${section.onMist ? 'bg-mist' : 'bg-paper'}`}
                  >
                    <p className="mb-1 truncate text-[15px] font-medium text-graphite">{item.name}</p>
                    <p className="text-sm text-slate">
                      {item.coins === 0 ? 'ฟรี' : `🪙 ${item.coins}`}
                    </p>
                  </li>
                ))}
              </ul>

              <a href="#items" className="btn-ghost" data-feature-el>
                ดู{section.meta.label}ทั้งหมด <span aria-hidden>›</span>
              </a>
            </div>
          </section>
        )
      })}
    </div>
  )
}
