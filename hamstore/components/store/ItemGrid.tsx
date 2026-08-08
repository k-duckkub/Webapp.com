'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ItemCard } from './ItemCard'
import { ItemSheet } from './ItemSheet'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { GRID_REVEAL, REVEAL, REVEAL_START, T } from '@/lib/motion'
import { KIND_ORDER, kindMeta, PLATFORM_ITEMS, type ItemKind, type PlatformItem } from '@/lib/items'
import { COPY } from '@/lib/content'

type Filter = 'ALL' | ItemKind

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด' },
  ...KIND_ORDER.map(k => ({ id: k as Filter, label: kindMeta(k).label })),
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
    <section ref={root} id="items" className="panel scroll-mt-24">
      <div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2 className="display-md text-graphite" data-grid-el>
            {COPY.store.grid.heading}
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-slate" data-grid-el>
            {COPY.store.grid.sub}
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
                className={`tap relative shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  active ? 'text-white' : 'text-slate hover:text-graphite'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-brand"
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
          variants={GRID_REVEAL}
          initial="hidden"
          animate="show"
          /* Three across, not six. At six the card was ~180px and the Thai
             wrapped to three lines; the picture is the argument and it needs
             the room. */
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
