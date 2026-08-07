'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK, MOTION_REDUCED } from '@/lib/gsap'
import { GSAP_EASE, DURATION } from '@/lib/motion'
import { OWNED_ASSETS, formatSize } from '@/lib/library'
import { COPY } from '@/lib/content'

const totalSize = OWNED_ASSETS.reduce((sum, a) => sum + a.size, 0)
const updateCount = OWNED_ASSETS.filter(a => a.hasUpdate).length
/* What was actually spent. "ผู้พัฒนา" was a fact about the catalogue; this is
   a fact about the buyer, and it is the one that says these are already
   theirs — a download button under a number nobody paid reads like a shop. */
const coinsSpent = OWNED_ASSETS.reduce((sum, a) => sum + a.paidCoins, 0)

const hero = COPY.library.hero

const STATS = [
  { id: 'assets',     value: OWNED_ASSETS.length, label: hero.stats.assets },
  { id: 'size',       value: totalSize,           label: hero.stats.size, isSize: true },
  { id: 'updates',    value: updateCount,         label: hero.stats.updates },
  { id: 'spent',      value: coinsSpent,          label: hero.stats.spent },
]

export function LibraryHero() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ defaults: { ease: GSAP_EASE, duration: DURATION.slow } })
        .from('[data-lib-el]', { y: 40, opacity: 0, stagger: 0.09 })
        .from('[data-stat]', { y: 24, opacity: 0, stagger: 0.06, duration: DURATION.base }, '-=0.8')

      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach(el => {
        const target = Number(el.dataset.statValue)
        const isSize = el.dataset.statFormat === 'size'
        const counter = { n: 0 }

        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: 'power2.out',
          delay: 0.3,
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
    <section ref={root} className="bg-paper pt-32 sm:pt-40">
      <div className="bleed">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1 className="display-xl max-w-lg text-graphite" data-lib-el>
            {hero.headlineLine1}
            <br />
            {hero.headlineLine2}
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-slate" data-lib-el>
            {hero.lede}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-panel bg-hairline/70 sm:grid-cols-4">
          {STATS.map(stat => (
            <div key={stat.id} data-stat className="bg-paper px-5 py-7">
              <dd
                data-stat-value={stat.value}
                data-stat-format={stat.isSize ? 'size' : 'number'}
                className="mb-1 text-[clamp(1.5rem,3vw,2rem)] font-semibold tabular-nums tracking-display text-graphite"
              >
                {stat.isSize ? formatSize(stat.value) : stat.value.toLocaleString('th-TH')}
              </dd>
              <dt className="text-[13px] text-slate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
