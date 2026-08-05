'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ItemCard } from './ItemCard'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'

type Filter = 'ALL' | ItemKind

const FILTERS: { id: Filter; label: string; icon: string }[] = [
  { id: 'ALL', label: 'ทั้งหมด', icon: '✨' },
  ...(Object.keys(KIND_META) as ItemKind[])
    .filter(k => k !== 'coin')
    .map(k => ({ id: k as Filter, label: KIND_META[k].label, icon: KIND_META[k].icon })),
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
      gsap.from('[data-grid-head] > *', {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    })
  })

  return (
    <section ref={root} id="items" className="bg-ink-850 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div data-grid-head className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            ของที่ซื้อได้
          </p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            ไอเทมในแพลตฟอร์ม
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            ของพวกนี้ใช้ตกแต่งโปรไฟล์และหน้าเว็บ HamsterHub ของคุณ — ไม่ใช่ Unity asset
            (asset ที่ซื้อแล้วอยู่ในหน้า “คลัง Unity Asset”)
          </p>
        </div>

        {/* Filter pills */}
        <div className="no-scrollbar mb-8 flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
          {FILTERS.map(f => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  active ? 'text-white' : 'text-muted-bright hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span aria-hidden>{f.icon}</span> {f.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
