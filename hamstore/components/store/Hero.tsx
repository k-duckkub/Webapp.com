'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'

/** Blocks drifting across the hero art. Positions are viewport-relative. */
const BLOCKS = [
  { emoji: '🐹', size: 168, top: '16%', left: '58%', from: '#7C3AED', to: '#2563EB', delay: 0 },
  { emoji: '🎨', size: 116, top: '52%', left: '74%', from: '#DC2626', to: '#F97316', delay: 0.6 },
  { emoji: '🪙', size: 96,  top: '30%', left: '86%', from: '#F59E0B', to: '#FACC15', delay: 1.2 },
  { emoji: '🐾', size: 84,  top: '70%', left: '60%', from: '#059669', to: '#0891B2', delay: 1.8 },
]

export function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-blocks] > *', { scale: 0.8, opacity: 0, stagger: 0.12, duration: 0.8 })
        .from('[data-hero-card] > *', { y: 26, opacity: 0, stagger: 0.09, duration: 0.6 }, '-=0.5')
        .from('[data-hero-cue]', { opacity: 0, duration: 0.5 }, '-=0.2')

      /* The art drifts slower than the page, so the hero peels away on scroll. */
      gsap.to('[data-hero-bg]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  })

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[600px] w-full flex-col justify-end overflow-hidden bg-ink-950"
    >
      {/* Full-bleed art — this fills the viewport rather than sitting in a box. */}
      <div data-hero-bg className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#0d1117_0%,#1a1020_45%,#2d1500_100%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 22% 70%, #7C3AED33 0%, transparent 60%), radial-gradient(ellipse at 78% 28%, #F9731633 0%, transparent 55%)',
          }}
        />
        <div className="bg-grid absolute inset-0 opacity-[0.07]" />

        <div data-hero-blocks className="pointer-events-none absolute inset-0 hidden md:block">
          {BLOCKS.map(b => (
            <motion.div
              key={b.emoji}
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
              className="absolute flex items-center justify-center rounded-xl shadow-2xl"
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

        {/* Scrim so the overlaid copy stays legible against the art. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.55)_35%,transparent_70%)]" />
      </div>

      {/* Copy sits over the art, bottom-left, the way a game portal opens. */}
      <div data-hero-card className="relative w-full px-6 pb-20 sm:px-10 lg:px-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">
          HamStore · ของที่ซื้อได้
        </p>
        <h1 className="mb-4 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.95] text-white">
          แต่งแฮมสเตอร์
          <br />
          ให้เป็นตัวคุณ
        </h1>
        <p className="mb-7 max-w-xl text-base leading-relaxed text-muted">
          สกิน เพื่อนซี้ ธีมหน้าเว็บ อิโมจิ และกรอบโปรไฟล์ — ใช้ HamCoin ที่สะสมจากการเรียนมาแลกได้เลย
        </p>
        <motion.a
          href="#items"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded bg-brand px-8 py-4 text-sm font-black uppercase tracking-wide text-white"
        >
          ดูของทั้งหมด <span aria-hidden>›</span>
        </motion.a>
      </div>

      <div
        data-hero-cue
        aria-hidden
        className="absolute inset-x-0 bottom-5 flex justify-center text-xs text-muted-dim"
      >
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          ↓ เลื่อนลง
        </motion.span>
      </div>
    </section>
  )
}
