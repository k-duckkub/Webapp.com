import type { IconName } from '@/components/Icon'
import type { Motif } from '@/components/Artwork'
import { CONTENT } from '@/lib/content'

/**
 * Page 2 data — Unity asset packages, for sale.
 *
 * This started as a library of things already bought, which left the page
 * unable to explain where any of it came from: a download button on something
 * the visitor never chose. Both pages sell now, one cart collects from both,
 * and the download and receipt only appear once a package is actually owned.
 *
 * The list lives in `content/site.json` and is edited in the studio; the
 * category motifs and colours below stay in code because they are drawing
 * decisions, not content.
 */

export interface StoreAsset {
  id: number
  title: string
  publisher: string
  category: string
  /** Unity render pipelines the package supports */
  pipelines: string[]
  version: string
  /** megabytes */
  size: number
  /** ISO date the publisher last shipped an update */
  updatedAt: string
  license: 'Single Entity' | 'Multi Entity'
  /** Price in HamCoin. */
  coins: number
  /** 0 = no discount */
  sale: number
  owned: boolean
  /** ISO date this was redeemed. Only set once owned. */
  purchasedAt?: string
  /** Only meaningful for something already owned. */
  hasUpdate: boolean
  downloaded: boolean
  rating: number
  color: string
  /** Path to real cover art; overrides the generated cover when present. */
  image?: string
}

export const LIBRARY_CATEGORIES: { id: string; label: string; icon: IconName }[] =
  CONTENT.assetCategories.map(c => ({ id: c.id, label: c.label, icon: c.icon as IconName }))

/** Which composition a category's covers are drawn from. */
export const CATEGORY_MOTIF: Record<string, Motif> = Object.fromEntries(
  CONTENT.assetCategories.map(c => [c.id, c.motif as Motif]),
)

export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  CONTENT.assetCategories.map(c => [c.id, c.color]),
)

export const STORE_ASSETS: StoreAsset[] = CONTENT.assets as StoreAsset[]

export function formatSize(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`
}

export function formatThaiDate(iso: string) {
  const d = new Date(iso)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
}
