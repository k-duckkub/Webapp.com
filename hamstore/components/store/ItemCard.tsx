'use client'

import { motion } from 'framer-motion'
import { T } from '@/lib/motion'
import { KIND_META, RARITY_META, type PlatformItem } from '@/lib/items'

export function ItemCard({ item }: { item: PlatformItem }) {
  const kind = KIND_META[item.kind]
  const rarity = RARITY_META[item.rarity]
  const [from] = item.art
  const finalCoins = item.sale > 0 ? Math.round(item.coins * (1 - item.sale / 100)) : item.coins

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={T.enter}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-card bg-paper"
    >
      {/* Product panel */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-mist">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${from}1f 0%, transparent 65%)` }}
        />
        <motion.span
          className="relative select-none text-6xl leading-none"
          whileHover={{ scale: 1.06 }}
          transition={T.hover}
        >
          {kind.icon}
        </motion.span>

        {item.sale > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
            −{item.sale}%
          </span>
        )}
        {item.owned && (
          <span className="absolute right-3 top-3 rounded-full bg-graphite px-2.5 py-0.5 text-[11px] font-medium text-white">
            มีแล้ว
          </span>
        )}
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
          <div className="flex items-baseline gap-2">
            {item.coins === 0 ? (
              <span className="text-[15px] font-semibold text-graphite">ฟรี</span>
            ) : (
              <>
                <span className="text-[15px] font-semibold text-graphite">🪙 {finalCoins}</span>
                {item.sale > 0 && (
                  <span className="text-[13px] text-slate-soft line-through">{item.coins}</span>
                )}
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: item.owned ? 1 : 1.03 }}
            whileTap={{ scale: item.owned ? 1 : 0.98 }}
            transition={T.hover}
            disabled={item.owned}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              item.owned
                ? 'cursor-not-allowed bg-mist text-slate-soft'
                : 'bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {item.owned ? 'ใช้งาน' : 'แลกเลย'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
