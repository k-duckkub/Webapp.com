'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT, T } from '@/lib/motion'
import { COPY } from '@/lib/content'
import { formatThaiDate } from '@/lib/library'
import { useWallet } from '@/components/WalletProvider'
import { Icon } from '@/components/Icon'

/**
 * The cart.
 *
 * Both pages sell, so both feed one basket — which is the whole reason it
 * exists rather than each card charging on its own. The arithmetic is stated
 * before the button rather than after it: what the basket costs, what would
 * be left afterwards, and when that number would go negative, how far short
 * it is. Nobody should have to press a button to find out they cannot.
 */
export function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    cart,
    cartTotal,
    shippingFee,
    grandTotal,
    balance,
    removeFromCart,
    clearCart,
    checkout,
    address,
    setAddress,
    addressComplete,
    lastOrder,
    clearReceipt,
    undoClear,
  } = useWallet()
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const copy = COPY.cart
  const remaining = balance - grandTotal
  const short = Math.max(0, grandTotal - balance)
  const affordable = cart.length > 0 && short === 0
  /* Three things have to be true to place an order, and the button says which
     one is missing rather than sitting there greyed out with no reason. */
  const canOrder = affordable && addressComplete

  useEffect(() => {
    if (!open) {
      clearReceipt()
      return
    }
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
  }, [open, onClose, clearReceipt])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <button
            aria-label="ปิดตะกร้า"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-graphite/25 backdrop-blur-sm"
          />

          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={SPRING_SOFT}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper outline-none"
          >
            <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 id="cart-title" className="text-[19px] font-semibold tracking-tight text-graphite">
                {copy.title}
                {cart.length > 0 && (
                  <span className="ml-2 text-[15px] font-normal text-slate">{cart.length}</span>
                )}
              </h2>
              <button
                onClick={onClose}
                aria-label="ปิด"
                className="-mr-2 rounded-full p-2 text-slate transition-colors hover:bg-mist hover:text-graphite"
              >
                <Icon name="close" className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {/* A basket that empties itself is not a confirmation. This says
                  what was redeemed and what is left, and gets out of the way
                  when you close the panel. */}
              {lastOrder ? (
                <div className="flex h-full flex-col justify-center py-10">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING_SOFT}
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand"
                  >
                    <Icon name="check" className="h-6 w-6" strokeWidth={2.4} />
                  </motion.span>
                  <p className="mb-1 text-[19px] font-semibold tracking-tight text-graphite">
                    {copy.done}
                  </p>
                  <p className="mb-6 text-[14px] text-slate">
                    เลขที่ <span className="font-medium tabular-nums text-graphite">{lastOrder.number}</span>
                  </p>

                  {/* An order confirmation is a document, not a cheer. What was
                      ordered, where it is going, and when it lands. */}
                  <dl className="mb-6 flex flex-col text-[14px]">
                    {lastOrder.lines.map(line => (
                      <div key={line.key} className="flex justify-between gap-4 border-b border-hairline/60 py-2.5">
                        <dt className="min-w-0 text-slate">
                          <span className="text-graphite">{line.name}</span>
                          {line.size && line.size !== 'Free' && (
                            <span className="text-slate-soft"> · {line.size}</span>
                          )}
                        </dt>
                        <dd className="shrink-0 tabular-nums text-graphite">{line.coins}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 border-b border-hairline/60 py-2.5">
                      <dt className="text-slate">{copy.shipping}</dt>
                      <dd className="tabular-nums text-graphite">
                        {lastOrder.shipping === 0 ? copy.freeShipping : lastOrder.shipping}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 py-2.5 font-semibold">
                      <dt className="text-graphite">{copy.grandTotal}</dt>
                      <dd className="tabular-nums text-graphite">{lastOrder.total.toLocaleString('th-TH')}</dd>
                    </div>
                  </dl>

                  <div className="rounded-panel bg-mist p-4 text-[13px] leading-relaxed text-slate">
                    <p className="mb-1 font-medium text-graphite">{copy.arrives} {formatThaiDate(lastOrder.arrivesAt)}</p>
                    <p>{lastOrder.address.name} · {lastOrder.address.phone}</p>
                    <p>{lastOrder.address.address}</p>
                  </div>

                  <button onClick={onClose} className="btn-ghost mt-6 self-start">
                    เลือกของต่อ
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pb-16 text-center">
                  <Icon name="cart" className="mb-4 h-8 w-8 text-slate-soft" strokeWidth={1.4} />
                  <p className="mb-1.5 text-[15px] font-medium text-graphite">{copy.empty}</p>
                  <p className="max-w-[15rem] text-[13px] leading-relaxed text-slate">{copy.emptyHint}</p>
                  {undoClear && (
                    <button onClick={undoClear} className="btn-ghost mt-5">
                      เลิกทำการล้างตะกร้า
                    </button>
                  )}
                </div>
              ) : (
                <ul className="py-2">
                  <AnimatePresence initial={false}>
                    {cart.map(line => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={T.hover}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 border-b border-hairline/60 py-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-medium text-graphite">{line.name}</p>
                            <p className="mt-0.5 text-[12px] text-slate-soft">
                              {line.kind === 'item' ? COPY.nav.storeLabel : COPY.nav.libraryLabel}
                              {line.size && line.size !== 'Free' && ` · ไซซ์ ${line.size}`}
                            </p>
                          </div>
                          <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-graphite">
                            {line.coins === 0 ? (
                              'ฟรี'
                            ) : (
                              <>
                                <Icon name="coin" className="h-3.5 w-3.5 text-slate-soft" />
                                <span className="tabular-nums">{line.coins}</span>
                              </>
                            )}
                          </span>
                          <motion.button
                            onClick={() => removeFromCart(line.key)}
                            whileTap={{ scale: 0.9 }}
                            transition={SPRING_SOFT}
                            aria-label={`เอา ${line.name} ออกจากตะกร้า`}
                            className="tap shrink-0 rounded-full p-1.5 text-slate-soft transition-colors hover:bg-mist hover:text-graphite"
                          >
                            <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2} />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  <li className="pt-4">
                    <button
                      onClick={clearCart}
                      className="tap text-[13px] text-slate transition-colors hover:text-graphite"
                    >
                      ล้างตะกร้า
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {!lastOrder && (
            <footer className="border-t border-hairline px-6 pb-6 pt-5">
              {/* Where it is going, asked before the button rather than on a
                  second screen nobody expects. */}
              <div className="mb-5">
                <p className="mb-2.5 text-[12px] font-semibold tracking-label text-slate-soft">
                  {copy.addressTitle}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                      placeholder={copy.namePlaceholder}
                      aria-label={copy.namePlaceholder}
                      className="w-1/2 rounded-xl bg-mist px-3.5 py-2.5 text-[14px] text-graphite outline-none transition-shadow placeholder:text-slate-soft focus:ring-2 focus:ring-brand/40"
                    />
                    <input
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      placeholder={copy.phonePlaceholder}
                      aria-label={copy.phonePlaceholder}
                      inputMode="tel"
                      className="w-1/2 rounded-xl bg-mist px-3.5 py-2.5 text-[14px] text-graphite outline-none transition-shadow placeholder:text-slate-soft focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <textarea
                    value={address.address}
                    onChange={e => setAddress({ ...address, address: e.target.value })}
                    placeholder={copy.addressPlaceholder}
                    aria-label={copy.addressPlaceholder}
                    rows={2}
                    className="resize-none rounded-xl bg-mist px-3.5 py-2.5 text-[14px] leading-relaxed text-graphite outline-none transition-shadow placeholder:text-slate-soft focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <dl className="mb-5 flex flex-col gap-2 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-slate">{copy.total}</dt>
                  <dd className="tabular-nums text-graphite">{cartTotal.toLocaleString('th-TH')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">{copy.shipping}</dt>
                  <dd className={`tabular-nums ${shippingFee === 0 ? 'text-brand' : 'text-graphite'}`}>
                    {shippingFee === 0 ? copy.freeShipping : shippingFee}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-hairline/70 pt-2">
                  <dt className="font-medium text-graphite">{copy.grandTotal}</dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-graphite">
                    <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                    <span className="tabular-nums">{grandTotal.toLocaleString('th-TH')}</span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">{copy.balanceAfter}</dt>
                  <dd className={`tabular-nums font-medium ${short ? 'text-brand' : 'text-graphite'}`}>
                    {remaining.toLocaleString('th-TH')}
                  </dd>
                </div>
              </dl>

              <motion.button
                onClick={checkout}
                disabled={!canOrder}
                whileHover={canOrder ? { scale: 1.02 } : undefined}
                whileTap={canOrder ? { scale: 0.97 } : undefined}
                transition={SPRING_SOFT}
                className={`tap w-full rounded-full py-3.5 text-[15px] font-medium transition-colors ${
                  canOrder
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'cursor-not-allowed bg-mist text-slate-soft'
                }`}
              >
                {short
                  ? `${copy.short} — ขาดอีก ${short.toLocaleString('th-TH')}`
                  : !addressComplete
                    ? copy.addressRequired
                    : copy.checkout}
              </motion.button>

              <p className="mt-3 text-center text-[12px] text-slate-soft">{copy.note}</p>
            </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
