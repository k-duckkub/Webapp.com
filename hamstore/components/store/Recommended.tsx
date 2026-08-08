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

/**
 * The editor's picks, as big cards.
 *
 * Heading on the left, goods on the right — the arrangement HamsterHub uses
 * for its recommended courses. Each card carries the reason it was chosen,
 * because a recommendation without a stated reason is just a bigger card.
 */
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
    <section ref={root} className="panel">
      <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-10">
        <div data-rec-el>
          <h2 className="display-md mb-3 text-graphite">{COPY.store.recommended.heading}</h2>
          <p className="text-[15px] leading-relaxed text-slate">{COPY.store.recommended.sub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2" data-rec-el>
          {PICKS.map(({ item, reason, note }) => {
            const [from, to] = item.art
            const queued = anySizeInCart(cart, item.id)
            const soldOut = item.stock === 0
            const needsSize = item.sizes.length > 1

            return (
              <motion.article
                key={item.id}
                whileHover={{ y: -4 }}
                transition={SPRING_SOFT}
                className="group relative flex flex-col overflow-hidden rounded-card bg-paper shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                  <Artwork
                    seed={item.id}
                    motif={kindMeta(item.kind).motif}
                    from={from}
                    to={to}
                    src={item.image}
                  />
                  <span className="absolute left-3 top-3 z-20 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">
                    {reason}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1 text-[17px] font-bold leading-snug tracking-tight text-graphite">
                    {item.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-slate">{note}</p>

                  <div className="mt-auto flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="mb-1.5 flex items-center gap-1.5 truncate text-[12px] text-slate-soft">
                        <Icon name="receipt" className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.8} />
                        {soldOut ? 'รอรอบผลิตถัดไป' : `ส่งถึงใน ${item.shipsIn} วัน`}
                      </p>
                      <p className="flex items-center gap-1.5 text-[19px] font-bold tracking-tight text-graphite">
                        {item.coins === 0 ? (
                          'ฟรี'
                        ) : (
                          <>
                            <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                            <span className="tabular-nums">{priceOf(item)}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <motion.button
                      onClick={() => {
                        if (soldOut) return
                        if (needsSize) setSelected(item)
                        else toggleCart(itemLine(item, item.sizes[0]))
                      }}
                      disabled={soldOut}
                      whileHover={soldOut ? undefined : { scale: 1.08 }}
                      whileTap={soldOut ? undefined : { scale: 0.92 }}
                      transition={SPRING_SOFT}
                      aria-label={
                        soldOut
                          ? `${item.name} — ของหมด`
                          : needsSize
                            ? `เลือกไซซ์ของ ${item.name}`
                            : queued
                              ? `เอา ${item.name} ออกจากตะกร้า`
                              : `ใส่ ${item.name} ลงตะกร้า`
                      }
                      aria-pressed={soldOut || needsSize ? undefined : queued}
                      className={`tap relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                        soldOut
                          ? 'cursor-not-allowed bg-mist text-slate-soft'
                          : queued
                            ? 'bg-graphite text-white hover:bg-graphite/85'
                            : 'bg-brand text-white hover:bg-brand-hover'
                      }`}
                    >
                      <span className="block overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={soldOut ? 'out' : queued && !needsSize ? 'queued' : 'go'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={T.hover}
                            className="block"
                          >
                            <Icon
                              name={queued && !needsSize ? 'check' : 'arrowRight'}
                              className="h-[18px] w-[18px]"
                              strokeWidth={2.2}
                            />
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-label={`ดูรายละเอียด ${item.name}`}
                  className="absolute inset-0 z-10 rounded-card"
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
