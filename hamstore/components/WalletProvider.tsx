'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { PLATFORM_ITEMS, type ItemKind, type PlatformItem } from '@/lib/items'

const STARTING_BALANCE = 1240

export function priceOf(item: PlatformItem) {
  return item.sale > 0 ? Math.round(item.coins * (1 - item.sale / 100)) : item.coins
}

type Wallet = {
  balance: number
  owns: (id: number) => boolean
  /** Whether this item could be redeemed right now. */
  canAfford: (item: PlatformItem) => boolean
  /** Returns false when it was already owned or the balance is short. */
  redeem: (item: PlatformItem) => boolean
  /** Item ids redeemed during this visit, so cards can celebrate only their own. */
  justRedeemed: number | null
  /** The item currently worn in each category — one at a time, like a real
   *  wardrobe. `equip` on the item already worn takes it off. */
  equipped: Partial<Record<ItemKind, number>>
  isEquipped: (item: PlatformItem) => boolean
  equip: (item: PlatformItem) => void
}

const WalletContext = createContext<Wallet | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(STARTING_BALANCE)
  const [owned, setOwned] = useState<Set<number>>(
    () => new Set(PLATFORM_ITEMS.filter(i => i.owned).map(i => i.id)),
  )
  const [justRedeemed, setJustRedeemed] = useState<number | null>(null)
  const [equipped, setEquipped] = useState<Partial<Record<ItemKind, number>>>({})

  const owns = useCallback((id: number) => owned.has(id), [owned])

  const canAfford = useCallback(
    (item: PlatformItem) => !owned.has(item.id) && priceOf(item) <= balance,
    [owned, balance],
  )

  const redeem = useCallback(
    (item: PlatformItem) => {
      const cost = priceOf(item)
      if (owned.has(item.id) || cost > balance) return false

      setOwned(prev => new Set(prev).add(item.id))
      setBalance(prev => prev - cost)
      setJustRedeemed(item.id)
      /* Clear the flag so the celebration plays once, not on every re-render. */
      window.setTimeout(() => setJustRedeemed(cur => (cur === item.id ? null : cur)), 1600)
      return true
    },
    [owned, balance],
  )

  const isEquipped = useCallback(
    (item: PlatformItem) => equipped[item.kind] === item.id,
    [equipped],
  )

  /* Wearing a second skin has to take the first one off — otherwise "ใช้งาน"
     is a button you can press forever with nothing to show for it. */
  const equip = useCallback((item: PlatformItem) => {
    setEquipped(prev => ({
      ...prev,
      [item.kind]: prev[item.kind] === item.id ? undefined : item.id,
    }))
  }, [])

  const value = useMemo(
    () => ({ balance, owns, canAfford, redeem, justRedeemed, equipped, isEquipped, equip }),
    [balance, owns, canAfford, redeem, justRedeemed, equipped, isEquipped, equip],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}
