'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_SOFT, T } from '@/lib/motion'
import { COPY } from '@/lib/content'
import { useWallet } from '@/components/WalletProvider'
import { Icon } from '@/components/Icon'

/**
 * The cart's handle in the nav.
 *
 * The count is the only thing on the bar that changes as you shop, so it is
 * the thing that has to be legible at a glance — it appears only when there is
 * something in it, and the whole chip gives a short squeeze each time the
 * number changes, so adding from halfway down the page still registers.
 */
export function CartButton({ onOpen }: { onOpen: () => void }) {
  const { cart } = useWallet()
  const count = cart.length

  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_SOFT}
      aria-label={count ? `${COPY.nav.cartLabel} — ${count} ชิ้น` : `${COPY.nav.cartLabel} — ว่าง`}
      className="relative ml-0.5 shrink-0 rounded-full bg-mist p-2 text-graphite transition-colors hover:bg-hairline sm:ml-1"
    >
      <Icon name="cart" className="h-4 w-4" strokeWidth={1.7} />

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1.25, 1], opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={T.hover}
            className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
