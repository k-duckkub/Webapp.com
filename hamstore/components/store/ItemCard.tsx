'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { T, pressableCard, SPRING_SOFT, GRID_ITEM } from '@/lib/motion'
import { kindMeta, type PlatformItem } from '@/lib/items'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useWallet, priceOf, itemLine, anySizeInCart } from '@/components/WalletProvider'

export function ItemCard({
  item,
  featured = false,
  onOpen,
}: {
  item: PlatformItem
  featured?: boolean
  onOpen?: (item: PlatformItem) => void
}) {
  const { cart, toggleCart } = useWallet()
  const kind = kindMeta(item.kind)
  const [from, to] = item.art

  const price = priceOf(item)
  const queued = anySizeInCart(cart, item.id)
  const soldOut = item.stock === 0
  /* Anything with a real choice of size has to be chosen in the sheet, not
     guessed at from a card — so the card's button opens it. */
  const needsSize = item.sizes.length > 1

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

        {/* Top-right, opposite the cover's own category chip. Sold out beats
            a discount: there is no point advertising a price nobody can pay. */}
        {soldOut ? (
          <span className="absolute right-3 top-3 rounded-full bg-graphite px-2.5 py-0.5 text-[11px] font-medium text-white">
            ของหมด
          </span>
        ) : (
          item.sale > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
              −{item.sale}%
            </span>
          )
        )}
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="mb-1 text-xs font-medium tracking-label" style={{ color: kind.color }}>
          {kind.label}
        </p>
        <h3 className="mb-1.5 text-[17px] font-semibold leading-snug tracking-tight text-graphite">
          {item.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate">{item.blurb}</p>

        {/* The two things a buyer checks before anything else on a physical
            product: is there any left, and when would it turn up. */}
        <p className="mb-4 text-[12px] text-slate-soft">
          {soldOut ? (
            'ของหมด — รอรอบผลิตถัดไป'
          ) : (
            <>
              เหลือ <span className="tabular-nums">{item.stock}</span> ชิ้น · ส่งถึงใน{' '}
              <span className="tabular-nums">{item.shipsIn}</span> วัน
            </>
          )}
        </p>

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
            onClick={() => {
              if (soldOut) return
              /* A size is a decision, and a card is the wrong place to make
                 one — send them to the sheet where the options are. */
              if (needsSize) onOpen?.(item)
              else toggleCart(itemLine(item, item.sizes[0]))
            }}
            disabled={soldOut}
            whileHover={soldOut ? undefined : { scale: 1.05 }}
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
            className={`tap relative z-20 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              soldOut
                ? 'cursor-not-allowed bg-mist text-slate-soft'
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
                key={soldOut ? 'out' : needsSize ? 'size' : queued ? 'queued' : 'add'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={T.hover}
                className="block"
              >
                {soldOut ? (
                  'ของหมด'
                ) : needsSize ? (
                  'เลือกไซซ์'
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
