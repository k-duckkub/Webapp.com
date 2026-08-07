'use client'

import { motion } from 'framer-motion'
import { T, SPRING_SOFT, GRID_ITEM, EASE_OUT } from '@/lib/motion'
import { formatSize, formatThaiDate, CATEGORY_MOTIF, type OwnedAsset } from '@/lib/library'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useLibrary } from './LibraryProvider'
import { COPY } from '@/lib/content'

/**
 * The card never animates between grid slots — that is what made the ones on
 * their way out float over the ones staying put. It only fades up in the
 * place it will end in, on the grid's stagger. See GRID_ITEM in lib/motion.
 */
export function AssetCard({ asset, onReceipt }: { asset: OwnedAsset; onReceipt: (a: OwnedAsset) => void }) {
  const { download, progress } = useLibrary()
  const busy = progress[asset.id]

  return (
    <motion.article
      variants={GRID_ITEM}
      whileHover={{ y: -4, transition: SPRING_SOFT }}
      className="flex flex-col overflow-hidden rounded-card bg-paper"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Artwork
          seed={asset.id + 100}
          /* Title is the h3 below; the cover carries the category instead. */
          label={asset.category}
          motif={CATEGORY_MOTIF[asset.category] ?? 'blocks'}
          from={asset.color}
          to="#0b0a09"
          src={asset.image}
        />

        {/* "ยังไม่ดาวน์โหลด" was read as "ยังไม่ได้ซื้อ" — one badge answering
            the wrong question. Ownership is now stated first and on every
            card; the download state follows it as a separate fact about the
            file. Both sit along the bottom, directly above the button they
            explain and clear of the category chip in the opposite corner. */}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-graphite backdrop-blur-sm">
            <Icon name="check" className="h-3 w-3 text-brand" strokeWidth={2.6} />
            {COPY.library.ownedBadge}
          </span>
          {asset.hasUpdate && (
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
              อัปเดตใหม่
            </span>
          )}
          {!asset.downloaded && (
            <span className="rounded-full bg-graphite px-2.5 py-0.5 text-[11px] font-medium text-white">
              {COPY.library.notDownloadedBadge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="mb-1 truncate text-xs text-slate-soft">{asset.publisher}</p>
        <h3 className="mb-2.5 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight text-graphite">
          {asset.title}
        </h3>

        {/* The first question anyone opening a package asks is whether it runs
            on their pipeline. It was filterable but never shown, so the answer
            was only available to someone who already knew to look for it. */}
        <ul className="mb-3.5 flex flex-wrap gap-1.5">
          {asset.pipelines.map(pipe => (
            <li
              key={pipe}
              className="rounded-md bg-mist px-2 py-0.5 text-[11px] font-medium text-slate"
            >
              {pipe}
            </li>
          ))}
        </ul>

        {/* A library, so the detail is version and licence — never a price. */}
        <dl className="mb-4 space-y-1.5 text-[13px] text-slate">
          {[
            ['เวอร์ชัน', `v${asset.version}`],
            ['ขนาด', formatSize(asset.size)],
            ['แลกเมื่อ', formatThaiDate(asset.purchasedAt)],
            ['จ่ายไป', `${asset.paidCoins.toLocaleString('th-TH')} เหรียญ`],
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
            onClick={() => download(asset)}
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={T.hover}
            aria-label={
              busy
                ? `ยกเลิกการดาวน์โหลด ${asset.title}`
                : `${asset.hasUpdate ? 'อัปเดต' : 'ดาวน์โหลด'} ${asset.title}`
            }
            className={`relative flex-1 overflow-hidden rounded-full py-2 text-[13px] font-medium transition-colors ${
              asset.hasUpdate
                ? 'bg-brand text-white hover:bg-brand-hover'
                : 'bg-graphite text-white hover:bg-graphite/85'
            }`}
          >
            {/* The fill is the progress bar — a separate bar under the button
                would be one more thing to look at for the same fact. */}
            {busy && (
              <motion.span
                className="absolute inset-y-0 left-0 bg-white/25"
                animate={{ width: `${busy.pct}%` }}
                transition={{ duration: 0.12, ease: EASE_OUT }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1.5">
              {busy ? (
                <span className="tabular-nums">{busy.label}</span>
              ) : (
                <>
                  <Icon name={asset.hasUpdate ? 'refresh' : 'download'} className="h-3.5 w-3.5" />
                  {asset.hasUpdate ? 'อัปเดต' : asset.downloaded ? 'ดาวน์โหลดซ้ำ' : 'ดาวน์โหลด'}
                </>
              )}
            </span>
          </motion.button>

          <motion.button
            onClick={() => onReceipt(asset)}
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
