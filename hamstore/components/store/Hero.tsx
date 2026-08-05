'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'

export function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      /* Intro timeline: art panel wipes up, then the copy card staggers in. */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-art]', { yPercent: 8, opacity: 0, duration: 0.9 })
        .from('[data-hero-blocks] > *', { y: 40, opacity: 0, stagger: 0.12, duration: 0.7 }, '-=0.55')
        .from('[data-hero-card] > *', { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.45')

      /* Slow parallax drift on the background as the hero scrolls away. */
      gsap.to('[data-hero-bg]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  })

  return (
    <section ref={root} className="relative min-h-[560px] overflow-hidden bg-ink-950">
      {/* Split background */}
      <div data-hero-bg className="absolute inset-0 flex">
        <div className="flex-1 bg-[linear-gradient(135deg,#0d1117_0%,#1a1020_100%)]" />
        <div className="w-2/5 bg-[linear-gradient(135deg,#1a0a00_0%,#2d1500_100%)]" />
      </div>

      {/* Minecraft-ish corner ticks */}
      <div className="absolute right-4 top-4 h-2 w-2 border-r-2 border-t-2 border-brand" />
      <div className="absolute right-8 top-4 h-2 w-2 border-r-2 border-t-2 border-brand/40" />
      <div className="absolute bottom-4 right-4 h-2 w-2 border-b-2 border-r-2 border-brand" />

      {/* Floating item blocks on the right */}
      <div data-hero-blocks className="pointer-events-none absolute right-0 top-0 hidden h-full w-2/5 md:block">
        {[
          { emoji: '🐹', size: 132, top: '14%', left: '18%', from: '#7C3AED', to: '#2563EB', delay: 0 },
          { emoji: '🎨', size: 96,  top: '46%', left: '52%', from: '#DC2626', to: '#F97316', delay: 0.6 },
          { emoji: '🪙', size: 84,  top: '68%', left: '14%', from: '#F59E0B', to: '#FACC15', delay: 1.2 },
        ].map(b => (
          <motion.div
            key={b.emoji}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
            className="absolute flex items-center justify-center rounded-lg shadow-2xl"
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              background: `linear-gradient(145deg, ${b.from}cc, ${b.to}44)`,
              border: `2px solid ${b.from}66`,
              fontSize: b.size * 0.42,
            }}
          >
            {b.emoji}
          </motion.div>
        ))}
      </div>

      {/* Left content */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-between px-6 py-14">
        <div
          data-hero-art
          className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded md:w-3/5"
          style={{
            background:
              'radial-gradient(ellipse at 40% 60%, #7C3AED33 0%, transparent 70%), radial-gradient(ellipse at 70% 30%, #F9731622 0%, transparent 60%), #0d1117',
          }}
        >
          <div className="bg-grid absolute inset-0 opacity-10" />
          <span className="select-none text-6xl font-black tracking-tighter text-brand/15 sm:text-7xl">
            HAMSTORE
          </span>
        </div>

        <div
          data-hero-card
          className="mt-6 max-w-md rounded border border-ink-600 bg-black/75 p-5 backdrop-blur"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            HamStore · ของที่ซื้อได้
          </p>
          <h1 className="mb-2 text-3xl font-black leading-tight text-white">
            แต่งแฮมสเตอร์
            <br />
            ให้เป็นตัวคุณ
          </h1>
          <p className="mb-4 text-sm text-muted">
            สกิน เพื่อนซี้ ธีมหน้าเว็บ อิโมจิ และกรอบโปรไฟล์ — ใช้ HamCoin ที่สะสมจากการเรียนมาแลกได้เลย
          </p>
          <motion.a
            href="#items"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-xs font-black text-white"
          >
            ดูของทั้งหมด <span aria-hidden>›</span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
