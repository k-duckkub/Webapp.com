'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AssetCard } from './AssetCard'
import { ReceiptSheet } from './ReceiptSheet'
import { useLibrary } from './LibraryProvider'
import { FilterPanel, type FilterGroup } from './FilterPanel'
import { Icon } from '@/components/Icon'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { GRID_REVEAL, REVEAL, REVEAL_START, T } from '@/lib/motion'
import { LIBRARY_CATEGORIES, type OwnedAsset } from '@/lib/library'
import { COPY } from '@/lib/content'

type Sort = 'recent' | 'oldest' | 'name' | 'size' | 'updated'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'recent',  label: 'ซื้อล่าสุด' },
  { id: 'oldest',  label: 'ซื้อนานสุด' },
  { id: 'updated', label: 'อัปเดตล่าสุด' },
  { id: 'name',    label: 'ชื่อ A–Z' },
  { id: 'size',    label: 'ขนาดไฟล์' },
]

const PIPELINES = ['Built-in', 'URP', 'HDRP']
const LICENSES = ['Single Entity', 'Multi Entity']
const PER_PAGE = 8

export function LibraryBrowser() {
  const root = useRef<HTMLElement>(null)
  const { assets: OWNED_ASSETS } = useLibrary()
  const [receipt, setReceipt] = useState<OwnedAsset | null>(null)

  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<Sort>('recent')
  const [query, setQuery] = useState('')
  const [pipelines, setPipelines] = useState<string[]>([])
  const [licenses, setLicenses] = useState<string[]>([])
  const [onlyUpdates, setOnlyUpdates] = useState(false)
  const [onlyNotDownloaded, setOnlyNotDownloaded] = useState(false)
  const [page, setPage] = useState(1)

  /* Any filter change invalidates the current page. */
  function update<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(1)
    }
  }

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) => {
    set(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    const result = OWNED_ASSETS.filter(a => {
      if (category !== 'ALL' && a.category !== category) return false
      if (q && !a.title.toLowerCase().includes(q) && !a.publisher.toLowerCase().includes(q)) return false
      if (pipelines.length && !pipelines.some(p => a.pipelines.includes(p))) return false
      if (licenses.length && !licenses.includes(a.license)) return false
      if (onlyUpdates && !a.hasUpdate) return false
      if (onlyNotDownloaded && a.downloaded) return false
      return true
    })

    return result.sort((a, b) => {
      switch (sort) {
        case 'oldest':  return a.purchasedAt.localeCompare(b.purchasedAt)
        case 'updated': return b.updatedAt.localeCompare(a.updatedAt)
        case 'name':    return a.title.localeCompare(b.title)
        case 'size':    return b.size - a.size
        default:        return b.purchasedAt.localeCompare(a.purchasedAt)
      }
    })
  }, [OWNED_ASSETS, category, query, pipelines, licenses, onlyUpdates, onlyNotDownloaded, sort])

  /* Counts are taken against category + search only, so a pipeline count still
     means something while other pipelines are ticked. */
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase()
    return OWNED_ASSETS.filter(a => {
      if (category !== 'ALL' && a.category !== category) return false
      if (q && !a.title.toLowerCase().includes(q) && !a.publisher.toLowerCase().includes(q)) return false
      return true
    })
  }, [OWNED_ASSETS, category, query])

  const filterGroups: FilterGroup[] = [
    {
      title: 'สถานะ',
      options: [
        {
          id: 'updates',
          label: 'มีอัปเดตใหม่',
          count: scoped.filter(a => a.hasUpdate).length,
          checked: onlyUpdates,
          onToggle: () => { setOnlyUpdates(v => !v); setPage(1) },
        },
        {
          id: 'not-downloaded',
          label: 'ยังไม่ได้ดาวน์โหลด',
          count: scoped.filter(a => !a.downloaded).length,
          checked: onlyNotDownloaded,
          onToggle: () => { setOnlyNotDownloaded(v => !v); setPage(1) },
        },
      ],
    },
    {
      title: 'Render Pipeline',
      options: PIPELINES.map(pipe => ({
        id: pipe,
        label: pipe,
        count: scoped.filter(a => a.pipelines.includes(pipe)).length,
        checked: pipelines.includes(pipe),
        onToggle: () => toggle(pipelines, setPipelines)(pipe),
      })),
    },
    {
      title: 'License',
      options: LICENSES.map(lic => ({
        id: lic,
        label: lic,
        count: scoped.filter(a => a.license === lic).length,
        checked: licenses.includes(lic),
        onToggle: () => toggle(licenses, setLicenses)(lic),
      })),
    },
  ]

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  /* Clamp rather than store a page that no longer exists after filtering. */
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const activeFilterCount =
    pipelines.length + licenses.length + (onlyUpdates ? 1 : 0) + (onlyNotDownloaded ? 1 : 0)

  const gridKey = [
    category,
    sort,
    safePage,
    pipelines.join(','),
    licenses.join(','),
    onlyUpdates,
    onlyNotDownloaded,
  ].join('|')

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-lib-toolbar]', {
        ...REVEAL,
        scrollTrigger: { trigger: root.current, start: REVEAL_START },
      })
    })
  })

  function clearFilters() {
    setPipelines([])
    setLicenses([])
    setOnlyUpdates(false)
    setOnlyNotDownloaded(false)
    setPage(1)
  }

  return (
    <section ref={root} className="bg-mist pb-24 pt-16 sm:pb-32">
      {/* Category pills */}
      <div className="border-b border-hairline">
        <div className="no-scrollbar shell flex gap-1 overflow-x-auto pb-4">
          {LIBRARY_CATEGORIES.map(c => {
            const active = category === c.id
            const count =
              c.id === 'ALL'
                ? OWNED_ASSETS.length
                : OWNED_ASSETS.filter(a => a.category === c.id).length

            return (
              <button
                key={c.id}
                onClick={() => update(setCategory)(c.id)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  active ? 'text-paper' : 'text-slate hover:text-graphite'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="lib-pill"
                    className="absolute inset-0 rounded-full bg-graphite"
                    transition={T.hover}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon name={c.icon} className="h-3.5 w-3.5" />
                  {c.label}
                  <span className={active ? 'text-paper/60' : 'text-slate-soft'}>{count}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="shell flex gap-10 pt-10">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <FilterPanel groups={filterGroups} activeCount={activeFilterCount} onClear={clearFilters} />
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div data-lib-toolbar className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <label className="relative flex-1 sm:max-w-xs">
              <span className="sr-only">ค้นหาใน asset ที่ซื้อไว้</span>
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft"
              />
              <input
                value={query}
                onChange={e => update(setQuery)(e.target.value)}
                placeholder={COPY.library.searchPlaceholder}
                className="w-full rounded-full bg-paper py-2.5 pl-10 pr-4 text-[15px] text-graphite outline-none transition-shadow placeholder:text-slate-soft focus:ring-2 focus:ring-brand/40"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[13px] text-slate">เรียงโดย:</span>
              <select
                value={sort}
                onChange={e => update(setSort)(e.target.value as Sort)}
                className="rounded-full bg-paper px-4 py-2 text-[13px] text-graphite outline-none focus:ring-2 focus:ring-brand/40"
              >
                {SORTS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* The hero says these are already bought, but by the time you have
              scrolled to a download button that context is off-screen — which
              is exactly where "ทำไมโหลดได้ ยังไม่ได้ซื้อเลย" comes from. The
              answer sits next to the buttons it explains. */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-[13px] text-slate">
              พบ <strong className="font-medium text-graphite">{filtered.length}</strong> จากทั้งหมด{' '}
              {OWNED_ASSETS.length} ชิ้น
            </p>
            <p className="flex items-center gap-1.5 text-[13px] text-slate">
              <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.4} />
              {COPY.library.ownedNote}
            </p>
          </div>

          {paginated.length === 0 ? (
            <div className="rounded-card bg-paper py-20 text-center">
              <Icon name="search" className="mx-auto mb-3 h-7 w-7 text-slate-soft" />
              <p className="text-[15px] font-medium text-graphite">{COPY.library.emptyTitle}</p>
              <button onClick={clearFilters} className="btn-ghost mt-4">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            /* Keyed on the filter set, so a change fades the whole grid in one
               short move. Per-card layout animation was doing the opposite:
               eight cards each taking 0.9s to travel to a new slot, sliding
               over each other on the way. Typing in the search box is left out
               of the key on purpose — results should update as you type, not
               blink once per keystroke. */
            <motion.div
              key={gridKey}
              variants={GRID_REVEAL}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
            >
              {paginated.map(asset => (
                <AssetCard key={asset.id} asset={asset} onReceipt={setReceipt} />
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <PageBtn disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <Icon name="chevronRight" className="h-3.5 w-3.5 rotate-180" strokeWidth={2} />
                ก่อนหน้า
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === safePage ? 'page' : undefined}
                  className={`h-9 w-9 rounded-full text-[13px] font-medium transition-colors ${
                    n === safePage
                      ? 'bg-graphite text-paper'
                      : 'bg-paper text-slate hover:text-graphite'
                  }`}
                >
                  {n}
                </button>
              ))}
              <PageBtn
                disabled={safePage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                ถัดไป
                <Icon name="chevronRight" className="h-3.5 w-3.5" strokeWidth={2} />
              </PageBtn>
            </div>
          )}
        </div>
      </div>

      <ReceiptSheet asset={receipt} onClose={() => setReceipt(null)} />
    </section>
  )
}



function PageBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-[13px] text-slate transition-colors enabled:hover:text-graphite disabled:cursor-not-allowed disabled:text-slate-soft/50"
    >
      {children}
    </button>
  )
}
