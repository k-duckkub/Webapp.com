'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { Icon, type IconName } from '@/components/Icon'
import { GSAP_EASE, DURATION, pressable } from '@/lib/motion'

/** Tiles drifting across the hero art. Positions are viewport-relative. */
const MARKS: { icon: IconName; size: number; top: string; left: string; tint: string; delay: number }[] = [
  { icon: 'skin',    size: 200, top: '18%', left: '58%', tint: '#F97316', delay: 0 },
  { icon: 'theme',   size: 132, top: '54%', left: '76%', tint: '#7C3AED', delay: 0.7 },
  { icon: 'frame',   size: 110, top: '30%', left: '86%', tint: '#059669', delay: 1.4 },
  { icon: 'pet',     size: 96,  top: '72%', left: '61%', tint: '#DC2626', delay: 2.1 },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ defaults: { ease: GSAP_EASE, duration: DURATION.slow } })
        .from('[data-hero-mark]', { scale: 0.88, opacity: 0, stagger: 0.1, duration: 1.4 })
        .from('[data-hero-line]', { y: 44, opacity: 0, stagger: 0.09 }, '-=1.1')
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: DURATION.base }, '-=0.85')
        .from('[data-hero-cta] > *', { y: 16, opacity: 0, stagger: 0.08, duration: DURATION.base }, '-=0.75')
        .from('[data-hero-cue]', { opacity: 0, duration: DURATION.base }, '-=0.5')

      gsap.to('[data-hero-bg]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  })

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[620px] w-full flex-col justify-end overflow-hidden bg-mist"
    >
      {/* Art fills the viewport rather than sitting in a panel. */}
      <div data-hero-bg className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 22% 30%, #ffffff 0%, transparent 55%), radial-gradient(ellipse at 72% 45%, rgba(249,115,22,0.16) 0%, transparent 58%), radial-gradient(ellipse at 88% 78%, rgba(124,58,237,0.12) 0%, transparent 55%)',
          }}
        />

        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {MARKS.map(m => (
            <motion.div
              key={m.icon}
              data-hero-mark
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: m.delay }}
              className="absolute flex items-center justify-center rounded-panel bg-paper"
              style={{
                width: m.size,
                height: m.size,
                top: m.top,
                left: m.left,
                boxShadow: `0 30px 60px -20px ${m.tint}33, inset 0 0 70px ${m.tint}12`,
              }}
            >
              <Icon
                name={m.icon}
                style={{ width: m.size * 0.44, height: m.size * 0.44, color: m.tint }}
                strokeWidth={1.3}
              />
            </motion.div>
          ))}
        </div>

        {/* Keeps the overlaid copy legible where the art is busiest. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(245,245,247,0.97)_0%,rgba(245,245,247,0.75)_30%,transparent_62%)]" />
      </div>

      {/* Copy sits over the art at the bottom left. */}
      <div data-hero-cta-wrap className="bleed relative pb-24 pt-40">
        <p className="eyebrow mb-4" data-hero-line>
          HamStore
        </p>
        <h1 className="display-xl mb-6 max-w-3xl text-graphite">
          <span className="block" data-hero-line>
            แต่งแฮมสเตอร์
          </span>
          <span className="block" data-hero-line>
            ให้เป็นตัวคุณ
          </span>
        </h1>
        <p className="lede mb-9 max-w-xl" data-hero-sub>
          สกิน เพื่อนซี้ ธีมหน้าเว็บ อิโมจิ และกรอบโปรไฟล์ — แลกด้วย HamCoin ที่คุณสะสมจากการเรียน
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4" data-hero-cta>
          <motion.a href="#items" className="btn-pill" {...pressable}>
            ดูของทั้งหมด
          </motion.a>
          <a href="#how" className="btn-ghost">
            HamCoin ใช้ยังไง <Icon name="chevronRight" className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      <div
        data-hero-cue
        aria-hidden
        className="absolute inset-x-0 bottom-6 flex justify-center text-slate-soft"
      >
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon name="arrowDown" className="h-4 w-4" />
        </motion.span>
      </div>
    </section>
  )
}
