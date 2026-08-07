'use client'

import { motion } from 'framer-motion'
import { T, SPRING_SOFT, GRID_ITEM, EASE_OUT } from '@/lib/motion'
import { formatSize, formatThaiDate, CATEGORY_MOTIF, type StoreAsset } from '@/lib/library'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'
import { useLibrary } from './LibraryProvider'
import { COPY } from '@/lib/content'
import { useWallet, priceOf, assetKey, assetLine } from '@/components/WalletProvider'

/**
 * A package card, in one of two states.
 *
 * Not owned, it is a shop listing: price, discount, and a button that puts it
 * in the cart. Owned, the price is gone and the card is about the file —
 * download it, see the receipt, take an update. The same card doing both is
 * what makes the page make sense: it used to show a download button on
 * something nobody had bought, which is where "จะโหลดได้ไงยังไม่ได้ซื้อเลย"
 * came from.
 *
 * It never animates between grid slots — that is what made the ones on their
 * way out float over the ones staying put. See GRID_ITEM in lib/motion.
 */
export function AssetCard({ asset, onReceipt }: { asset: StoreAsset; onReceipt: (a: StoreAsset) => void }) {
  const { download, progress, fileState } = useLibrary()
  const { owns, inCart, toggleCart } = useWallet()

  const key = assetKey(asset.id)
  const owned = owns(key)
  const queued = inCart(key)
  const busy = progress[asset.id]
  const file = fileState(asset)
  const price = priceOf(asset)

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

        {asset.sale > 0 && !owned && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
            −{asset.sale}%
          </span>
        )}

        {/* Status runs along the bottom, above the button it explains and clear
            of the category chip in the opposite corner. Only an owned package
            has anything to say about a file. */}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {owned && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-graphite backdrop-blur-sm">
              <Icon name="check" className="h-3 w-3 text-brand" strokeWidth={2.6} />
              {COPY.library.ownedBadge}
            </span>
          )}
          {owned && file.hasUpdate && (
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">
              อัปเดตใหม่
            </span>
          )}
          {owned && !file.downloaded && (
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
            <li key={pipe} className="rounded-md bg-mist px-2 py-0.5 text-[11px] font-medium text-slate">
              {pipe}
            </li>
          ))}
        </ul>

        <dl className="mb-4 space-y-1.5 text-[13px] text-slate">
          {[
            ['เวอร์ชัน', `v${asset.version}`],
            ['ขนาด', formatSize(asset.size)],
            ['License', asset.license],
            ...(owned && asset.purchasedAt
              ? [['แลกเมื่อ', formatThaiDate(asset.purchasedAt)] as [string, string]]
              : [['อัปเดตล่าสุด', formatThaiDate(asset.updatedAt)] as [string, string]]),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt>{label}</dt>
              <dd className="font-medium tabular-nums text-graphite">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center gap-2 pb-2.5">
          {owned ? (
            <>
              <motion.button
                onClick={() => download(asset)}
                whileHover={{ scale: busy ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={T.hover}
                aria-label={
                  busy
                    ? `ยกเลิกการดาวน์โหลด ${asset.title}`
                    : `${file.hasUpdate ? 'อัปเดต' : 'ดาวน์โหลด'} ${asset.title}`
                }
                className={`tap relative flex-1 rounded-full py-2 text-[13px] font-medium transition-colors ${
                  file.hasUpdate
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'bg-graphite text-white hover:bg-graphite/85'
                }`}
              >
                {/* The fill is the progress bar — a separate bar under the
                    button would be one more thing to read for the same fact. */}
                {busy && (
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-white/25"
                      animate={{ width: `${busy.pct}%` }}
                      transition={{ duration: 0.12, ease: EASE_OUT }}
                    />
                  </span>
                )}
                <span className="relative flex items-center justify-center gap-1.5">
                  {busy ? (
                    <span className="tabular-nums">{busy.label}</span>
                  ) : (
                    <>
                      <Icon name={file.hasUpdate ? 'refresh' : 'download'} className="h-3.5 w-3.5" />
                      {file.hasUpdate ? 'อัปเดต' : file.downloaded ? 'ดาวน์โหลดซ้ำ' : 'ดาวน์โหลด'}
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
                aria-label={`ใบเสร็จของ ${asset.title} — จ่ายไป ${price} HamCoin`}
                className="tap rounded-full bg-mist px-3 py-2 text-slate transition-colors hover:text-graphite"
              >
                <Icon name="receipt" className="h-4 w-4" />
              </motion.button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-[15px] font-semibold text-graphite">
                <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                <span className="tabular-nums">{price}</span>
                {asset.sale > 0 && (
                  <span className="text-[13px] font-normal text-slate-soft line-through">{asset.coins}</span>
                )}
              </span>

              <motion.button
                onClick={() => toggleCart(assetLine(asset))}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_SOFT}
                aria-pressed={queued}
                aria-label={queued ? `เอา ${asset.title} ออกจากตะกร้า` : `ใส่ ${asset.title} ลงตะกร้า`}
                className={`tap ml-auto rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  queued
                    ? 'bg-graphite text-white hover:bg-graphite/85'
                    : 'bg-brand text-white hover:bg-brand-hover'
                }`}
              >
                {queued ? (
                  <span className="flex items-center gap-1">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                    อยู่ในตะกร้า
                  </span>
                ) : (
                  'ใส่ตะกร้า'
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}
