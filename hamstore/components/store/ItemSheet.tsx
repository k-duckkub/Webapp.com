'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT } from '@/lib/motion'
import { ITEM_DETAILS, KIND_META, RARITY_META, type PlatformItem } from '@/lib/items'
import { formatThaiDate } from '@/lib/library'
import { useWallet, priceOf, itemKey, itemLine } from '@/components/WalletProvider'
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
  const { owns, inCart, toggleCart, balance } = useWallet()
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
            <Body item={item} onClose={onClose} owns={owns} inCart={inCart} toggleCart={toggleCart} balance={balance} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Body({
  item,
  onClose,
  owns,
  inCart,
  toggleCart,
  balance,
}: {
  item: PlatformItem
  onClose: () => void
  owns: (key: string) => boolean
  inCart: (key: string) => boolean
  toggleCart: (line: ReturnType<typeof itemLine>) => void
  balance: number
}) {
  const kind = KIND_META[item.kind]
  const rarity = RARITY_META[item.rarity]
  const detail = ITEM_DETAILS[item.id]
  const [from, to] = item.art
  const price = priceOf(item)
  const key = itemKey(item.id)
  const owned = owns(key)
  const queued = inCart(key)
  const short = Math.max(0, price - balance)

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

              <Section title="โผล่ที่ไหน">
                <div className="flex flex-wrap gap-2">
                  {detail.showsUp.map(place => (
                    <span key={place} className="rounded-full bg-mist px-3 py-1 text-[13px] text-graphite">
                      {place}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="รายละเอียด" last>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
                  {[
                    ['ระดับ', rarity.label],
                    ['เวอร์ชัน', `v${detail.version}`],
                    ['อัปเดตล่าสุด', formatThaiDate(detail.updatedAt)],
                    ['หมวด', kind.label],
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
                onClick={() => toggleCart(itemLine(item))}
                disabled={owned}
                whileHover={owned ? undefined : { scale: 1.03 }}
                whileTap={owned ? undefined : { scale: 0.96 }}
                transition={SPRING_SOFT}
                aria-pressed={owned ? undefined : queued}
                className={`rounded-full px-8 py-3.5 text-[15px] font-medium transition-colors ${
                  owned
                    ? 'cursor-default bg-mist text-slate'
                    : queued
                      ? 'bg-graphite text-white hover:bg-graphite/85'
                      : 'bg-brand text-white hover:bg-brand-hover'
                }`}
              >
                {owned ? 'มีแล้ว' : queued ? 'อยู่ในตะกร้า' : 'ใส่ตะกร้า'}
              </motion.button>
            </div>

            {/* Says what happens after, and what to do when it can't. */}
            <p className="text-[13px] leading-relaxed text-slate">
              {owned
                ? 'อยู่ในบัญชีคุณแล้ว เปิดใช้เมื่อไหร่ก็ได้ ไม่มีวันหมดอายุ'
                : short > 0
                  ? `ใส่ตะกร้าไว้ก่อนได้ — ตอนนี้ยังขาดอีก ${short.toLocaleString('th-TH')} เหรียญ เรียนจบอีกบทเดียวก็มักจะพอ`
                  : 'แลกแล้วเป็นของคุณถาวร เปลี่ยนไปใช้ชิ้นอื่นแล้วกลับมาใช้อันนี้ได้ตลอด'}
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
