'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK, MOTION_REDUCED } from '@/lib/gsap'
import { PATHWAY_STOPS } from '@/lib/items'

/**
 * The winding trail drawn down the middle of the section. Coordinates live in a
 * fixed 400x1400 space so the absolutely-positioned stop cards can be lined up
 * against known points on the curve (see STOP_LAYOUT). It starts at y=300 to
 * clear the section heading above it.
 */
const PATH_D =
  'M 200 300 C 200 400, 340 440, 340 540 C 340 660, 60 680, 60 800 C 60 920, 340 950, 340 1080 C 340 1190, 200 1250, 200 1360'

/**
 * Where the curve passes each stop, and the scrub progress at that point. Each
 * stop sits at the end of one cubic segment, so the progress values land on
 * clean quarters. `top` centres the ~140px-tall card on its dot.
 */
const STOP_LAYOUT = [
  { cx: 340, cy: 540,  progress: 0.25, side: 'right' as const, top: 470 },
  { cx: 60,  cy: 800,  progress: 0.5,  side: 'left'  as const, top: 730 },
  { cx: 340, cy: 1080, progress: 0.75, side: 'right' as const, top: 1010 },
]

export function Pathway() {
  const root = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      const path = pathRef.current
      if (!path) return

      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

      /* One scrubbed timeline drives the draw, the marker and the dots together,
         so they can never drift out of sync with each other. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)

      tl.to(
        '[data-marker]',
        {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false },
          ease: 'none',
          duration: 1,
        },
        0,
      )

      /* Each dot pops the moment the trail reaches it. */
      STOP_LAYOUT.forEach((stop, i) => {
        tl.fromTo(
          `[data-dot="${i}"]`,
          { scale: 0, transformOrigin: 'center' },
          { scale: 1, duration: 0.06, ease: 'back.out(3)' },
          stop.progress,
        )
      })

      /* Cards reveal independently of the scrub so they read at normal speed. */
      gsap.utils.toArray<HTMLElement>('[data-stop-card]').forEach(card => {
        gsap.from(card, {
          y: 44,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        })
      })
    })

    /* Reduced motion: no scrub, no marker — just show the finished trail. */
    mm.add(MOTION_REDUCED, () => {
      const path = pathRef.current
      if (path) gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 })
      gsap.set('[data-dot]', { scale: 1, transformOrigin: 'center' })
      gsap.set('[data-marker]', { opacity: 0 })
    })
  })

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-ink-900 px-6 py-20 md:h-[1400px] md:py-0"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center md:pt-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          HamCoin ใช้ยังไง
        </p>
        <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
          เส้นทางของแฮมสเตอร์
        </h2>
      </div>

      {/* The trail — desktop only; on mobile the cards simply stack. */}
      <svg
        viewBox="0 0 400 1400"
        className="pointer-events-none absolute left-1/2 top-0 hidden h-[1400px] w-[400px] -translate-x-1/2 md:block"
        aria-hidden
      >
        {/* faint full-length guide so the path reads as a route, not a stray line */}
        <path d={PATH_D} fill="none" stroke="#2a2520" strokeWidth={3} strokeLinecap="round" />
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="#F97316"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {STOP_LAYOUT.map((stop, i) => (
          <g key={i} data-dot={i}>
            <circle cx={stop.cx} cy={stop.cy} r={16} fill="#0f0e0d" stroke={PATHWAY_STOPS[i].color} strokeWidth={3} />
            <text x={stop.cx} y={stop.cy} textAnchor="middle" dominantBaseline="central" fontSize={16}>
              {PATHWAY_STOPS[i].icon}
            </text>
          </g>
        ))}

        <g data-marker>
          <circle r={18} fill="#F97316" />
          <text textAnchor="middle" dominantBaseline="central" fontSize={20}>
            🐹
          </text>
        </g>
      </svg>

      {/* Stops */}
      <div className="mx-auto flex max-w-md flex-col gap-10 md:block md:max-w-none">
        {PATHWAY_STOPS.map((stop, i) => {
          const layout = STOP_LAYOUT[i]
          return (
            <div
              key={stop.id}
              data-stop-card
              style={{ ['--stop-top' as string]: `${layout.top}px` }}
              className={[
                'rounded-lg border border-ink-600 bg-ink-750 p-6 md:absolute md:top-[var(--stop-top)] md:w-[320px]',
                layout.side === 'right'
                  ? 'md:left-[calc(50%+150px)]'
                  : 'md:right-[calc(50%+150px)]',
              ].join(' ')}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                  style={{ backgroundColor: `${stop.color}22`, border: `1px solid ${stop.color}55` }}
                >
                  {stop.icon}
                </span>
                <span className="text-xs font-black tracking-widest" style={{ color: stop.color }}>
                  {stop.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-black text-white">{stop.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{stop.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
