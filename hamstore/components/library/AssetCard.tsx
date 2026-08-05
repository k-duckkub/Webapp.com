'use client'

import { motion } from 'framer-motion'
import { formatSize, formatThaiDate, type OwnedAsset } from '@/lib/library'

export function AssetCard({ asset }: { asset: OwnedAsset }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-ink-600 bg-ink-750 transition-colors hover:border-brand/60"
    >
      {/* Thumbnail */}
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${asset.color}44 0%, #0d0d0d 100%)` }}
      >
        <div className="bg-diag absolute inset-0 opacity-[0.04]" />
        <motion.span
          className="select-none text-5xl font-black"
          style={{ color: asset.color, opacity: 0.6 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {asset.category.slice(0, 2)}
        </motion.span>

        {asset.hasUpdate && (
          <span className="absolute right-2 top-2 rounded-sm bg-brand px-2 py-0.5 text-[10px] font-black text-white">
            อัปเดตใหม่
          </span>
        )}

        {!asset.downloaded && (
          <span className="absolute left-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-bold text-muted-bright">
            ยังไม่ดาวน์โหลด
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <p className="mb-0.5 truncate text-xs text-muted-dim">{asset.publisher}</p>
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-white">
          {asset.title}
        </h3>

        {/* Pipelines */}
        <div className="mb-2 flex flex-wrap gap-1">
          {asset.pipelines.map(p => (
            <span
              key={p}
              className="rounded-sm bg-ink-700 px-1.5 py-0.5 text-[10px] font-medium text-muted-dim"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Meta — this is a library, so it's version/size/date, not price */}
        <dl className="mb-3 space-y-1 text-[11px] text-muted-dim">
          <div className="flex justify-between gap-2">
            <dt>เวอร์ชัน</dt>
            <dd className="font-semibold tabular-nums text-muted-bright">v{asset.version}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>ขนาด</dt>
            <dd className="font-semibold tabular-nums text-muted-bright">{formatSize(asset.size)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>ซื้อเมื่อ</dt>
            <dd className="font-semibold text-muted-bright">{formatThaiDate(asset.purchasedAt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>License</dt>
            <dd className="font-semibold text-muted-bright">{asset.license}</dd>
          </div>
        </dl>

        <div className="mt-auto flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 rounded py-1.5 text-xs font-bold transition-colors ${
              asset.hasUpdate
                ? 'bg-brand text-white hover:bg-brand-hover'
                : 'bg-ink-700 text-white hover:bg-ink-600'
            }`}
          >
            {asset.hasUpdate ? 'อัปเดต' : asset.downloaded ? 'ดาวน์โหลดซ้ำ' : 'ดาวน์โหลด'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="ใบเสร็จ"
            aria-label={`ใบเสร็จของ ${asset.title} — จ่ายไป ${asset.paidCoins} HamCoin`}
            className="rounded border border-ink-600 px-2 py-1.5 text-xs text-muted-dim transition-colors hover:bg-ink-700"
          >
            🧾
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
