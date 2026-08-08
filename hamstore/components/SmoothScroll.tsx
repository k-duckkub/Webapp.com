'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'

/**
 * Momentum scrolling, wired into GSAP.
 *
 * Lenis takes over the scroll position, so ScrollTrigger has to be told to read
 * from Lenis and to advance on GSAP's ticker instead of its own RAF loop —
 * otherwise pinned sections judder by a frame against the smoothed position.
 *
 * Disabled outright when the visitor asks for reduced motion: hijacking scroll
 * is exactly the kind of thing that setting exists to stop.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    registerGsap()

    const lenis = new Lenis({
      duration: 1.1,
      /* Long deceleration tail — this is the curve the "Apple feel" lives in. */
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      /* Touch devices already have native momentum; smoothing it again feels laggy. */
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return null
}
