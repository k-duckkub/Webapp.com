'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { Icon } from '@/components/Icon'
import { GSAP_EASE, DURATION, pressable } from '@/lib/motion'
import { COPY, imageSrc } from '@/lib/content'

/**
 * The opening.
 *
 * The old one floated four tinted tiles carrying the icons of categories that
 * no longer exist — skins, pets, themes, frames — over an empty gradient. A
 * shop whose first screen contains none of its goods is a landing page for
 * nothing, and those four tints were the whole rainbow the rest of the page
 * has since dropped.
 *
 * The shape here is HamsterHub's own: copy left, picture right, the heading
 * black with its second half in the one accent colour. The picture slot reads
 * from `store.hero.image`, so dropping the mascot render into the studio fills
 * it without touching this file.
 */
const hero = COPY.store.hero
const heroImage = imageSrc(hero.image)

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ defaults: { ease: GSAP_EASE, duration: DURATION.slow } })
        .from('[data-hero-line]', { y: 40, opacity: 0, stagger: 0.09 })
        .from('[data-hero-sub]', { y: 22, opacity: 0, duration: DURATION.base }, '-=0.8')
        .from('[data-hero-cta] > *', { y: 16, opacity: 0, stagger: 0.08, duration: DURATION.base }, '-=0.7')
        .from('[data-hero-art]', { opacity: 0, scale: 0.97, duration: 1.2 }, '-=1.2')
    })
  })

  return (
    <section
      ref={root}
      /* pt clears the fixed 64px bar — without it the picture slides under the
         nav and the wordmark sits on top of the art. */
      className="relative mx-auto grid w-full max-w-shell items-center gap-8 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:grid-cols-[1fr_0.9fr] lg:gap-4"
    >
      <div className="px-2 py-8 sm:px-6 sm:py-14 lg:py-20">
        <p className="eyebrow mb-4" data-hero-line>
          {hero.eyebrow}
        </p>

        {/* Black, then the accent — the emphasis carries the promise. */}
        <h1 className="display-xl mb-5 max-w-xl text-graphite">
          <span className="block" data-hero-line>
            {hero.headlineLine1}
          </span>
          <span className="block text-brand" data-hero-line>
            {hero.headlineLine2}
          </span>
        </h1>

        <p className="lede mb-8 max-w-md" data-hero-sub>
          {hero.lede}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3" data-hero-cta>
          <motion.a href="#items" className="btn-pill gap-2" {...pressable}>
            {hero.primaryCta}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
          </motion.a>
          <a href="#how" className="btn-ghost">
            {hero.secondaryCta} <Icon name="chevronRight" className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* The picture. Until a real one is set this is a warm field rather than
          a grey box — an empty placeholder in the first screen is worse than
          no picture at all. */}
      <div
        data-hero-art
        className="relative aspect-[4/3] overflow-hidden rounded-panel bg-brand-soft lg:aspect-auto lg:h-[520px]"
      >
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 60% 35%, rgba(242,111,33,0.22) 0%, transparent 62%)',
              }}
            />
            <Icon
              name="hamster"
              className="relative h-40 w-40 text-brand/30 sm:h-56 sm:w-56"
              strokeWidth={1}
            />
          </div>
        )}
      </div>
    </section>
  )
}
