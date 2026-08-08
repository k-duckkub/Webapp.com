'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK, MOTION_REDUCED } from '@/lib/gsap'
import { GSAP_EASE, DURATION } from '@/lib/motion'
import { STORE_ASSETS } from '@/lib/library'
import { COPY } from '@/lib/content'
import { useWallet, assetKey } from '@/components/WalletProvider'
import { Icon, type IconName } from '@/components/Icon'

const publisherCount = new Set(STORE_ASSETS.map(a => a.publisher)).size
const cheapest = Math.min(...STORE_ASSETS.map(a => (a.sale > 0 ? Math.round(a.coins * (1 - a.sale / 100)) : a.coins)))

const hero = COPY.library.hero

/* Counted from the catalogue, so the numbers cannot drift from the shelf.
   The owned count is the one that moves while you shop, so it is rendered by
   React rather than written by the GSAP counter — the counter fires once on
   entry and would leave a stale number sitting there after a checkout. */
const FIXED_STATS: { id: string; value: number; label: string; icon: IconName }[] = [
  { id: 'assets',     value: STORE_ASSETS.length, label: hero.stats.assets,     icon: 'template' },
  { id: 'cheapest',   value: cheapest,            label: hero.stats.cheapest,   icon: 'coin' },
  { id: 'publishers', value: publisherCount,      label: hero.stats.publishers, icon: 'tools' },
]

/* The strip is one row of equal cells, so the column count has to follow the
   number of stats. It was left at four after the list dropped to three, and
   the empty fourth cell showed the strip's own grey through the gap as a bare
   grey rectangle. Deriving it means that cannot happen again. */
const COLUMNS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
}

export function LibraryHero() {
  const root = useRef<HTMLElement>(null)
  const { owns } = useWallet()
  const ownedCount = STORE_ASSETS.filter(a => owns(assetKey(a.id))).length

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ defaults: { ease: GSAP_EASE, duration: DURATION.slow } })
        .from('[data-lib-el]', { y: 40, opacity: 0, stagger: 0.09 })
        .from('[data-stat]', { y: 24, opacity: 0, stagger: 0.06, duration: DURATION.base }, '-=0.8')

      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach(el => {
        const target = Number(el.dataset.statValue)
        const counter = { n: 0 }

        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: 'power2.out',
          delay: 0.3,
          onUpdate: () => {
            el.textContent = Math.round(counter.n).toLocaleString('th-TH')
          },
        })
      })
    })

    mm.add(MOTION_REDUCED, () => {
      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach(el => {
        const target = Number(el.dataset.statValue)
        el.textContent = Math.round(target).toLocaleString('th-TH')
      })
    })
  })

  return (
    <section ref={root} className="panel">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h1 className="display-lg max-w-2xl text-graphite" data-lib-el>
          {hero.headlineLine1}
          <span className="block text-brand">{hero.headlineLine2}</span>
        </h1>
        <p className="max-w-xs text-[15px] leading-relaxed text-slate" data-lib-el>
          {hero.lede}
        </p>
      </div>

      {/* The same figures row page one uses, so the two pages count things the
          same way — icon chip, number, label — rather than each inventing a
          stat block of its own. */}
      <dl className={`grid grid-cols-2 gap-x-6 gap-y-8 ${COLUMNS[FIXED_STATS.length + 1] ?? 'sm:grid-cols-4'}`}>
        {FIXED_STATS.map(stat => (
          <div key={stat.id} data-stat>
            <span className="icon-chip mb-3 h-11 w-11">
              <Icon name={stat.icon} className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <dd
              data-stat-value={stat.value}
              className="mb-1 text-[clamp(1.5rem,3vw,2rem)] font-bold tabular-nums tracking-display text-graphite"
            >
              {stat.value.toLocaleString('th-TH')}
            </dd>
            <dt className="text-[13px] text-slate">{stat.label}</dt>
          </div>
        ))}

        <div data-stat>
          <span className="icon-chip mb-3 h-11 w-11">
            <Icon name="check" className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <dd className="mb-1 text-[clamp(1.5rem,3vw,2rem)] font-bold tabular-nums tracking-display text-graphite">
            {ownedCount.toLocaleString('th-TH')}
          </dd>
          <dt className="text-[13px] text-slate">{hero.stats.owned}</dt>
        </div>
      </dl>
    </section>
  )
}
