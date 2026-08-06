'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ItemCard } from './ItemCard'
import { ItemSheet } from './ItemSheet'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { EASE_OUT, REVEAL, REVEAL_START, T } from '@/lib/motion'
import { KIND_META, PLATFORM_ITEMS, type ItemKind, type PlatformItem } from '@/lib/items'

type Filter = 'ALL' | ItemKind

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  ...(Object.keys(KIND_META) as ItemKind[]).map(k => ({ id: k as Filter, label: KIND_META[k].label })),
]

export function ItemGrid() {
  const root = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [selected, setSelected] = useState<PlatformItem | null>(null)

  const items = useMemo(
    () => (filter === 'ALL' ? PLATFORM_ITEMS : PLATFORM_ITEMS.filter(i => i.kind === filter)),
    [filter],
  )

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-grid-el]', {
        ...REVEAL,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: REVEAL_START },
      })
    })
  })

  return (
    <section ref={root} id="items" className="bg-mist py-24 sm:py-32">
      <div className="bleed">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-hairline pb-6">
          <h2 className="display-lg text-graphite" data-grid-el>
            ไอเทมทั้งหมด
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-slate" data-grid-el>
            ของแต่งโปรไฟล์และหน้าเว็บ ไม่ใช่ Unity asset
          </p>
        </div>

        {/* Filters — Apple keeps these as a quiet segmented row, not loud pills. */}
        <div
          className="no-scrollbar mb-10 flex justify-start gap-1 overflow-x-auto"
          data-grid-el
        >
          {FILTERS.map(f => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  active ? 'text-paper' : 'text-slate hover:text-graphite'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-graphite"
                    transition={T.hover}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            )
          })}
        </div>

        {/* One short fade for the whole grid when the category changes, rather
            than every card animating to a new slot for 0.9s and crossing over
            the cards that stayed. */}
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        >
          {items.map(item => (
            <ItemCard key={item.id} item={item} onOpen={setSelected} />
          ))}
        </motion.div>
      </div>

      <ItemSheet item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
