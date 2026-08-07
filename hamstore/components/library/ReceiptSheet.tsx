'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT } from '@/lib/motion'
import { formatSize, formatThaiDate, type OwnedAsset } from '@/lib/library'
import { Icon } from '@/components/Icon'

/**
 * The receipt behind the little receipt button on every library card.
 *
 * That button had an aria-label describing a receipt and no click handler, so
 * screen readers announced something that could not be opened. This is what it
 * was always meant to show: what was paid, when, under which licence, and what
 * the buyer is allowed to do with it.
 */
export function ReceiptSheet({ asset, onClose }: { asset: OwnedAsset | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!asset) return
    restoreFocus.current = document.activeElement as HTMLElement
    panel.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href]')
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      restoreFocus.current?.focus()
    }
  }, [asset, onClose])

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <button
            aria-label="ปิด"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-graphite/25 backdrop-blur-sm"
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-title"
            tabIndex={-1}
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={SPRING_SOFT}
            className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-panel bg-paper p-6 outline-none sm:max-w-md sm:rounded-panel sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-[12px] font-semibold tracking-label text-slate-soft">ใบเสร็จ</p>
                <h2 id="receipt-title" className="text-[22px] font-semibold leading-snug tracking-tight text-graphite">
                  {asset.title}
                </h2>
                <p className="mt-1 text-[14px] text-slate">{asset.publisher}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="ปิด"
                className="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-slate transition-colors hover:bg-mist hover:text-graphite"
              >
                <Icon name="close" className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <dl className="mb-6 flex flex-col gap-0 text-[14px]">
              {[
                ['วันที่แลก', formatThaiDate(asset.purchasedAt)],
                ['จ่ายด้วย', `${asset.paidCoins.toLocaleString('th-TH')} HamCoin`],
                ['จ่ายเป็นเงิน', '0 บาท'],
                ['License', asset.license],
                ['เวอร์ชันที่ได้', `v${asset.version}`],
                ['ขนาดไฟล์', formatSize(asset.size)],
                ['Render Pipeline', asset.pipelines.join(', ')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-hairline/60 py-2.5">
                  <dt className="text-slate">{k}</dt>
                  <dd className="text-right font-medium text-graphite">{v}</dd>
                </div>
              ))}
            </dl>

            {/* The one line that matters on a receipt nobody paid money for. */}
            <p className="text-[13px] leading-relaxed text-slate">
              แลกด้วยเหรียญที่ได้จากการเรียน ไม่มีการตัดเงินจริง — สิทธิ์
              {asset.license === 'Multi Entity' ? 'ใช้ได้ทั้งทีม' : 'ใช้ได้กับผู้ซื้อคนเดียว'}
              {' '}และดาวน์โหลดซ้ำได้ไม่จำกัด ไม่มีวันหมดอายุ
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
