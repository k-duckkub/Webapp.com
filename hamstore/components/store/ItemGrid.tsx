'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ItemCard } from './ItemCard'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START, T } from '@/lib/motion'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'

type Filter = 'ALL' | ItemKind

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  ...(Object.keys(KIND_META) as ItemKind[]).map(k => ({ id: k as Filter, label: KIND_META[k].label })),
]

export function ItemGrid() {
  const root = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>('ALL')

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
      <div className="shell">
        <div className="mb-12 text-center">
          <h2 className="display-lg mb-4 text-graphite" data-grid-el>
            ไอเทมทั้งหมด
          </h2>
          <p className="lede mx-auto max-w-xl" data-grid-el>
            ของพวกนี้ใช้ตกแต่งโปรไฟล์และหน้าเว็บ HamsterHub ของคุณ — ไม่ใช่ Unity asset
          </p>
        </div>

        {/* Filters — Apple keeps these as a quiet segmented row, not loud pills. */}
        <div
          className="no-scrollbar mb-12 flex justify-start gap-1 overflow-x-auto sm:justify-center"
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

        <motion.div
          layout
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          data-grid-el
        >
          <AnimatePresence mode="popLayout">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
