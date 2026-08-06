'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { GSAP_EASE, DURATION } from '@/lib/motion'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      /* Headline first, then the supporting lines, then the art rises into
         place. Each step overlaps the last so it reads as one movement. */
      gsap
        .timeline({ defaults: { ease: GSAP_EASE, duration: DURATION.slow } })
        .from('[data-hero-line]', { y: 44, opacity: 0, stagger: 0.09 })
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: DURATION.base }, '-=0.85')
        .from('[data-hero-cta] > *', { y: 16, opacity: 0, stagger: 0.08, duration: DURATION.base }, '-=0.75')
        .from('[data-hero-art]', { y: 60, opacity: 0, scale: 0.96, duration: 1.4 }, '-=0.9')

      /* The art keeps rising a little as the page scrolls past it. */
      gsap.to('[data-hero-art]', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  })

  return (
    <section ref={root} className="relative overflow-hidden bg-paper pt-32 sm:pt-40">
      <div className="shell text-center">
        <p className="eyebrow mb-5" data-hero-line>
          HamStore
        </p>

        <h1 className="display-xl mx-auto max-w-copy text-graphite">
          <span className="block" data-hero-line>
            แต่งแฮมสเตอร์
          </span>
          <span className="block" data-hero-line>
            ให้เป็นตัวคุณ
          </span>
        </h1>

        <p className="lede mx-auto mt-6 max-w-xl" data-hero-sub>
          สกิน เพื่อนซี้ ธีมหน้าเว็บ อิโมจิ และกรอบโปรไฟล์ — แลกด้วย HamCoin
          ที่คุณสะสมจากการเรียน
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" data-hero-cta>
          <a href="#items" className="btn-pill">
            ดูของทั้งหมด
          </a>
          <a href="#how" className="btn-ghost">
            HamCoin ใช้ยังไง <span aria-hidden>›</span>
          </a>
        </div>
      </div>

      {/* Product shot — the item, presented the way Apple presents hardware. */}
      <div data-hero-art className="relative mt-16 flex justify-center px-6 pb-24 sm:mt-20">
        <div className="relative flex aspect-[4/3] w-full max-w-3xl items-center justify-center overflow-hidden rounded-panel bg-mist">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(249,115,22,0.16) 0%, transparent 62%)',
            }}
          />
          <span className="relative select-none text-[clamp(7rem,20vw,16rem)] leading-none">🐹</span>
        </div>
      </div>
    </section>
  )
}
