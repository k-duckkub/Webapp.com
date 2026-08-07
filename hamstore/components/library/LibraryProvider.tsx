'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { OWNED_ASSETS, type OwnedAsset } from '@/lib/library'

/**
 * What the library's buttons actually do.
 *
 * Before this, the download and update buttons on every card had no click
 * handler at all — they looked pressable and did nothing, which is worse than
 * not having them. Now they run a real transfer with real state: progress per
 * asset, a downloaded flag that survives filtering and paging, and an update
 * that clears the badge when it lands.
 *
 * The bytes are simulated — there is no CDN behind this and there is no
 * honest way to pretend otherwise. What is real is everything around them:
 * you can only download one copy at a time per asset, cancelling leaves the
 * old version in place, and the card's state is the single source the badge,
 * the filter counts and the button label all read from.
 */

type Progress = { pct: number; label: string }

type Library = {
  assets: OwnedAsset[]
  progress: Record<number, Progress | undefined>
  download: (asset: OwnedAsset) => void
  cancel: (id: number) => void
}

const LibraryContext = createContext<Library | null>(null)

/** Bigger packages take longer. 40 MB/s, floored so nothing finishes instantly. */
function durationFor(sizeMb: number) {
  return Math.min(9000, Math.max(1400, (sizeMb / 40) * 1000))
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<OwnedAsset[]>(OWNED_ASSETS)
  const [progress, setProgress] = useState<Record<number, Progress | undefined>>({})
  const [timers] = useState(() => new Map<number, number>())

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
    (asset: OwnedAsset) => {
      if (timers.has(asset.id)) return cancel(asset.id)

      const updating = asset.hasUpdate
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
          setAssets(list =>
            list.map(a =>
              a.id === asset.id
                ? { ...a, downloaded: true, hasUpdate: updating ? false : a.hasUpdate }
                : a,
            ),
          )
        }
      }, 90)

      timers.set(asset.id, timer)
    },
    [timers, cancel],
  )

  const value = useMemo(() => ({ assets, progress, download, cancel }), [assets, progress, download, cancel])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>')
  return ctx
}
