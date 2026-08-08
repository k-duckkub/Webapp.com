'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT } from '@/lib/motion'
import { ITEM_DETAILS, kindMeta, type PlatformItem } from '@/lib/items'
import { formatThaiDate } from '@/lib/library'
import { useWallet, priceOf, itemKey, itemLine } from '@/components/WalletProvider'
import { CONTENT } from '@/lib/content'
import { Artwork } from '@/components/Artwork'
import { Icon } from '@/components/Icon'

/**
 * The sheet a buyer decides in.
 *
 * A card can carry a name, a line and a price — enough to browse, not enough
 * to commit. Someone choosing a thing to use wants the specifics: who made
 * it, how many people already run it, exactly what lands in their account,
 * which surfaces it appears on, and whether it is still maintained. All of
 * that is here, and the add-to-cart sits at the bottom so the decision and
 * the commitment are in the same place.
 */
export function ItemSheet({ item, onClose }: { item: PlatformItem | null; onClose: () => void }) {
  const { inCart, toggleCart, balance } = useWallet()
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!item) return

    restoreFocus.current = document.activeElement as HTMLElement
    panel.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      /* Keep tab inside the sheet while it's open. */
      if (e.key === 'Tab' && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
        )
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
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
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
            aria-labelledby="sheet-title"
            tabIndex={-1}
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={SPRING_SOFT}
            className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-panel bg-paper outline-none sm:max-w-4xl sm:rounded-panel"
          >
            <Body item={item} onClose={onClose} inCart={inCart} toggleCart={toggleCart} balance={balance} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Body({
  item,
  onClose,
  inCart,
  toggleCart,
  balance,
}: {
  item: PlatformItem
  onClose: () => void
  inCart: (key: string) => boolean
  toggleCart: (line: ReturnType<typeof itemLine>) => void
  balance: number
}) {
  const kind = kindMeta(item.kind)
  const detail = ITEM_DETAILS[item.id]
  const [from, to] = item.art
  const price = priceOf(item)
  const soldOut = item.stock === 0

  /* Preselect only when there is nothing to choose. With real options, an
     unset size is the honest starting state — picking one for someone is how
     a medium arrives for a person who wanted a large. */
  const [size, setSize] = useState<string | null>(item.sizes.length === 1 ? item.sizes[0] : null)
  const queued = size ? inCart(itemKey(item.id, size)) : false
  const short = Math.max(0, price - balance)

  const arrives = new Date(Date.now() + item.shipsIn * 86_400_000)
  const arrivalLabel = formatThaiDate(arrives.toISOString().slice(0, 10))

  return (
    <>
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[420px]">
          <Artwork
            seed={item.id}
            /* No title on the cover here — the heading sits two centimetres to
               the right, and printing the name twice is what a template does. */
            label={kind.label}
            motif={kind.motif}
            from={from}
            to={to}
            src={item.image}
            size="lg"
          />
        </div>

        <div className="flex flex-col px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="sheet-title" className="display-md mb-2 text-graphite">
                {item.name}
              </h2>
              <p className="text-[15px] text-slate">
                โดย {detail?.maker ?? 'HamsterHub'}
                {detail && (
                  <>
                    {' · '}
                    <span className="tabular-nums">{detail.owners.toLocaleString('th-TH')}</span> คนมีแล้ว
                  </>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="ปิด"
              className="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-slate transition-colors hover:bg-mist hover:text-graphite"
            >
              <Icon name="close" className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>

          <p className="mb-7 text-[15px] leading-relaxed text-slate">{item.blurb}</p>

          {detail && (
            <>
              <Section title="ได้อะไรบ้าง">
                <ul className="flex flex-col gap-2">
                  {detail.includes.map(line => (
                    <li key={line} className="flex items-start gap-2.5 text-[15px] text-graphite">
                      <Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.4} />
                      {line}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* The one decision that has to be made before ordering, given
                  its own section rather than tucked beside the button. */}
              {item.sizes.length > 1 && (
                <Section title="เลือกไซซ์">
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map(option => (
                      <button
                        key={option}
                        onClick={() => setSize(option)}
                        aria-pressed={size === option}
                        className={`tap min-w-[52px] rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                          size === option
                            ? 'bg-graphite text-white'
                            : 'bg-mist text-graphite hover:bg-hairline'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="รายละเอียด" last>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
                  {[
                    ['หมวด', kind.label],
                    ['วัสดุ', detail.showsUp[0] ?? '—'],
                    ['คงเหลือ', soldOut ? 'ของหมด' : `${item.stock} ชิ้น`],
                    ['ถึงประมาณ', arrivalLabel],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-hairline/60 pb-2">
                      <dt className="text-slate">{k}</dt>
                      <dd className="text-right font-medium text-graphite">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            </>
          )}

          {/* Decision and commitment in the same place — and on a phone the
              price scrolls off while you are still reading the spec list, so
              it sticks to the bottom of the sheet instead of hiding under it. */}
          {/* Opaque, not frosted: Thai text scrolling under a translucent bar
              reads as a smudge, and this bar is the one thing that must stay
              legible the whole way down. */}
          <div className="sticky bottom-0 -mx-6 mt-auto border-t border-hairline/70 bg-paper px-6 pb-6 pt-5 sm:-mx-8 sm:px-8 sm:pb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[13px] text-slate">ราคา</p>
                <p className="flex items-center gap-2 text-[26px] font-semibold tracking-display text-graphite">
                  {item.coins === 0 ? (
                    'ฟรี'
                  ) : (
                    <>
                      <Icon name="coin" className="h-5 w-5 text-slate-soft" />
                      <span className="tabular-nums">{price}</span>
                      {item.sale > 0 && (
                        <span className="text-[16px] font-normal text-slate-soft line-through">
                          {item.coins}
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              <motion.button
                onClick={() => size && toggleCart(itemLine(item, size))}
                disabled={soldOut || !size}
                whileHover={soldOut || !size ? undefined : { scale: 1.03 }}
                whileTap={soldOut || !size ? undefined : { scale: 0.96 }}
                transition={SPRING_SOFT}
                aria-pressed={soldOut || !size ? undefined : queued}
                className={`tap rounded-full px-8 py-3.5 text-[15px] font-medium transition-colors ${
                  soldOut || !size
                    ? 'cursor-not-allowed bg-mist text-slate-soft'
                    : queued
                      ? 'bg-graphite text-white hover:bg-graphite/85'
                      : 'bg-brand text-white hover:bg-brand-hover'
                }`}
              >
                {soldOut ? 'ของหมด' : !size ? 'เลือกไซซ์ก่อน' : queued ? 'อยู่ในตะกร้า' : 'ใส่ตะกร้า'}
              </motion.button>
            </div>

            {/* Says what happens after, and what to do when it can't. */}
            <p className="text-[13px] leading-relaxed text-slate">
              {soldOut
                ? 'หมดชั่วคราว — รอบผลิตถัดไปจะกลับมาในร้านอัตโนมัติ'
                : short > 0
                  ? `ใส่ตะกร้าไว้ก่อนได้ — ตอนนี้ยังขาดอีก ${short.toLocaleString('th-TH')} เหรียญ เรียนจบอีกบทเดียวก็มักจะพอ`
                  : `สั่งวันนี้ ถึงประมาณ ${arrivalLabel} · ${CONTENT.settings.shipping.note}`}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({
  title,
  children,
  last,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className={last ? '' : 'mb-6'}>
      <h3 className="mb-3 text-[12px] font-semibold tracking-label text-slate-soft">{title}</h3>
      {children}
    </section>
  )
}
