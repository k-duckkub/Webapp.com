'use client'

import { useRef } from 'react'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START } from '@/lib/motion'
import { PATHWAY_STOPS } from '@/lib/items'
import { COPY } from '@/lib/content'
import { Icon } from '@/components/Icon'

/**
 * How a lesson becomes a parcel.
 *
 * This used to be a full-screen black section that pinned the scroll and
 * cross-faded three steps over a giant coin. It was the loudest thing on the
 * page and it belonged to a different site — HamsterHub states a sequence as a
 * quiet row of connected marks, and a shop has no business seizing the scroll
 * to explain itself.
 *
 * The rail behind the marks is the whole idea: it is what says these are three
 * points on one path rather than three unrelated features.
 */
export function PinnedStory() {
  const root = useRef<HTMLElement>(null)
  const how = COPY.store.how

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-story-el]', {
        ...REVEAL,
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: REVEAL_START },
      })
    })
  })

  return (
    <section ref={root} id="how" className="panel scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-12">
        <div data-story-el>
          <h2 className="display-md mb-3 text-graphite">
            {how.heading}
            <span className="block text-brand">{how.headingAccent}</span>
          </h2>
          <p className="text-[15px] leading-relaxed text-slate">{how.sub}</p>
        </div>

        <div className="relative">
          {/* The rail, drawn behind the marks and stopping at the first and
              last so it never runs off into nothing. */}
          <div
            aria-hidden
            className="absolute left-[16.6%] right-[16.6%] top-9 hidden h-px bg-hairline sm:block"
          />

          <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-4">
            {PATHWAY_STOPS.map((stop, i) => (
              <li key={stop.id} className="flex gap-4 sm:block sm:text-center" data-story-el>
                <div
                  className={`icon-chip h-[72px] w-[72px] shrink-0 sm:mx-auto ${
                    i === 0 ? 'ring-2 ring-brand ring-offset-4 ring-offset-paper' : ''
                  }`}
                >
                  <Icon name={stop.icon} className="h-7 w-7" strokeWidth={1.6} />
                </div>

                <div className="min-w-0 sm:mt-5">
                  <p className="mb-1 text-[11px] font-semibold tracking-label text-slate-soft">
                    {stop.step}
                  </p>
                  <h3 className="mb-2 text-[16px] font-bold tracking-tight text-graphite">
                    {stop.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-slate">{stop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
