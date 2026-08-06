'use client'

import { motion } from 'framer-motion'
import { T } from '@/lib/motion'
import { formatSize, formatThaiDate, CATEGORY_MOTIF, type OwnedAsset } from '@/lib/library'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'

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
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Artwork
          seed={asset.id + 100}
          title={asset.title}
          motif={CATEGORY_MOTIF[asset.category] ?? 'blocks'}
          from={asset.color}
          to="#0b0a09"
          src={asset.image}
        />

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
            <span className="flex items-center justify-center gap-1.5">
              <Icon name={asset.hasUpdate ? 'refresh' : 'download'} className="h-3.5 w-3.5" />
              {asset.hasUpdate ? 'อัปเดต' : asset.downloaded ? 'ดาวน์โหลดซ้ำ' : 'ดาวน์โหลด'}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={T.hover}
            title="ใบเสร็จ"
            aria-label={`ใบเสร็จของ ${asset.title} — จ่ายไป ${asset.paidCoins} HamCoin`}
            className="rounded-full bg-mist px-3 py-2 text-slate transition-colors hover:text-graphite"
          >
            <Icon name="receipt" className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
