'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PLATFORM_ITEMS, type ItemKind, type PlatformItem } from '@/lib/items'
import { STORE_ASSETS, type StoreAsset } from '@/lib/library'

/**
 * One wallet, one cart, both pages.
 *
 * The two pages sell different things — profile decoration on one, Unity
 * packages on the other — and the earlier split (buy instantly here, already
 * own everything there) left the second page unable to say where its contents
 * came from. Now everything is bought the same way: add to the cart from
 * either page, redeem the cart once, and the coins come off in one place.
 *
 * Items and assets both number from 1, so ownership is keyed by a prefixed
 * string rather than a bare id. Two catalogues sharing a number space is the
 * kind of bug that shows up as one purchase quietly unlocking two things.
 */

const STARTING_BALANCE = 1240

/**
 * The two pages are separate documents in a static export, so following a nav
 * link tears down React and takes the cart with it. A cart you lose by
 * clicking the other page is not a cart. State is mirrored into sessionStorage
 * and read back on mount — session rather than local, so a fresh tab starts
 * from the catalogue's own state instead of yesterday's shopping.
 *
 * Hydration reads on mount rather than during the first render: the server
 * rendered the default, and reading storage inline would make the client
 * disagree with the markup on the very first paint.
 */
const STORAGE_KEY = 'hamstore.wallet.v1'

type Persisted = {
  balance: number
  owned: string[]
  cart: CartLine[]
  equipped: Partial<Record<ItemKind, number>>
}

export type LineKind = 'item' | 'asset'

/** The shape the cart works in, whichever catalogue a thing came from. */
export interface CartLine {
  key: string
  kind: LineKind
  id: number
  name: string
  /** After any discount — the number actually charged. */
  coins: number
}

export const itemKey = (id: number) => `item:${id}`
export const assetKey = (id: number) => `asset:${id}`

export function priceOf(entry: { coins: number; sale: number }) {
  return entry.sale > 0 ? Math.round(entry.coins * (1 - entry.sale / 100)) : entry.coins
}

export const itemLine = (item: PlatformItem): CartLine => ({
  key: itemKey(item.id),
  kind: 'item',
  id: item.id,
  name: item.name,
  coins: priceOf(item),
})

export const assetLine = (asset: StoreAsset): CartLine => ({
  key: assetKey(asset.id),
  kind: 'asset',
  id: asset.id,
  name: asset.title,
  coins: priceOf(asset),
})

type Wallet = {
  balance: number
  owns: (key: string) => boolean

  cart: CartLine[]
  cartTotal: number
  inCart: (key: string) => boolean
  /** Adding something already in the cart takes it back out. */
  toggleCart: (line: CartLine) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  /** Redeems the whole cart. False when it is empty or the balance is short. */
  checkout: () => boolean
  /** Set for a moment after a successful checkout, so the UI can react. */
  justCheckedOut: number | null

  /** Worn platform items, one per category. Assets are not worn. */
  isEquipped: (item: PlatformItem) => boolean
  equip: (item: PlatformItem) => void
}

const WalletContext = createContext<Wallet | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(STARTING_BALANCE)
  const [owned, setOwned] = useState<Set<string>>(
    () =>
      new Set([
        ...PLATFORM_ITEMS.filter(i => i.owned).map(i => itemKey(i.id)),
        ...STORE_ASSETS.filter(a => a.owned).map(a => assetKey(a.id)),
      ]),
  )
  const [cart, setCart] = useState<CartLine[]>([])
  const [justCheckedOut, setJustCheckedOut] = useState<number | null>(null)
  const [equipped, setEquipped] = useState<Partial<Record<ItemKind, number>>>({})
  /* State, not a ref: the write effect has to run again *after* the loaded
     values are committed. With a ref it ran in the same pass, still holding
     the defaults, and saved them straight over the session it had just read. */
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Persisted
        if (typeof saved.balance === 'number') setBalance(saved.balance)
        if (Array.isArray(saved.owned)) setOwned(new Set(saved.owned))
        if (Array.isArray(saved.cart)) setCart(saved.cart)
        if (saved.equipped) setEquipped(saved.equipped)
      }
    } catch {
      /* A corrupt or blocked store is not worth breaking the page over. */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    /* Never write before the read, or the defaults overwrite the session. */
    if (!hydrated) return
    try {
      const payload: Persisted = { balance, owned: [...owned], cart, equipped }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* Private mode and full quotas both land here; shopping still works. */
    }
  }, [hydrated, balance, owned, cart, equipped])

  const owns = useCallback((key: string) => owned.has(key), [owned])
  const inCart = useCallback((key: string) => cart.some(l => l.key === key), [cart])

  const toggleCart = useCallback(
    (line: CartLine) => {
      if (owned.has(line.key)) return
      setCart(prev =>
        prev.some(l => l.key === line.key) ? prev.filter(l => l.key !== line.key) : [...prev, line],
      )
    },
    [owned],
  )

  const removeFromCart = useCallback((key: string) => {
    setCart(prev => prev.filter(l => l.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = useMemo(() => cart.reduce((sum, l) => sum + l.coins, 0), [cart])

  const checkout = useCallback(() => {
    if (!cart.length || cartTotal > balance) return false
    setOwned(prev => {
      const next = new Set(prev)
      for (const line of cart) next.add(line.key)
      return next
    })
    setBalance(prev => prev - cartTotal)
    setCart([])
    setJustCheckedOut(Date.now())
    /* Clear the flag so the confirmation plays once, not on every re-render. */
    window.setTimeout(() => setJustCheckedOut(null), 2600)
    return true
  }, [cart, cartTotal, balance])

  const isEquipped = useCallback((item: PlatformItem) => equipped[item.kind] === item.id, [equipped])

  /* Wearing a second skin has to take the first one off — otherwise "ใช้งาน"
     is a button you can press forever with nothing to show for it. */
  const equip = useCallback((item: PlatformItem) => {
    setEquipped(prev => ({
      ...prev,
      [item.kind]: prev[item.kind] === item.id ? undefined : item.id,
    }))
  }, [])

  const value = useMemo(
    () => ({
      balance,
      owns,
      cart,
      cartTotal,
      inCart,
      toggleCart,
      removeFromCart,
      clearCart,
      checkout,
      justCheckedOut,
      isEquipped,
      equip,
    }),
    [
      balance,
      owns,
      cart,
      cartTotal,
      inCart,
      toggleCart,
      removeFromCart,
      clearCart,
      checkout,
      justCheckedOut,
      isEquipped,
      equip,
    ],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}
