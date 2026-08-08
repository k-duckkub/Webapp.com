'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START } from '@/lib/motion'
import { kindMeta, PLATFORM_ITEMS, type ItemKind } from '@/lib/items'
import { COPY, imageSrc } from '@/lib/content'
import { priceOf } from '@/components/WalletProvider'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'

/**
 * Two feature panels and a facts row.
 *
 * The previous version ran full-bleed bands edge to edge, then a numbers strip,
 * then a third shelf of category tiles — four sections of marketing furniture
 * between the opening and the actual goods, on a shop with eighteen products.
 * The shelf is gone (its categories are the filter row above the grid, one
 * click away) and what is left sits in the same floating panels as everything
 * else.
 */

/* Which categories get a panel, and what each one says, is content — the
   alternating left/right rhythm below is not. */
const BANDS = COPY.store.bands.map((band, i) => ({
  ...band,
  kind: band.kind as ItemKind,
  meta: kindMeta(band.kind),
  items: PLATFORM_ITEMS.filter(item => item.kind === band.kind),
  artRight: i % 2 === 0,
}))

/* Facts, not adjectives. Each one is computed from the catalogue — which for
   physical goods means what is actually on the shelf, not what is listed. */
const FACTS: { value: string; label: string; icon: 'cart' | 'receipt' | 'coin' | 'hamster' }[] = [
  { value: String(PLATFORM_ITEMS.length), label: COPY.store.facts.inStore, icon: 'cart' },
  { value: String(PLATFORM_ITEMS.filter(i => i.stock > 0).length), label: COPY.store.facts.free, icon: 'receipt' },
  {
    value: `${Math.min(...PLATFORM_ITEMS.filter(i => i.coins > 0).map(priceOf))}`,
    label: COPY.store.facts.cheapest,
    icon: 'coin',
  },
  { value: '0', label: COPY.store.facts.baht, icon: 'hamster' },
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
      })
    })
  })

  return (
    <div ref={root} className="contents">
      {BANDS.map(band => {
        const [from, to] = band.items[0]?.art ?? ['#F26F21', '#5B3A1E']
        const image = imageSrc(band.image)

        return (
          <section key={band.kind} data-feature className="panel">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className={band.artRight ? '' : 'lg:order-2'}>
                <h2 className="display-md mb-4 max-w-md text-graphite" data-feature-el>
                  {band.headline}
                </h2>
                <p className="mb-8 max-w-md text-[15px] leading-relaxed text-slate" data-feature-el>
                  {band.body}
                </p>

                {/* Three from the category, priced — the proof behind the claim
                    above, rather than another paragraph about it. */}
                <ul className="mb-8 flex max-w-md flex-col gap-1" data-feature-el>
                  {band.items.slice(0, 3).map(item => (
                    <li key={item.id} className="flex items-center gap-3 py-2">
                      <span className="icon-chip h-9 w-9">
                        <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-graphite">
                        {item.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-graphite">
                        {item.coins === 0 ? (
                          'ฟรี'
                        ) : (
                          <>
                            <Icon name="coin" className="h-3.5 w-3.5 text-slate-soft" />
                            <span className="tabular-nums">{priceOf(item)}</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <a href="#items" className="btn-ghost" data-feature-el>
                  ดู{band.meta.label}ทั้งหมด
                  <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                </a>
              </div>

              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-card bg-mist ${
                  band.artRight ? '' : 'lg:order-1'
                }`}
                data-feature-el
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Artwork
                    seed={band.items[0]?.id ?? 1}
                    motif={band.meta.motif}
                    from={from}
                    to={to}
                    src={band.items[0]?.image}
                    size="lg"
                  />
                )}
              </div>
            </div>
          </section>
        )
      })}

      {/* A different kind of panel: no art, no prose, only figures. */}
      <section data-feature className="panel">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {FACTS.map(fact => (
            <div key={fact.label} data-feature-el>
              <span className="icon-chip mb-4 h-12 w-12">
                <Icon name={fact.icon} className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <dt className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-display text-graphite">
                {fact.value}
              </dt>
              <dd className="mt-2 max-w-[15rem] text-[14px] leading-relaxed text-slate">
                {fact.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
