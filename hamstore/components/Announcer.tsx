'use client'

import { useWallet } from '@/components/WalletProvider'

/**
 * Says out loud what the interface just did.
 *
 * Adding something from halfway down the page changes a badge in the top
 * corner, which is off-screen — and to a screen reader, nothing happened at
 * all. Every cart change, equip and checkout writes a sentence here.
 *
 * `polite` rather than `assertive`: it waits for a pause instead of cutting
 * across whatever is being read. Nothing here is urgent enough to interrupt.
 */
export function Announcer() {
  const { announcement } = useWallet()
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  )
}
