'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { STORE_ASSETS, type StoreAsset } from '@/lib/library'

/**
 * Download state for packages you own.
 *
 * Ownership itself is not here — that moved to the wallet when both pages
 * became storefronts sharing one cart. What this keeps is what happens after
 * you own something: whether the file is on this machine, whether an update
 * is outstanding, and how far along a transfer is.
 *
 * The bytes are simulated; there is no CDN behind this and no honest way to
 * pretend otherwise. Everything around them is real — one transfer at a time
 * per package, cancelling leaves the old version in place, and this is the
 * single source the badge, the filter counts and the button label all read.
 */

type Progress = { pct: number; label: string }

/** Per-asset file state, keyed by asset id. */
type FileState = { downloaded: boolean; hasUpdate: boolean }

type Library = {
  fileState: (asset: StoreAsset) => FileState
  progress: Record<number, Progress | undefined>
  download: (asset: StoreAsset) => void
  cancel: (id: number) => void
}

const LibraryContext = createContext<Library | null>(null)

/** Bigger packages take longer. 40 MB/s, floored so nothing finishes instantly. */
function durationFor(sizeMb: number) {
  return Math.min(9000, Math.max(1400, (sizeMb / 40) * 1000))
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<number, FileState>>({})
  const [progress, setProgress] = useState<Record<number, Progress | undefined>>({})
  const [timers] = useState(() => new Map<number, number>())

  const fileState = useCallback(
    (asset: StoreAsset): FileState =>
      overrides[asset.id] ?? { downloaded: asset.downloaded, hasUpdate: asset.hasUpdate },
    [overrides],
  )

  const cancel = useCallback(
    (id: number) => {
      const timer = timers.get(id)
      if (timer !== undefined) window.clearInterval(timer)
      timers.delete(id)
      setProgress(p => ({ ...p, [id]: undefined }))
    },
    [timers],
  )

  const download = useCallback(
    (asset: StoreAsset) => {
      if (timers.has(asset.id)) return cancel(asset.id)

      const current = overrides[asset.id] ?? { downloaded: asset.downloaded, hasUpdate: asset.hasUpdate }
      const total = durationFor(asset.size)
      const started = Date.now()

      const timer = window.setInterval(() => {
        const pct = Math.min(100, ((Date.now() - started) / total) * 100)
        setProgress(p => ({
          ...p,
          [asset.id]: {
            pct,
            label: `${((asset.size * pct) / 100).toFixed(1)} / ${asset.size.toFixed(1)} MB`,
          },
        }))

        if (pct >= 100) {
          window.clearInterval(timer)
          timers.delete(asset.id)
          setProgress(p => ({ ...p, [asset.id]: undefined }))
          /* Landing the file is what clears the badge — not pressing the button. */
          setOverrides(prev => ({ ...prev, [asset.id]: { downloaded: true, hasUpdate: false } }))
        }
      }, 90)

      timers.set(asset.id, timer)
    },
    [timers, cancel, overrides],
  )

  const value = useMemo(
    () => ({ fileState, progress, download, cancel }),
    [fileState, progress, download, cancel],
  )
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>')
  return ctx
}

export { STORE_ASSETS }
