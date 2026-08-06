'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START, SPRING_SOFT } from '@/lib/motion'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'
import { priceOf } from '@/components/WalletProvider'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'

/**
 * Two feature bands and a facts strip — not five identical bands.
 *
 * The previous version ran the same two-column band once per category, which
 * is the tell that a template produced the page rather than someone laying it
 * out. A product page varies what each section *is*: one leads with the art,
 * one leads with the range, one is only numbers. Categories that don't earn a
 * band of their own are still one click away in the grid below.
 */

const BAND_KINDS: ItemKind[] = ['skin', 'theme']

const BAND_COPY: Record<string, { headline: string; body: string }> = {
  skin: {
    headline: 'ใส่แล้วคนทั้งเว็บเห็น',
    body: 'สกินเปลี่ยนแฮมสเตอร์ประจำตัวคุณทุกที่ที่มันโผล่ — โปรไฟล์ คอมเมนต์ กระดานอันดับ',
  },
  theme: {
    headline: 'เปลี่ยนทั้งเว็บ ไม่ใช่แค่พื้นหลัง',
    body: 'ธีมคุมสีตั้งแต่พื้น ปุ่ม ยันเส้นขอบ เลือกให้เข้ากับเวลาที่คุณนั่งโค้ดจริงๆ',
  },
}

const BANDS = BAND_KINDS.map((kind, i) => ({
  kind,
  meta: KIND_META[kind],
  ...BAND_COPY[kind],
  items: PLATFORM_ITEMS.filter(item => item.kind === kind),
  artRight: i % 2 === 1,
  onMist: i % 2 === 0,
}))

/* Facts, not adjectives. Each one is computed from the catalogue. */
const FACTS = [
  { value: String(PLATFORM_ITEMS.length), label: 'ชิ้นในร้านตอนนี้' },
  { value: String(PLATFORM_ITEMS.filter(i => i.coins === 0).length), label: 'ชิ้นที่ปลดล็อกได้ฟรี' },
  { value: `${Math.min(...PLATFORM_ITEMS.filter(i => i.coins > 0).map(priceOf))}`, label: 'เหรียญ สำหรับชิ้นที่ถูกที่สุด' },
  { value: '0', label: 'บาท — เหรียญได้จากการเรียนเท่านั้น' },
]

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

        const art = section.querySelector('[data-feature-art]')
        if (!art) return

        gsap.from(art, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: REVEAL_START },
        })
        /* Inner layer overscans by 10%, so a 7.2% drift never shows an edge. */
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
      {BANDS.map(band => {
        const [from, to] = band.items[0]?.art ?? ['#F97316', '#DC2626']

        return (
          <section
            key={band.kind}
            data-feature
            className={`grid w-full items-stretch md:grid-cols-2 ${band.onMist ? 'bg-mist' : 'bg-paper'}`}
          >
            <div
              data-feature-art
              className={`relative min-h-[340px] overflow-hidden md:min-h-[600px] ${
                band.artRight ? 'md:order-2' : ''
              }`}
            >
              <div
                data-feature-art-inner
                className="absolute inset-x-0 -top-[10%] flex h-[120%] items-center justify-center"
                style={{
                  background: `radial-gradient(ellipse at 50% 45%, ${from}26 0%, ${to}0f 42%, transparent 72%)`,
                }}
              >
                <motion.span whileHover={{ scale: 1.05 }} transition={SPRING_SOFT}>
                  <Icon
                    name={band.meta.icon}
                    className="h-[clamp(5rem,12vw,9rem)] w-[clamp(5rem,12vw,9rem)] text-graphite/[0.18]"
                    strokeWidth={1}
                  />
                </motion.span>
              </div>
            </div>

            <div
              className={`flex flex-col justify-center px-6 py-20 sm:px-10 md:px-14 lg:px-20 ${
                band.artRight ? 'md:order-1' : ''
              }`}
            >
              <h2 className="display-lg mb-5 max-w-md text-graphite" data-feature-el>
                {band.headline}
              </h2>
              <p className="lede mb-10 max-w-md" data-feature-el>
                {band.body}
              </p>

              <ul className="mb-10 flex max-w-md flex-col" data-feature-el>
                {band.items.slice(0, 3).map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-hairline/70 py-3"
                  >
                    <span className="truncate text-[15px] font-medium text-graphite">{item.name}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[15px] text-slate">
                      {item.coins === 0 ? (
                        'ฟรี'
                      ) : (
                        <>
                          <Icon name="coin" className="h-3.5 w-3.5 text-slate-soft" />
                          {priceOf(item)}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <a href="#items" className="btn-ghost self-start" data-feature-el>
                ดู{band.meta.label}ทั้งหมด
                <Icon name="chevronRight" className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </div>
          </section>
        )
      })}

      {/* A different kind of section: no art, no prose, only figures. */}
      <section data-feature className="bg-paper py-24 sm:py-28">
        <dl className="bleed grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {FACTS.map(fact => (
            <div key={fact.label} data-feature-el>
              <dt className="text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-display text-graphite">
                {fact.value}
              </dt>
              <dd className="mt-3 max-w-[16rem] text-[15px] leading-relaxed text-slate">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The categories that don't get a band still get a shelf. */}
      <section data-feature className="bg-mist py-20 sm:py-24">
        <div className="bleed">
          <h2 className="display-md mb-8 text-graphite" data-feature-el>
            และอีกสามหมวด
          </h2>
          <div className="grid gap-5 sm:grid-cols-3" data-feature-el>
            {(['pet', 'emoji', 'frame'] as ItemKind[]).map(kind => {
              const meta = KIND_META[kind]
              const items = PLATFORM_ITEMS.filter(i => i.kind === kind)
              /* The category's own hue, not the first item's — pulling from
                 items made all three shelves come out the same warm orange. */
              const from = meta.color
              const to = '#1d1d1f'

              return (
                <motion.a
                  key={kind}
                  href="#items"
                  whileHover={{ y: -6 }}
                  transition={SPRING_SOFT}
                  className="group relative block aspect-[5/3] overflow-hidden rounded-panel"
                >
                  <Artwork
                    seed={kind.length * 31 + items.length}
                    title={meta.label}
                    motif={meta.motif}
                    from={from}
                    to={to}
                    size="lg"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {items.length} ชิ้น
                  </span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
