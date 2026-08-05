'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AssetCard } from './AssetCard'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { LIBRARY_CATEGORIES, OWNED_ASSETS } from '@/lib/library'

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
  }, [category, query, pipelines, licenses, onlyUpdates, onlyNotDownloaded, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  /* Clamp rather than store a page that no longer exists after filtering. */
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const activeFilterCount =
    pipelines.length + licenses.length + (onlyUpdates ? 1 : 0) + (onlyNotDownloaded ? 1 : 0)

  useGsapContext(root, ({ mm }) => {
    mm.add(MOTION_OK, () => {
      gsap.from('[data-lib-toolbar]', {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 88%' },
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
    <section ref={root} className="bg-ink-900">
      {/* Category pills */}
      <div className="border-b border-ink-700 bg-ink-850">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
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
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  active ? 'text-white' : 'text-muted-bright hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="lib-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span aria-hidden>{c.icon}</span>
                  {c.label}
                  <span className={active ? 'text-white/70' : 'text-muted-dim'}>{count}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="overflow-hidden rounded-lg border border-ink-600 bg-ink-750">
            <div className="flex items-center justify-between border-b border-ink-600 px-4 py-3">
              <p className="text-sm font-black text-white">ตัวกรอง</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  ล้าง ({activeFilterCount})
                </button>
              )}
            </div>

            <FilterGroup title="สถานะ">
              <CheckRow
                label="มีอัปเดตใหม่"
                checked={onlyUpdates}
                onChange={() => {
                  setOnlyUpdates(v => !v)
                  setPage(1)
                }}
              />
              <CheckRow
                label="ยังไม่ได้ดาวน์โหลด"
                checked={onlyNotDownloaded}
                onChange={() => {
                  setOnlyNotDownloaded(v => !v)
                  setPage(1)
                }}
              />
            </FilterGroup>

            <FilterGroup title="Render Pipeline">
              {PIPELINES.map(p => (
                <CheckRow
                  key={p}
                  label={p}
                  checked={pipelines.includes(p)}
                  onChange={() => toggle(pipelines, setPipelines)(p)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="License" last>
              {LICENSES.map(l => (
                <CheckRow
                  key={l}
                  label={l}
                  checked={licenses.includes(l)}
                  onChange={() => toggle(licenses, setLicenses)(l)}
                />
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div data-lib-toolbar className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <label className="relative flex-1 sm:max-w-xs">
              <span className="sr-only">ค้นหาใน asset ที่ซื้อไว้</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-dim">
                🔍
              </span>
              <input
                value={query}
                onChange={e => update(setQuery)(e.target.value)}
                placeholder="ค้นหาชื่อ asset หรือผู้พัฒนา…"
                className="w-full rounded border border-ink-600 bg-ink-800 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-muted-dim focus:border-brand"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-dim">เรียงโดย:</span>
              <select
                value={sort}
                onChange={e => update(setSort)(e.target.value as Sort)}
                className="rounded border border-ink-600 bg-ink-800 px-3 py-1.5 text-xs text-white outline-none focus:border-brand"
              >
                {SORTS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted">
            พบ <strong className="text-white">{filtered.length}</strong> จากทั้งหมด{' '}
            {OWNED_ASSETS.length} ชิ้น
          </p>

          {paginated.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink-600 bg-ink-750 py-16 text-center">
              <p className="mb-1 text-3xl">🔍</p>
              <p className="text-sm font-bold text-muted-bright">ไม่เจอ asset ที่ตรงกับตัวกรอง</p>
              <button onClick={clearFilters} className="mt-3 text-xs font-bold text-brand hover:underline">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {paginated.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <PageBtn disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                ← ก่อนหน้า
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === safePage ? 'page' : undefined}
                  className={`h-8 w-8 rounded border text-xs font-bold transition-colors ${
                    n === safePage
                      ? 'border-brand bg-brand text-white'
                      : 'border-ink-600 bg-ink-750 text-muted-bright hover:border-ink-500'
                  }`}
                >
                  {n}
                </button>
              ))}
              <PageBtn
                disabled={safePage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                ถัดไป →
              </PageBtn>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FilterGroup({
  title,
  children,
  last,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={`px-4 py-3 ${last ? '' : 'border-b border-ink-700'}`}>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-dim">{title}</p>
      {children}
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded accent-brand"
      />
      <span className="text-xs text-muted-bright">{label}</span>
    </label>
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
      className="rounded border border-ink-600 bg-ink-750 px-3 py-2 text-xs text-muted-bright transition-colors enabled:hover:border-ink-500 disabled:cursor-not-allowed disabled:text-ink-500"
    >
      {children}
    </button>
  )
}
