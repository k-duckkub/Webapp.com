'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useLayoutEffect, useRef, type RefObject } from 'react'

/* Registering twice is harmless, but guard so HMR doesn't spam the console. */
let registered = false
export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
  registered = true
}

/**
 * Runs `setup` inside a gsap.context scoped to `scope`, on the client, before
 * paint. The context is reverted on unmount, which kills every tween and
 * ScrollTrigger the callback created — important in an SPA where routes swap.
 *
 * `setup` receives a matchMedia instance so callers can register
 * reduced-motion-aware variants.
 */
export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { mm: gsap.MatchMedia }) => void,
  deps: unknown[] = [],
) {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useLayoutEffect(() => {
    registerGsap()
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => setupRef.current({ mm }), scope.current ?? undefined)

    return () => {
      mm.revert()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)'

export { gsap, ScrollTrigger, MotionPathPlugin }
