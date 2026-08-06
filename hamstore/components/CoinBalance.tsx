'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useWallet } from './WalletProvider'

/**
 * The wallet chip. When the balance drops it counts down rather than jumping,
 * and the chip gives a short squeeze — the point is that spending is visible,
 * so pressing "แลกเลย" has a consequence you can watch.
 */
export function CoinBalance() {
  const { balance } = useWallet()
  const [nudge, setNudge] = useState(0)
  const previous = useRef(balance)

  const raw = useMotionValue(balance)
  const eased = useSpring(raw, { stiffness: 90, damping: 20, mass: 0.8 })
  const shown = useTransform(eased, v => Math.round(v).toLocaleString('th-TH'))

  useEffect(() => {
    raw.set(balance)
    if (balance !== previous.current) setNudge(n => n + 1)
    previous.current = balance
  }, [balance, raw])

  return (
    <motion.span
      key={nudge}
      animate={{ scale: [1, 1.14, 1] }}
      transition={{ duration: 0.45, times: [0, 0.35, 1], ease: [0.28, 0.11, 0.32, 1] }}
      className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[12px] font-medium tabular-nums text-graphite sm:ml-0 sm:px-3"
    >
      <span aria-hidden>🪙</span>
      <motion.span aria-hidden>{shown}</motion.span>
      <span className="sr-only">HamCoin คงเหลือ {balance.toLocaleString('th-TH')} เหรียญ</span>
    </motion.span>
  )
}
