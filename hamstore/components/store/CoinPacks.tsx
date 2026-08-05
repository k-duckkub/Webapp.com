'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { COIN_PACKS } from '@/lib/items'

export function CoinPacks() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-pack]', {
        y: 40,
        opacity: 0,
        stagger: 0.09,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })

      /* Coin sparkle drift in the background */
      gsap.to('[data-spark]', {
        y: -26,
        opacity: 0.85,
        duration: 2.4,
        ease: 'sine.inOut',
        stagger: { each: 0.18, repeat: -1, yoyo: true },
      })
    })
  })

  return (
    <section ref={root} className="relative overflow-hidden bg-[#1a1200] py-20">
      {/* sparkles */}
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          data-spark
          aria-hidden
          className="absolute rounded-full bg-coin"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            opacity: 0.25 + (i % 4) * 0.08,
            top: `${8 + ((i * 37) % 84)}%`,
            left: `${4 + ((i * 53) % 92)}%`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">HamCoin</p>
          <h2 className="mb-3 text-3xl font-black leading-tight text-coin sm:text-4xl">
            เหรียญไม่พอ?
          </h2>
          <p className="text-sm leading-relaxed text-[#c9a854]">
            ปกติ HamCoin ได้จากการเรียนจบบทเรียนและส่งงาน — แต่ถ้าอยากได้ของชิ้นที่หมายตาไว้เร็วขึ้น
            เติมเพิ่มได้ที่นี่
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {COIN_PACKS.map(pack => (
            <motion.div
              key={pack.id}
              data-pack
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className={`relative flex flex-col rounded-xl border p-5 ${
                pack.popular
                  ? 'border-brand bg-ink-750'
                  : 'border-[#3a3020] bg-ink-750/60'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-black text-white">
                  คุ้มที่สุด
                </span>
              )}

              <p className="mb-3 text-sm font-bold text-muted-bright">{pack.name}</p>

              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="text-2xl" aria-hidden>🪙</span>
                <span className="text-2xl font-black tabular-nums text-coin">
                  {pack.coins.toLocaleString('th-TH')}
                </span>
              </div>

              <p className="mb-5 h-4 text-xs font-bold text-emerald-400">
                {pack.bonus > 0 ? `+ โบนัส ${pack.bonus}` : ''}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-auto rounded py-2 text-sm font-black transition-colors ${
                  pack.popular
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'bg-ink-700 text-white hover:bg-ink-600'
                }`}
              >
                {pack.price}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
