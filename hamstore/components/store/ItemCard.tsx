'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { T, pressableCard, SPRING_SOFT } from '@/lib/motion'
import { KIND_META, RARITY_META, type PlatformItem } from '@/lib/items'
import { useWallet, priceOf } from '@/components/WalletProvider'

export function ItemCard({ item, featured = false }: { item: PlatformItem; featured?: boolean }) {
  const { owns, canAfford, redeem, justRedeemed } = useWallet()
  const kind = KIND_META[item.kind]
  const rarity = RARITY_META[item.rarity]
  const [from] = item.art

  const owned = owns(item.id)
  const price = priceOf(item)
  const affordable = canAfford(item)
  const celebrating = justRedeemed === item.id

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={T.enter}
      {...pressableCard}
      className="group relative flex flex-col overflow-hidden rounded-card bg-paper"
    >
      {/* Product panel */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-mist ${
          featured ? 'aspect-[4/3]' : 'aspect-square'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${from}1f 0%, transparent 65%)` }}
        />

        {/* The mark reacts to the press, so the whole card feels pressable. */}
        <motion.span
          className={`relative select-none leading-none ${featured ? 'text-8xl' : 'text-6xl'}`}
          animate={celebrating ? { scale: [1, 1.22, 1], rotate: [0, -7, 0] } : { scale: 1 }}
          transition={celebrating ? { duration: 0.7, ease: [0.28, 0.11, 0.32, 1] } : SPRING_SOFT}
        >
          {kind.icon}
        </motion.span>

        {item.sale > 0 && !owned && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
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
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate">{item.blurb}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pb-1">
          <span className="text-[15px] font-semibold text-graphite">
            {item.coins === 0 ? 'ฟรี' : `🪙 ${price}`}
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
            className={`relative overflow-hidden rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
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
                {owned ? (celebrating ? 'ได้แล้ว ✓' : 'ใช้งาน') : affordable ? 'แลกเลย' : 'เหรียญไม่พอ'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
