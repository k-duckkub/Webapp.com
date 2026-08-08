'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PLATFORM_ITEMS, type PlatformItem } from '@/lib/items'
import { STORE_ASSETS, type StoreAsset } from '@/lib/library'
import { CONTENT } from '@/lib/content'

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

const STARTING_BALANCE = CONTENT.settings.startingBalance

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
  orders: Order[]
  address: Address
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
  /** Which size was chosen. Physical goods only; assets have none. */
  size?: string
}

/** Where an order is going, and who to hand it to. */
export interface Address {
  name: string
  phone: string
  address: string
}

export interface Order {
  number: string
  placedAt: string
  arrivesAt: string
  lines: CartLine[]
  goods: number
  shipping: number
  total: number
  address: Address
}

/* A size makes a different line, because a medium and a large are two things
   to pick, pack and post — not one line with a note on it. */
export const itemKey = (id: number, size?: string) => (size ? `item:${id}:${size}` : `item:${id}`)
export const assetKey = (id: number) => `asset:${id}`

export function priceOf(entry: { coins: number; sale: number }) {
  return entry.sale > 0 ? Math.round(entry.coins * (1 - entry.sale / 100)) : entry.coins
}

export const itemLine = (item: PlatformItem, size?: string): CartLine => ({
  key: itemKey(item.id, size),
  kind: 'item',
  id: item.id,
  name: item.name,
  coins: priceOf(item),
  size,
})

/** True when any size of this product is already in the basket. */
export const anySizeInCart = (cart: CartLine[], id: number) =>
  cart.some(l => l.kind === 'item' && l.id === id)

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
  /** Goods, postage and what it comes to. Postage is free over a threshold,
   *  and both numbers are stated before the button rather than after it. */
  shippingFee: number
  grandTotal: number

  address: Address
  setAddress: (next: Address) => void
  addressComplete: boolean

  /** Orders placed this session, newest first. */
  orders: Order[]
  /** The order just placed, so the cart can show a receipt for it. */
  lastOrder: Order | null
  clearReceipt: () => void
  /** Restores the cart exactly as it was before the last clear. */
  undoClear: (() => void) | null
  /** True once sessionStorage has been read, so the UI can avoid animating
   *  the jump from the default balance to the restored one. */
  hydrated: boolean
  /** Plain-language description of the last change, for a live region. */
  announcement: string

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
  const [orders, setOrders] = useState<Order[]>([])
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [address, setAddress] = useState<Address>({ name: '', phone: '', address: '' })
  const [cleared, setCleared] = useState<CartLine[] | null>(null)
  const [announcement, setAnnouncement] = useState('')
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
        if (Array.isArray(saved.orders)) setOrders(saved.orders)
        if (saved.address) setAddress(saved.address)
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
      const payload: Persisted = { balance, owned: [...owned], cart, orders, address }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* Private mode and full quotas both land here; shopping still works. */
    }
  }, [hydrated, balance, owned, cart, orders, address])

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

  const SHIPPING = CONTENT.settings.shipping
  /* Free over the threshold, and an empty basket is not "free postage" —
     it is no postage, which reads as a nonsense line in the totals. */
  const shippingFee = useMemo(
    () => (cart.length === 0 || cartTotal >= SHIPPING.freeOver ? 0 : SHIPPING.fee),
    [cart.length, cartTotal, SHIPPING],
  )
  const grandTotal = cartTotal + shippingFee

  const addressComplete = useMemo(
    () => Boolean(address.name.trim() && address.phone.trim() && address.address.trim()),
    [address],
  )

  /* Slowest thing in the basket sets the date: a parcel leaves when all of it
     is ready, so quoting the fastest line would be a promise we cannot keep. */
  const shipsInDays = useMemo(() => {
    const days = cart
      .filter(l => l.kind === 'item')
      .map(l => PLATFORM_ITEMS.find(i => i.id === l.id)?.shipsIn ?? 3)
    return days.length ? Math.max(...days) : 0
  }, [cart])

  const checkout = useCallback(() => {
    if (!cart.length || grandTotal > balance || !addressComplete) return false
    setOwned(prev => {
      const next = new Set(prev)
      for (const line of cart) next.add(line.key)
      return next
    })
    setBalance(prev => prev - grandTotal)
    setCart([])
    setCleared(null)

    const placed = new Date()
    const arrives = new Date(placed.getTime() + shipsInDays * 86_400_000)
    const order: Order = {
      number: `HS-${placed.getFullYear()}${String(placed.getMonth() + 1).padStart(2, '0')}${String(placed.getDate()).padStart(2, '0')}-${String(orders.length + 1).padStart(3, '0')}`,
      placedAt: placed.toISOString().slice(0, 10),
      arrivesAt: arrives.toISOString().slice(0, 10),
      lines: cart,
      goods: cartTotal,
      shipping: shippingFee,
      total: grandTotal,
      address,
    }
    setOrders(prev => [order, ...prev])
    /* The panel shows the order rather than snapping to its empty state — a
       basket that vanishes is not a confirmation that anything happened. */
    setLastOrder(order)
    setAnnouncement(
      `สั่งซื้อสำเร็จ ${cart.length} ชิ้น เลขที่ ${order.number} ใช้ไป ${grandTotal.toLocaleString('th-TH')} เหรียญ เหลือ ${(balance - grandTotal).toLocaleString('th-TH')} เหรียญ`,
    )
    return true
  }, [cart, cartTotal, shippingFee, grandTotal, balance, addressComplete, address, orders.length, shipsInDays])

  const clearReceipt = useCallback(() => setLastOrder(null), [])


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
      shippingFee,
      grandTotal,
      address,
      setAddress,
      addressComplete,
      orders,
      lastOrder,
      clearReceipt,
      undoClear,
      hydrated,
      announcement,
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
      shippingFee,
      grandTotal,
      address,
      setAddress,
      addressComplete,
      orders,
      lastOrder,
      clearReceipt,
      undoClear,
      hydrated,
      announcement,
    ],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}
