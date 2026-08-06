'use client'

import { motion } from 'framer-motion'
import { SPRING_SOFT, T } from '@/lib/motion'

export type FilterOption = {
  id: string
  label: string
  /** How many assets this option would leave — a filter that shows nothing is worth knowing before you click it. */
  count: number
  checked: boolean
  onToggle: () => void
}

export type FilterGroup = {
  title: string
  options: FilterOption[]
}

export function FilterPanel({
  groups,
  activeCount,
  onClear,
}: {
  groups: FilterGroup[]
  activeCount: number
  onClear: () => void
}) {
  return (
    <div className="overflow-hidden rounded-panel bg-paper">
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-graphite">ตัวกรอง</h2>

        {/* Only offered when there is something to clear, so the header stays quiet. */}
        <motion.button
          initial={false}
          animate={{ opacity: activeCount > 0 ? 1 : 0 }}
          transition={T.hover}
          onClick={onClear}
          tabIndex={activeCount > 0 ? 0 : -1}
          aria-hidden={activeCount === 0}
          className="text-[13px] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          ล้าง {activeCount > 0 && `(${activeCount})`}
        </motion.button>
      </div>

      {/* A labelled group rather than fieldset/legend: a legend interrupts its
          fieldset's top border, which left a stray rule beside each heading. */}
      {groups.map((group, i) => {
        const headingId = `filter-group-${i}`
        return (
          <div
            key={group.title}
            role="group"
            aria-labelledby={headingId}
            className={i === 0 ? 'px-2 pb-2' : 'mt-2 border-t border-hairline/60 px-2 pb-2 pt-2'}
          >
            <h3
              id={headingId}
              className="px-3 pb-1 pt-3 text-[12px] font-semibold tracking-label text-slate-soft"
            >
              {group.title}
            </h3>

            {group.options.map(option => (
              <Row key={option.id} {...option} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function Row({ label, count, checked, onToggle }: FilterOption) {
  const empty = count === 0

  return (
    <motion.label
      whileTap={{ scale: 0.985 }}
      transition={SPRING_SOFT}
      className={`flex cursor-pointer items-center gap-3 rounded-card px-3 py-2 transition-colors ${
        empty ? 'opacity-45' : 'hover:bg-mist'
      }`}
    >
      {/* The real control stays in the DOM for keyboard and screen readers;
          the box beside it is what's actually painted. */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />

      <motion.span
        aria-hidden
        animate={checked ? { scale: [1, 0.86, 1] } : { scale: 1 }}
        transition={SPRING_SOFT}
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-2 ${
          checked ? 'border-brand bg-brand' : 'border-hairline bg-paper'
        }`}
      >
        <motion.svg
          viewBox="0 0 14 14"
          fill="none"
          className="h-[11px] w-[11px]"
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
          transition={T.hover}
        >
          <path
            d="M2 7.4 5.3 10.6 12 3.6"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.span>

      <span className="min-w-0 flex-1 truncate text-[14px] text-graphite">{label}</span>
      <span className="shrink-0 text-[13px] tabular-nums text-slate-soft">{count}</span>
    </motion.label>
  )
}
