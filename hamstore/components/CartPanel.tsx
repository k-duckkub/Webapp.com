'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING_SOFT, T } from '@/lib/motion'
import { COPY } from '@/lib/content'
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
  const { cart, cartTotal, balance, removeFromCart, clearCart, checkout, justCheckedOut } = useWallet()
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const copy = COPY.cart
  const remaining = balance - cartTotal
  const short = Math.max(0, cartTotal - balance)
  const affordable = cart.length > 0 && short === 0

  useEffect(() => {
    if (!open) return
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
  }, [open, onClose])

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
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pb-16 text-center">
                  <Icon name="cart" className="mb-4 h-8 w-8 text-slate-soft" strokeWidth={1.4} />
                  <p className="mb-1.5 text-[15px] font-medium text-graphite">{copy.empty}</p>
                  <p className="max-w-[15rem] text-[13px] leading-relaxed text-slate">{copy.emptyHint}</p>
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
                            className="shrink-0 rounded-full p-1.5 text-slate-soft transition-colors hover:bg-mist hover:text-graphite"
                          >
                            <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2} />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  <li className="pt-4">
                    <button onClick={clearCart} className="text-[13px] text-slate transition-colors hover:text-graphite">
                      ล้างตะกร้า
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <footer className="border-t border-hairline px-6 pb-6 pt-5">
              <dl className="mb-5 flex flex-col gap-2 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-slate">{copy.total}</dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-graphite">
                    <Icon name="coin" className="h-4 w-4 text-slate-soft" />
                    <span className="tabular-nums">{cartTotal.toLocaleString('th-TH')}</span>
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
                disabled={!affordable}
                whileHover={affordable ? { scale: 1.02 } : undefined}
                whileTap={affordable ? { scale: 0.97 } : undefined}
                transition={SPRING_SOFT}
                className={`w-full rounded-full py-3.5 text-[15px] font-medium transition-colors ${
                  affordable
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'cursor-not-allowed bg-mist text-slate-soft'
                }`}
              >
                {justCheckedOut ? copy.done : short ? `${copy.short} — ขาดอีก ${short.toLocaleString('th-TH')}` : copy.checkout}
              </motion.button>

              <p className="mt-3 text-center text-[12px] text-slate-soft">{copy.note}</p>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
