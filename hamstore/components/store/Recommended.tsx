'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ItemSheet } from './ItemSheet'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START, T, SPRING_SOFT } from '@/lib/motion'
import { kindMeta, PLATFORM_ITEMS, RECOMMENDED, type PlatformItem } from '@/lib/items'
import { COPY } from '@/lib/content'
import { useWallet, priceOf, itemLine, anySizeInCart } from '@/components/WalletProvider'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'

const PICKS = RECOMMENDED.map(pick => ({
  ...pick,
  item: PLATFORM_ITEMS.find(i => i.id === pick.id)!,
})).filter(p => p.item)

export function Recommended() {
  const root = useRef<HTMLElement>(null)
  const { cart, toggleCart } = useWallet()
  const [selected, setSelected] = useState<PlatformItem | null>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-rec-el]', {
        ...REVEAL,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: REVEAL_START },
      })
    })
  })

  return (
    <section ref={root} className="bg-paper py-24 sm:py-32">
      <div className="bleed">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-hairline pb-6">
          <h2 className="display-lg text-graphite" data-rec-el>
            {COPY.store.recommended.heading}
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-slate" data-rec-el>
            {COPY.store.recommended.sub}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" data-rec-el>
          {PICKS.map(({ item, reason, note }) => {
            const kind = kindMeta(item.kind)
            const [from, to] = item.art
            /* Same rules as a grid card: a size is picked in the sheet, and
               nothing that is off the shelf pretends to be orderable. */
            const queued = anySizeInCart(cart, item.id)
            const soldOut = item.stock === 0
            const needsSize = item.sizes.length > 1

            return (
              <motion.article
                key={item.id}
                whileHover={{ y: -6 }}
                transition={SPRING_SOFT}
                className="relative flex flex-col overflow-hidden rounded-panel bg-mist p-6 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* Cover */}
                <motion.div className="relative mb-5 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-card bg-paper sm:mb-0 sm:aspect-square sm:w-40">
                  <Artwork
                    seed={item.id}
                    /* Name lives in the h3 beside the cover. */
                    label={kind.label}
                    motif={kind.motif}
                    from={from}
                    to={to}
                    src={item.image}
                  />
                </motion.div>

                {/* Why we picked it */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="mb-2 inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-[12px] font-medium text-brand">
                    {reason}
                  </p>
                  <h3 className="mb-1.5 text-[19px] font-semibold tracking-tight text-graphite">
                    {item.name}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate">{note}</p>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-[15px] font-semibold text-graphite">
                      {item.coins === 0 ? (
                        'ฟรี'
                      ) : (
                        <>
                          <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                          {priceOf(item)}
                        </>
                      )}
                    </span>

                    <motion.button
                      onClick={() => {
                        if (soldOut) return
                        if (needsSize) setSelected(item)
                        else toggleCart(itemLine(item, item.sizes[0]))
                      }}
                      disabled={soldOut}
                      whileHover={soldOut ? undefined : { scale: 1.05 }}
                      whileTap={soldOut ? undefined : { scale: 0.92 }}
                      transition={SPRING_SOFT}
                      aria-pressed={soldOut || needsSize ? undefined : queued}
                      className={`tap relative z-20 rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                        soldOut
                          ? 'cursor-not-allowed bg-paper text-slate-soft'
                          : queued
                            ? 'bg-graphite text-white hover:bg-graphite/85'
                            : 'bg-brand text-white hover:bg-brand-hover'
                      }`}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={soldOut ? 'out' : needsSize ? 'size' : queued ? 'queued' : 'add'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={T.hover}
                          className="block"
                        >
                          {soldOut ? 'ของหมด' : needsSize ? 'เลือกไซซ์' : queued ? 'อยู่ในตะกร้า' : 'ใส่ตะกร้า'}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>

                {/* Same stretched hit area as the grid cards: recommending
                    something and then not letting anyone read about it is
                    where a shelf stops being a recommendation. */}
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-label={`ดูรายละเอียด ${item.name}`}
                  className="absolute inset-0 z-10 rounded-panel"
                />
              </motion.article>
            )
          })}
        </div>
      </div>

      <ItemSheet item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
