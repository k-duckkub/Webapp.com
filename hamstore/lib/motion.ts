/**
 * One motion vocabulary for the whole site.
 *
 * The house style here is Apple's: nothing overshoots, nothing snaps. Motion
 * starts quickly and spends most of its duration decelerating, which is what
 * makes it read as "smooth" rather than "fast". Concretely that means long
 * durations (0.8–1.2s, not 0.3s), deep ease-outs, and no springs with bounce.
 *
 * Framer Motion takes cubic-bezier arrays directly. GSAP's free build has no
 * CustomEase, so the GSAP side uses the stock eases whose curves sit closest
 * to the same shape.
 */

/** Apple's workhorse curve — quick departure, long glide into rest. */
export const EASE_OUT = [0.28, 0.11, 0.32, 1] as const

/** For things that leave the screen; symmetric, no tail. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const DURATION = {
  /** hover states, small state flips */
  fast: 0.4,
  /** the default for anything entering the viewport */
  base: 0.9,
  /** hero and headline choreography */
  slow: 1.2,
} as const

/** GSAP equivalents. `expo.out` is the closest stock match to EASE_OUT. */
export const GSAP_EASE = 'expo.out'
export const GSAP_EASE_SOFT = 'power3.out'

/** The standard "enters the viewport" reveal, used by every section. */
export const REVEAL = {
  y: 40,
  opacity: 0,
  duration: DURATION.base,
  ease: GSAP_EASE,
} as const

/** Where a reveal fires relative to the viewport. */
export const REVEAL_START = 'top 82%'

/** Framer transition presets so components don't hand-roll timings. */
export const T = {
  hover: { duration: DURATION.fast, ease: EASE_OUT },
  enter: { duration: DURATION.base, ease: EASE_OUT },
  slow: { duration: DURATION.slow, ease: EASE_OUT },
} as const

/** Framer variants for the same reveal, for non-GSAP components. */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: T.enter },
}
