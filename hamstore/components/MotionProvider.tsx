'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Honour the system's motion setting across Framer, the way GSAP already did.
 *
 * Every reveal, drift and parallax ran through `gsap.matchMedia`, but the
 * Framer half — the floating hero tiles, the panel springs, the hover lifts —
 * ignored the preference entirely. Someone who turns motion down because it
 * makes them ill was still getting four tiles bobbing on the hero.
 *
 * `reducedMotion="user"` keeps opacity crossfades and drops transforms, which
 * is the right reading of the setting: it asks for less movement, not for a
 * page that changes without explanation.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
