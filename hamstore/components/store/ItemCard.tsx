'use client'

import { motion } from 'framer-motion'
import { KIND_META, RARITY_META, type PlatformItem } from '@/lib/items'

export function ItemCard({ item }: { item: PlatformItem }) {
  const kind = KIND_META[item.kind]
  const rarity = RARITY_META[item.rarity]
  const [from, to] = item.art
  const finalCoins = item.sale > 0 ? Math.round(item.coins * (1 - item.sale / 100)) : item.coins

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-600 bg-ink-750 transition-colors hover:border-brand/60"
    >
      {/* Art */}
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${from}44 0%, #0d0d0d 100%)` }}
      >
        <div className="bg-diag absolute inset-0 opacity-[0.04]" />
        <motion.span
          className="select-none text-6xl"
          whileHover={{ scale: 1.14, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          {kind.icon}
        </motion.span>

        <span
          className="absolute left-2 top-2 rounded-sm px-2 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: kind.color }}
        >
          {kind.label}
        </span>

        {item.sale > 0 && (
          <span className="absolute right-2 top-2 rounded-sm bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
            -{item.sale}%
          </span>
        )}

        {item.owned && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
            มีแล้ว
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug text-white">{item.name}</h3>
          <span
            className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: `${rarity.color}22`, color: rarity.color }}
          >
            {rarity.label}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-dim">{item.blurb}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            {item.coins === 0 ? (
              <span className="text-sm font-black text-emerald-400">ฟรี</span>
            ) : (
              <>
                <span className="text-sm font-black text-coin">🪙 {finalCoins}</span>
                {item.sale > 0 && (
                  <span className="text-[11px] text-muted-dim line-through">{item.coins}</span>
                )}
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: item.owned ? 1 : 1.05 }}
            whileTap={{ scale: item.owned ? 1 : 0.95 }}
            disabled={item.owned}
            className={`rounded px-3 py-1.5 text-xs font-bold transition-colors ${
              item.owned
                ? 'cursor-not-allowed bg-ink-700 text-muted-dim'
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
