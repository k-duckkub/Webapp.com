'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AssetCard } from './AssetCard'
import { gsap, useGsapContext, MOTION_OK } from '@/lib/gsap'
import { REVEAL, REVEAL_START, T } from '@/lib/motion'
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
                  <span aria-hidden>{c.icon}</span>
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
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="overflow-hidden rounded-card bg-paper">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <p className="text-[15px] font-semibold text-graphite">ตัวกรอง</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[13px] font-medium text-brand transition-opacity hover:opacity-70"
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
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-soft">
                🔍
              </span>
              <input
                value={query}
                onChange={e => update(setQuery)(e.target.value)}
                placeholder="ค้นหาชื่อ asset หรือผู้พัฒนา…"
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

          <p className="mb-8 text-[13px] text-slate">
            พบ <strong className="font-medium text-graphite">{filtered.length}</strong> จากทั้งหมด{' '}
            {OWNED_ASSETS.length} ชิ้น
          </p>

          {paginated.length === 0 ? (
            <div className="rounded-card bg-paper py-20 text-center">
              <p className="mb-1 text-3xl">🔍</p>
              <p className="text-[15px] font-medium text-graphite">ไม่เจอ asset ที่ตรงกับตัวกรอง</p>
              <button onClick={clearFilters} className="btn-ghost mt-4">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
    <div className={`px-5 py-4 ${last ? '' : 'border-b border-hairline/70'}`}>
      <p className="mb-3 text-[12px] font-semibold tracking-label text-slate-soft">{title}</p>
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
      <span className="text-[13px] text-graphite">{label}</span>
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
      className="rounded-full bg-paper px-4 py-2 text-[13px] text-slate transition-colors enabled:hover:text-graphite disabled:cursor-not-allowed disabled:text-slate-soft/50"
    >
      {children}
    </button>
  )
}
