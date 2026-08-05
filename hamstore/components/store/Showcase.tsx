'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { KIND_META, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'

/** One panel per item kind, each listing every piece in that kind. */
const PANELS = (['skin', 'pet', 'theme', 'emoji', 'frame'] as ItemKind[]).map(kind => ({
  kind,
  meta: KIND_META[kind],
  items: PLATFORM_ITEMS.filter(i => i.kind === kind),
}))

export function Showcase() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGsapContext(root, ({ mm }) => {
    /* Pinned horizontal scroll only makes sense with room to move — and it
       hijacks scroll, so keep it off small screens and off reduced-motion. */
    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      const el = track.current
      if (!el) return

      const distance = () => el.scrollWidth - el.offsetWidth

      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    })
  })

  return (
    <section ref={root} className="overflow-hidden bg-ink-900 py-16 md:py-0">
      <div className="md:flex md:h-screen md:flex-col md:justify-center">
        <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-3 px-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              เลื่อนดูทีละหมวด
            </p>
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              มีอะไรให้เลือกบ้าง
            </h2>
          </div>
          <p className="hidden items-center gap-2 text-xs text-muted-dim md:flex">
            เลื่อนลงเพื่อดูหมวดถัดไป <span aria-hidden>→</span>
          </p>
        </div>

        <div
          ref={track}
          className="no-scrollbar flex gap-6 overflow-x-auto px-6 md:overflow-visible md:pl-[max(1.5rem,calc((100vw-80rem)/2))]"
        >
          {PANELS.map(panel => (
            <article
              key={panel.kind}
              className="flex w-[min(85vw,340px)] shrink-0 flex-col rounded-xl border border-ink-600 bg-ink-750 p-6 md:min-h-[520px] md:w-[380px]"
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{
                    backgroundColor: `${panel.meta.color}22`,
                    border: `1px solid ${panel.meta.color}55`,
                  }}
                >
                  {panel.meta.icon}
                </span>
                <h3 className="text-xl font-black text-white">{panel.meta.label}</h3>
              </div>

              <ul className="flex flex-col gap-3">
                {panel.items.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-ink-800 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{item.name}</p>
                      <p className="truncate text-xs text-muted-dim">{item.blurb}</p>
                    </div>
                    <span className="shrink-0 text-xs font-black text-coin">
                      {item.coins === 0 ? 'ฟรี' : `🪙 ${item.coins}`}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
