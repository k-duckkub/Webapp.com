'use client'

import { motion } from 'framer-motion'
import { T } from '@/lib/motion'
import { formatSize, formatThaiDate, type OwnedAsset } from '@/lib/library'

export function AssetCard({ asset }: { asset: OwnedAsset }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={T.enter}
      whileHover={{ y: -4 }}
      className="flex flex-col overflow-hidden rounded-card bg-paper"
    >
      {/* Product panel */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-mist">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${asset.color}1f 0%, transparent 65%)` }}
        />
        <motion.span
          className="relative select-none text-4xl font-semibold tracking-display"
          style={{ color: asset.color, opacity: 0.55 }}
          whileHover={{ scale: 1.05 }}
          transition={T.hover}
        >
          {asset.category.slice(0, 2)}
        </motion.span>

        {asset.hasUpdate && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
            อัปเดตใหม่
          </span>
        )}
        {!asset.downloaded && (
          <span className="absolute left-3 top-3 rounded-full bg-graphite px-2.5 py-0.5 text-[11px] font-medium text-white">
            ยังไม่ดาวน์โหลด
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="mb-1 truncate text-xs text-slate-soft">{asset.publisher}</p>
        <h3 className="mb-3 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight text-graphite">
          {asset.title}
        </h3>

        {/* A library, so the detail is version and licence — never a price. */}
        <dl className="mb-4 space-y-1.5 text-[13px] text-slate">
          {[
            ['เวอร์ชัน', `v${asset.version}`],
            ['ขนาด', formatSize(asset.size)],
            ['ซื้อเมื่อ', formatThaiDate(asset.purchasedAt)],
            ['License', asset.license],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt>{label}</dt>
              <dd className="font-medium tabular-nums text-graphite">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center gap-2 pb-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={T.hover}
            className={`flex-1 rounded-full py-2 text-[13px] font-medium transition-colors ${
              asset.hasUpdate
                ? 'bg-brand text-white hover:bg-brand-hover'
                : 'bg-graphite text-white hover:bg-graphite/85'
            }`}
          >
            {asset.hasUpdate ? 'อัปเดต' : asset.downloaded ? 'ดาวน์โหลดซ้ำ' : 'ดาวน์โหลด'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={T.hover}
            title="ใบเสร็จ"
            aria-label={`ใบเสร็จของ ${asset.title} — จ่ายไป ${asset.paidCoins} HamCoin`}
            className="rounded-full bg-mist px-3 py-2 text-[13px] text-slate transition-colors hover:text-graphite"
          >
            🧾
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
