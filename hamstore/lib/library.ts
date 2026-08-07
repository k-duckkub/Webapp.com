import type { IconName } from '@/components/Icon'
import type { Motif } from '@/components/Artwork'
import { CONTENT } from '@/lib/content'

/**
 * Page 2 data — Unity assets the hamster has ALREADY BOUGHT.
 * This is a personal library, not a storefront: no prices, no cart.
 *
 * The list lives in `content/site.json` and is edited in the studio; the
 * category motifs and colours below stay in code because they are drawing
 * decisions, not content.
 */

export interface OwnedAsset {
  id: number
  title: string
  publisher: string
  category: string
  /** Unity render pipelines the package supports */
  pipelines: string[]
  version: string
  /** megabytes */
  size: number
  /** ISO date the asset was purchased */
  purchasedAt: string
  /** ISO date the publisher last shipped an update */
  updatedAt: string
  license: 'Single Entity' | 'Multi Entity'
  /** true when updatedAt is newer than the version the hamster downloaded */
  hasUpdate: boolean
  downloaded: boolean
  rating: number
  /** paid in HamCoin at purchase time — kept for the receipt, not for sale */
  paidCoins: number
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

export const OWNED_ASSETS: OwnedAsset[] = CONTENT.assets as OwnedAsset[]

export function formatSize(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`
}

export function formatThaiDate(iso: string) {
  const d = new Date(iso)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
}
