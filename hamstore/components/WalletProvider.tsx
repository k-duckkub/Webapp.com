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
  /** What the last checkout contained, so the cart can confirm it rather than
   *  just emptying itself. Cleared when the panel is dismissed. */
  lastCheckout: { count: number; total: number } | null
  clearReceipt: () => void
  /** Restores the cart exactly as it was before the last clear. */
  undoClear: (() => void) | null
  /** True once sessionStorage has been read, so the UI can avoid animating
   *  the jump from the default balance to the restored one. */
  hydrated: boolean
  /** Plain-language description of the last change, for a live region. */
  announcement: string

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
  const [lastCheckout, setLastCheckout] = useState<{ count: number; total: number } | null>(null)
  const [cleared, setCleared] = useState<CartLine[] | null>(null)
  const [announcement, setAnnouncement] = useState('')
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

  /* Every change says what it was out loud. A cart button in the top corner
     is off-screen for anyone adding from halfway down the page, and invisible
     to a screen reader either way. */
  const toggleCart = useCallback(
    (line: CartLine) => {
      if (owned.has(line.key)) return
      setCart(prev => {
        const had = prev.some(l => l.key === line.key)
        const next = had ? prev.filter(l => l.key !== line.key) : [...prev, line]
        setAnnouncement(
          `${had ? 'เอา' : 'ใส่'} ${line.name} ${had ? 'ออกจาก' : 'ลง'}ตะกร้าแล้ว — ตะกร้ามี ${next.length} ชิ้น`,
        )
        return next
      })
    },
    [owned],
  )

  const removeFromCart = useCallback((key: string) => {
    setCart(prev => {
      const line = prev.find(l => l.key === key)
      const next = prev.filter(l => l.key !== key)
      if (line) setAnnouncement(`เอา ${line.name} ออกจากตะกร้าแล้ว — ตะกร้ามี ${next.length} ชิ้น`)
      return next
    })
  }, [])

  /* Emptying a basket someone spent time filling is destructive, and a
     confirm dialog for it would be worse than the mistake. The old contents
     are kept so one press puts them back. */
  const clearCart = useCallback(() => {
    setCart(prev => {
      if (prev.length) {
        setCleared(prev)
        setAnnouncement(`ล้างตะกร้าแล้ว ${prev.length} ชิ้น — กดเลิกทำเพื่อเอากลับ`)
      }
      return []
    })
  }, [])

  const undoClear = useMemo(
    () =>
      cleared
        ? () => {
            setCart(cleared)
            setCleared(null)
            setAnnouncement(`เอาของ ${cleared.length} ชิ้นกลับเข้าตะกร้าแล้ว`)
          }
        : null,
    [cleared],
  )

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
    setCleared(null)
    /* The panel shows a receipt rather than snapping to its empty state —
       a basket that vanishes is not a confirmation that anything happened. */
    setLastCheckout({ count: cart.length, total: cartTotal })
    setAnnouncement(
      `แลกสำเร็จ ${cart.length} ชิ้น ใช้ไป ${cartTotal.toLocaleString('th-TH')} เหรียญ เหลือ ${(balance - cartTotal).toLocaleString('th-TH')} เหรียญ`,
    )
    return true
  }, [cart, cartTotal, balance])

  const clearReceipt = useCallback(() => setLastCheckout(null), [])

  const isEquipped = useCallback((item: PlatformItem) => equipped[item.kind] === item.id, [equipped])

  /* Wearing a second skin has to take the first one off — otherwise "ใช้งาน"
     is a button you can press forever with nothing to show for it. */
  const equip = useCallback((item: PlatformItem) => {
    setEquipped(prev => {
      const wearing = prev[item.kind] === item.id
      setAnnouncement(wearing ? `เลิกใช้ ${item.name} แล้ว` : `ใช้ ${item.name} แล้ว`)
      return { ...prev, [item.kind]: wearing ? undefined : item.id }
    })
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
      lastCheckout,
      clearReceipt,
      undoClear,
      hydrated,
      announcement,
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
      lastCheckout,
      clearReceipt,
      undoClear,
      hydrated,
      announcement,
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
