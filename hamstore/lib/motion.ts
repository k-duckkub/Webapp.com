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

/**
 * A spring with real mass and enough damping that it settles without a visible
 * wobble — the press reads as pressing something soft rather than clicking a
 * rectangle. This is the one place a spring is allowed: touch should feel
 * physical, everything else stays on the eased curves above.
 */
export const SPRING_SOFT = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
} as const

/** Framer transition presets so components don't hand-roll timings. */
export const T = {
  hover: { duration: DURATION.fast, ease: EASE_OUT },
  enter: { duration: DURATION.base, ease: EASE_OUT },
  slow: { duration: DURATION.slow, ease: EASE_OUT },
  press: SPRING_SOFT,
} as const

/**
 * Spread onto any pressable element so touch feedback is identical site-wide.
 * The spring rides inside each gesture rather than on a top-level `transition`,
 * so spreading these never clobbers a component's own enter transition.
 */
export const pressable = {
  whileHover: { scale: 1.03, transition: SPRING_SOFT },
  whileTap: { scale: 0.94, transition: SPRING_SOFT },
} as const

/** For large surfaces (cards), where a 6% squeeze would be too much. */
export const pressableCard = {
  whileHover: { y: -6, transition: SPRING_SOFT },
  whileTap: { scale: 0.985, transition: SPRING_SOFT },
} as const

/**
 * Filtering a grid.
 *
 * Two failure modes sit either side of this. Animating each card to a new
 * grid slot makes them slide over each other and takes a second to settle;
 * cutting straight to the new set reads as a flicker, not a change. So the
 * cards never travel between slots — each one fades up in the place it will
 * end in — and a small stagger gives the set a direction to arrive from.
 *
 * Keep the stagger short: at 0.03s even an eighteen-card grid is fully in
 * under a second, and the last card is never left behind on its own.
 */
export const GRID_REVEAL = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
} as const

export const GRID_ITEM = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
} as const

/** Framer variants for the same reveal, for non-GSAP components. */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: T.enter },
}
