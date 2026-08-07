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

export const LIBRARY_CATEGORIES: { id: string; label: string; icon: IconName }[] = [
  { id: 'ALL',          label: 'ทั้งหมด',      icon: 'all' },
  { id: 'CHARACTER',    label: 'Characters',   icon: 'character' },
  { id: 'ENVIRONMENTS', label: 'Environments', icon: 'environment' },
  { id: 'GUI',          label: 'GUI',          icon: 'gui' },
  { id: 'VFX',          label: 'VFX',          icon: 'vfx' },
  { id: 'AUDIO',        label: 'Audio',        icon: 'audio' },
  { id: 'TOOLS',        label: 'Tools',        icon: 'tools' },
  { id: 'TEMPLATE',     label: 'Templates',    icon: 'template' },
]

/** Which composition a category's covers are drawn from. */
export const CATEGORY_MOTIF: Record<string, Motif> = {
  GUI: 'blocks',
  VFX: 'burst',
  TOOLS: 'blocks',
  CHARACTER: 'figure',
  TEMPLATE: 'blocks',
  ENVIRONMENTS: 'terrain',
  AUDIO: 'waveform',
}

export const CATEGORY_COLORS: Record<string, string> = {
  GUI: '#7C3AED',
  VFX: '#0891B2',
  TOOLS: '#059669',
  CHARACTER: '#DC2626',
  TEMPLATE: '#D97706',
  ENVIRONMENTS: '#2563EB',
  AUDIO: '#DB2777',
}

export const STORE_ASSETS: StoreAsset[] = CONTENT.assets as StoreAsset[]

export function formatSize(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`
}

export function formatThaiDate(iso: string) {
  const d = new Date(iso)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
}
