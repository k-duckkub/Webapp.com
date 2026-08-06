'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK, MOTION_REDUCED } from '@/lib/gsap'
import { GSAP_EASE } from '@/lib/motion'
import { PATHWAY_STOPS } from '@/lib/items'
import { Icon } from '@/components/Icon'

/**
 * The scroll-scrubbed set piece: the section pins, and the three steps trade
 * places as you scroll through it while the mark behind them grows. One
 * timeline drives everything, so nothing can drift out of step.
 */
export function PinnedStory() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    /* Pinning hijacks the scroll, so keep it to pointer-sized screens and to
       visitors who haven't asked for less motion. */
    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      /* The mark grows across the sequence, but stays a texture behind the
         words rather than competing with them. */
      tl.fromTo('[data-story-mark]', { scale: 0.8, opacity: 0.05 }, { scale: 1.12, opacity: 0.13, ease: 'none' }, 0)

      PATHWAY_STOPS.forEach((_, i) => {
        const at = i * 0.32
        tl.fromTo(
          `[data-story-step="${i}"]`,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
          at,
        )
        /* Every step but the last hands off to the next. */
        if (i < PATHWAY_STOPS.length - 1) {
          tl.to(`[data-story-step="${i}"]`, { opacity: 0, y: -40, duration: 0.14, ease: 'power2.in' }, at + 0.22)
        }
      })
    })

    /* No pin: the steps simply stack and reveal in place. */
    mm.add(`${MOTION_REDUCED}, (max-width: 767px)`, () => {
      gsap.set('[data-story-step]', { position: 'relative', opacity: 1, y: 0 })
      gsap.utils.toArray<HTMLElement>('[data-story-step]').forEach(step => {
        gsap.from(step, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: GSAP_EASE,
          scrollTrigger: { trigger: step, start: 'top 85%' },
        })
      })
    })
  })

  return (
    <section
      ref={root}
      id="how"
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-obsidian py-24 text-white md:h-screen md:py-0"
    >
      <div
        data-story-mark
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <Icon name="coin" className="h-[64vw] w-[64vw] text-white md:h-[42vw] md:w-[42vw]" strokeWidth={0.5} />
      </div>

      {/* Darkens the middle so the copy always clears the mark behind it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, transparent 75%)' }}
      />

      <div className="shell relative">
        {/* On desktop the steps stack in one place and cross-fade; on mobile
            they simply flow down the page. */}
        <div className="relative mx-auto max-w-2xl md:h-64">
          {PATHWAY_STOPS.map((stop, i) => (
            <div
              key={stop.id}
              data-story-step={i}
              className="mb-14 text-center md:absolute md:inset-x-0 md:top-0 md:mb-0"
            >
              <p className="mb-4 text-sm font-semibold tracking-label text-white/45">{stop.step}</p>
              <h2 className="display-lg mb-5 text-white">{stop.title}</h2>
              <p className="lede mx-auto max-w-lg text-white/60">{stop.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
