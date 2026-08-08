'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { T, pressableCard, SPRING_SOFT, GRID_ITEM } from '@/lib/motion'
import { kindMeta, type PlatformItem } from '@/lib/items'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useWallet, priceOf, itemLine, anySizeInCart } from '@/components/WalletProvider'

/**
 * A product card, in HamsterHub's own card language.
 *
 * The previous one printed the category twice — once as a chip burned into the
 * cover, once as a line above the name — carried a two-line blurb, a stock
 * line and a text pill, and then ran six to a row. That is a lot of furniture
 * around a photograph, and at that width the Thai wrapped to three lines.
 *
 * This is the anatomy the rest of the site already uses: picture, one badge
 * over it, name, one line, and a foot that pairs the price with a round button.
 * The picture is the argument; everything else gets out of its way.
 */
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
  const [from, to] = item.art

  const price = priceOf(item)
  const queued = anySizeInCart(cart, item.id)
  const soldOut = item.stock === 0
  /* Anything with a real choice of size has to be chosen in the sheet, not
     guessed at from a card — so the card's button opens it. */
  const needsSize = item.sizes.length > 1
  /* One badge, and only when it earns the corner. Three competing badges is
     how a card starts shouting. */
  const badge = soldOut
    ? 'ของหมด'
    : item.sale > 0
      ? `ลด ${item.sale}%`
      : item.stock <= 10
        ? `เหลือ ${item.stock} ชิ้น`
        : null

  return (
    /* Entry and layout belong to the grid, not to each card — see ItemGrid. */
    <motion.article
      variants={GRID_ITEM}
      {...pressableCard}
      className="group relative flex flex-col overflow-hidden rounded-card bg-paper shadow-card transition-shadow hover:shadow-lift"
    >
      {/* Cover */}
      <div className={`relative overflow-hidden bg-mist ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <Artwork
          seed={item.id}
          /* No chip on the cover. The category is already a filter above the
             grid, and printing it here as well made every card say the same
             word twice. */
          motif={kindMeta(item.kind).motif}
          from={from}
          to={to}
          src={item.image}
          size={featured ? 'lg' : 'sm'}
        />

        {badge && (
          <span
            /* z-20, because Artwork lays a photograph at z-10 over its drawn
               cover and an unlayered badge disappears underneath it. */
            className={`absolute left-3 top-3 z-20 rounded-full px-3 py-1 text-[11px] font-semibold ${
              soldOut ? 'bg-graphite text-white' : 'bg-brand text-white'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-[17px] font-bold leading-snug tracking-tight text-graphite">
          {item.name}
        </h3>
        <p className="mb-4 line-clamp-1 text-[13px] leading-relaxed text-slate">{item.blurb}</p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* What a buyer checks on a physical thing, in one short line —
                the full stock and spec live in the sheet. */}
            <p className="mb-1.5 flex items-center gap-1.5 truncate text-[12px] text-slate-soft">
              <Icon name="receipt" className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.8} />
              {soldOut ? 'รอรอบผลิตถัดไป' : `ส่งถึงใน ${item.shipsIn} วัน`}
            </p>
            <p className="text-[19px] font-bold tracking-tight text-graphite">
              {item.coins === 0 ? (
                'ฟรี'
              ) : (
                <span className="flex items-center gap-1.5">
                  <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                  <span className="tabular-nums">{price}</span>
                  {item.sale > 0 && (
                    <span className="text-[13px] font-normal text-slate-soft line-through">
                      {item.coins}
                    </span>
                  )}
                </span>
              )}
            </p>
          </div>

          {/* The round button. Its glyph carries the state, since it has no
              room for a word: arrow to act, check once it is in the cart. */}
          <motion.button
            onClick={() => {
              if (soldOut) return
              /* A size is a decision, and a card is the wrong place to make
                 one — send them to the sheet where the options are. */
              if (needsSize) onOpen?.(item)
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

      {/* A stretched hit area rather than a click handler on the article: it is
          a real focusable control with a name, and it keeps the round button
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
