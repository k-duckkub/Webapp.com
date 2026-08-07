'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { T, pressableCard, SPRING_SOFT, GRID_ITEM } from '@/lib/motion'
import { ITEM_DETAILS, kindMeta, rarityMeta, type PlatformItem } from '@/lib/items'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useWallet, priceOf, itemKey, itemLine } from '@/components/WalletProvider'

export function ItemCard({
  item,
  featured = false,
  onOpen,
}: {
  item: PlatformItem
  featured?: boolean
  onOpen?: (item: PlatformItem) => void
}) {
  const { owns, inCart, toggleCart, isEquipped, equip } = useWallet()
  const kind = kindMeta(item.kind)
  const rarity = rarityMeta(item.rarity)
  const detail = ITEM_DETAILS[item.id]
  const [from, to] = item.art

  const key = itemKey(item.id)
  const owned = owns(key)
  const queued = inCart(key)
  const price = priceOf(item)
  const worn = isEquipped(item)

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
        <motion.div className="h-full w-full">
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
              {worn ? 'กำลังใช้' : 'มีแล้ว'}
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

        <div className="mt-auto flex items-center justify-between gap-3 pb-2.5">
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
            onClick={() => (owned ? equip(item) : toggleCart(itemLine(item)))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING_SOFT}
            aria-label={
              owned
                ? worn
                  ? `เลิกใช้ ${item.name}`
                  : `ใช้งาน ${item.name}`
                : queued
                  ? `เอา ${item.name} ออกจากตะกร้า`
                  : `ใส่ ${item.name} ลงตะกร้า`
            }
            aria-pressed={owned ? worn : queued}
            className={`tap relative z-20 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              owned
                ? worn
                  ? 'bg-graphite text-white hover:bg-graphite/85'
                  : 'bg-mist text-graphite hover:bg-hairline'
                : queued
                  ? 'bg-graphite text-white hover:bg-graphite/85'
                  : 'bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {/* Swap the label rather than the button, so the press has a payoff.
                The clip lives on this span, not on the button: overflow:hidden
                on the button would cut its own 44px tap area back down. */}
            <span className="block overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={owned ? (worn ? 'worn' : 'owned') : queued ? 'queued' : 'add'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={T.hover}
                className="block"
              >
                {owned ? (
                  worn ? (
                    <span className="flex items-center gap-1">
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                      กำลังใช้
                    </span>
                  ) : (
                    'ใช้งาน'
                  )
                ) : queued ? (
                  <span className="flex items-center gap-1">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                    อยู่ในตะกร้า
                  </span>
                ) : (
                  'ใส่ตะกร้า'
                )}
              </motion.span>
            </AnimatePresence>
            </span>
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
