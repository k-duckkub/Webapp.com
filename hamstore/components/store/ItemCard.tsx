'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { T, pressableCard, SPRING_SOFT, GRID_ITEM } from '@/lib/motion'
import { ITEM_DETAILS, KIND_META, RARITY_META, type PlatformItem } from '@/lib/items'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useWallet, priceOf } from '@/components/WalletProvider'

export function ItemCard({
  item,
  featured = false,
  onOpen,
}: {
  item: PlatformItem
  featured?: boolean
  onOpen?: (item: PlatformItem) => void
}) {
  const { owns, canAfford, redeem, justRedeemed } = useWallet()
  const kind = KIND_META[item.kind]
  const rarity = RARITY_META[item.rarity]
  const detail = ITEM_DETAILS[item.id]
  const [from, to] = item.art

  const owned = owns(item.id)
  const price = priceOf(item)
  const affordable = canAfford(item)
  const celebrating = justRedeemed === item.id

  return (
    /* Entry and layout belong to the grid, not to each card — see ItemGrid. */
    <motion.article
      variants={GRID_ITEM}
      {...pressableCard}
      className="group relative flex flex-col overflow-hidden rounded-card bg-paper"
    >
      {/* Cover */}
      <div
        className={`relative overflow-hidden bg-mist ${featured ? 'aspect-[4/3]' : 'aspect-square'}`}
      >
        <motion.div
          className="h-full w-full"
          animate={celebrating ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={celebrating ? { duration: 0.7, ease: [0.28, 0.11, 0.32, 1] } : SPRING_SOFT}
        >
          <Artwork
            seed={item.id}
            /* The name is set in the h3 directly below. Printing it over the
               art as well made every card say the same word twice. */
            label={kind.label}
            motif={kind.motif}
            from={from}
            to={to}
            src={item.image}
            size={featured ? 'lg' : 'sm'}
          />
        </motion.div>

        {/* Top-right, opposite the cover's own category chip. Safe to share
            that corner with the owned badge — the two never show together. */}
        {item.sale > 0 && !owned && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
            −{item.sale}%
          </span>
        )}

        <AnimatePresence>
          {owned && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING_SOFT}
              className="absolute right-3 top-3 rounded-full bg-graphite px-2.5 py-0.5 text-[11px] font-medium text-white"
            >
              มีแล้ว
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="mb-1 text-xs font-medium tracking-label" style={{ color: rarity.color }}>
          {rarity.label}
        </p>
        <h3 className="mb-1.5 text-[17px] font-semibold leading-snug tracking-tight text-graphite">
          {item.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate">{item.blurb}</p>

        {/* The only social proof we can state honestly, and the one thing a
            buyer checks first: is anyone else actually running this. */}
        {detail && (
          <p className="mb-4 text-[12px] text-slate-soft">
            <span className="tabular-nums">{detail.owners.toLocaleString('th-TH')}</span> คนมีแล้ว
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pb-1">
          <span className="flex items-center gap-1.5 text-[15px] font-semibold text-graphite">
            {item.coins === 0 ? (
              'ฟรี'
            ) : (
              <>
                <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                {price}
              </>
            )}
          </span>

          <motion.button
            onClick={() => redeem(item)}
            disabled={owned || !affordable}
            whileHover={owned || !affordable ? undefined : { scale: 1.05 }}
            whileTap={owned || !affordable ? undefined : { scale: 0.92 }}
            transition={SPRING_SOFT}
            aria-label={
              owned
                ? `${item.name} — มีแล้ว`
                : affordable
                  ? `แลก ${item.name} ราคา ${price} HamCoin`
                  : `${item.name} — เหรียญไม่พอ`
            }
            className={`relative z-20 overflow-hidden rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              owned
                ? 'cursor-default bg-mist text-slate-soft'
                : affordable
                  ? 'bg-brand text-white hover:bg-brand-hover'
                  : 'cursor-not-allowed bg-mist text-slate-soft'
            }`}
          >
            {/* Swap the label rather than the button, so the press has a payoff. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={owned ? (celebrating ? 'done' : 'owned') : affordable ? 'buy' : 'short'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={T.hover}
                className="block"
              >
                {owned ? (
                  celebrating ? (
                    <span className="flex items-center gap-1">
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                      ได้แล้ว
                    </span>
                  ) : (
                    'ใช้งาน'
                  )
                ) : affordable ? (
                  'แลกเลย'
                ) : (
                  'เหรียญไม่พอ'
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* A stretched hit area rather than a click handler on the article: it is
          a real focusable control with a name, and it keeps the redeem button
          out of a nested-button situation — that one sits above it on z-20. */}
      {onOpen && (
        <button
          type="button"
          onClick={() => onOpen(item)}
          aria-label={`ดูรายละเอียด ${item.name}`}
          className="absolute inset-0 z-10 rounded-card"
        />
      )}
    </motion.article>
  )
}
