/**
 * Page 2 data — Unity assets the hamster has ALREADY BOUGHT.
 * This is a personal library, not a storefront: no prices, no cart.
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
}

export const LIBRARY_CATEGORIES = [
  { id: 'ALL',          label: 'ทั้งหมด',       icon: '📚' },
  { id: 'CHARACTER',    label: 'Characters',    icon: '🧑' },
  { id: 'ENVIRONMENTS', label: 'Environments',  icon: '🌲' },
  { id: 'GUI',          label: 'GUI',           icon: '🖼' },
  { id: 'VFX',          label: 'VFX',           icon: '✨' },
  { id: 'AUDIO',        label: 'Audio',         icon: '🎵' },
  { id: 'TOOLS',        label: 'Tools',         icon: '🔧' },
  { id: 'TEMPLATE',     label: 'Templates',     icon: '📦' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  GUI: '#7C3AED',
  VFX: '#0891B2',
  TOOLS: '#059669',
  CHARACTER: '#DC2626',
  TEMPLATE: '#D97706',
  ENVIRONMENTS: '#2563EB',
  AUDIO: '#DB2777',
}

export const OWNED_ASSETS: OwnedAsset[] = [
  { id: 1,  title: 'GUI Pro - Minimal Game Light',     publisher: 'Michsky',        category: 'GUI',          pipelines: ['Built-in', 'URP'], version: '2.4.1',  size: 84.2,  purchasedAt: '2026-01-14', updatedAt: '2026-06-02', license: 'Single Entity', hasUpdate: true,  downloaded: true,  rating: 4.8, paidCoins: 100, color: '#7C3AED' },
  { id: 2,  title: 'HTrace: SSGI URP',                 publisher: 'Heterosis',      category: 'VFX',          pipelines: ['URP'],            version: '1.9.0',  size: 212.7, purchasedAt: '2026-02-03', updatedAt: '2026-02-03', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.6, paidCoins: 130, color: '#0891B2' },
  { id: 3,  title: 'UniPay - IAP Billing',             publisher: 'Hamster Lab',    category: 'TOOLS',        pipelines: ['Built-in'],       version: '3.0.2',  size: 18.4,  purchasedAt: '2026-02-19', updatedAt: '2026-05-21', license: 'Multi Entity',  hasUpdate: true,  downloaded: false, rating: 4.5, paidCoins: 140, color: '#059669' },
  { id: 4,  title: 'Character Boom',                   publisher: 'Boom Studio',    category: 'CHARACTER',    pipelines: ['Built-in', 'URP'], version: '1.2.0',  size: 156.9, purchasedAt: '2026-03-07', updatedAt: '2026-03-07', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.9, paidCoins: 160, color: '#DC2626' },
  { id: 5,  title: 'MFPS 2.0 Multiplayer FPS',         publisher: 'LOVATTO Studio', category: 'TEMPLATE',     pipelines: ['Built-in', 'URP'], version: '6.1.3',  size: 640.5, purchasedAt: '2026-03-22', updatedAt: '2026-07-11', license: 'Single Entity', hasUpdate: true,  downloaded: true,  rating: 4.7, paidCoins: 230, color: '#D97706' },
  { id: 6,  title: 'City Car Driving Simulator',       publisher: 'RoadPro',        category: 'TEMPLATE',     pipelines: ['URP'],            version: '2.0.0',  size: 488.1, purchasedAt: '2026-04-02', updatedAt: '2026-04-02', license: 'Single Entity', hasUpdate: false, downloaded: false, rating: 4.4, paidCoins: 250, color: '#D97706' },
  { id: 7,  title: 'Low Poly Fantasy Forest',          publisher: 'Synty Studios',  category: 'ENVIRONMENTS', pipelines: ['Built-in', 'URP', 'HDRP'], version: '4.5.0', size: 302.3, purchasedAt: '2026-04-18', updatedAt: '2026-06-30', license: 'Multi Entity', hasUpdate: true, downloaded: true, rating: 4.8, paidCoins: 180, color: '#2563EB' },
  { id: 8,  title: 'Pixel Hero Pack Vol.1',            publisher: 'PixelToon',      category: 'CHARACTER',    pipelines: ['Built-in'],       version: '1.0.4',  size: 22.8,  purchasedAt: '2026-04-25', updatedAt: '2026-04-25', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.6, paidCoins: 75,  color: '#DC2626' },
  { id: 9,  title: 'Ultimate Game SFX Bundle',         publisher: 'SoundBridge',    category: 'AUDIO',        pipelines: ['Built-in'],       version: '5.2.0',  size: 1284.0, purchasedAt: '2026-05-06', updatedAt: '2026-05-06', license: 'Multi Entity', hasUpdate: false, downloaded: true, rating: 4.9, paidCoins: 120, color: '#DB2777' },
  { id: 10, title: 'ProCamera 2D',                     publisher: 'CINEMACHINE+',   category: 'TOOLS',        pipelines: ['Built-in', 'URP'], version: '2.8.7',  size: 41.6,  purchasedAt: '2026-05-19', updatedAt: '2026-07-28', license: 'Single Entity', hasUpdate: true,  downloaded: false, rating: 4.8, paidCoins: 200, color: '#059669' },
  { id: 11, title: 'Cartoon FX Remaster',              publisher: 'Jean Moreno',    category: 'VFX',          pipelines: ['Built-in', 'URP'], version: '3.1.1',  size: 98.4,  purchasedAt: '2026-05-30', updatedAt: '2026-05-30', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.7, paidCoins: 110, color: '#0891B2' },
  { id: 12, title: 'Fantasy RPG UI Kit',               publisher: 'PixelForge',     category: 'GUI',          pipelines: ['Built-in'],       version: '1.6.2',  size: 63.9,  purchasedAt: '2026-06-08', updatedAt: '2026-06-08', license: 'Single Entity', hasUpdate: false, downloaded: false, rating: 4.7, paidCoins: 90,  color: '#7C3AED' },
  { id: 13, title: 'Cyberpunk City Pack',              publisher: 'NightCity Works', category: 'ENVIRONMENTS', pipelines: ['HDRP'],          version: '2.2.0',  size: 894.7, purchasedAt: '2026-06-21', updatedAt: '2026-07-15', license: 'Single Entity', hasUpdate: true,  downloaded: true,  rating: 4.5, paidCoins: 320, color: '#2563EB' },
  { id: 14, title: 'Magic Spells FX Vol.2',            publisher: 'Hovl Studio',    category: 'VFX',          pipelines: ['URP'],            version: '2.0.1',  size: 74.2,  purchasedAt: '2026-07-01', updatedAt: '2026-07-01', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.8, paidCoins: 95,  color: '#0891B2' },
  { id: 15, title: 'Modular Dungeon Kit',              publisher: 'Synty Studios',  category: 'ENVIRONMENTS', pipelines: ['Built-in', 'URP'], version: '3.3.0',  size: 271.5, purchasedAt: '2026-07-09', updatedAt: '2026-07-09', license: 'Multi Entity',  hasUpdate: false, downloaded: false, rating: 4.9, paidCoins: 195, color: '#2563EB' },
  { id: 16, title: 'Endless Runner Mobile Kit',        publisher: 'Hamster Lab',    category: 'TEMPLATE',     pipelines: ['URP'],            version: '1.4.0',  size: 130.8, purchasedAt: '2026-07-17', updatedAt: '2026-07-30', license: 'Single Entity', hasUpdate: true,  downloaded: true,  rating: 4.5, paidCoins: 145, color: '#D97706' },
  { id: 17, title: 'Mobile Game UI Bundle',            publisher: 'GameUI Studio',  category: 'GUI',          pipelines: ['Built-in', 'URP'], version: '2.1.0',  size: 55.3,  purchasedAt: '2026-07-24', updatedAt: '2026-07-24', license: 'Single Entity', hasUpdate: false, downloaded: true,  rating: 4.4, paidCoins: 85,  color: '#7C3AED' },
  { id: 18, title: 'Dungeon Warrior Pack',             publisher: 'Itch Soft',      category: 'CHARACTER',    pipelines: ['Built-in', 'HDRP'], version: '1.1.5', size: 187.2, purchasedAt: '2026-07-29', updatedAt: '2026-07-29', license: 'Single Entity', hasUpdate: false, downloaded: false, rating: 4.7, paidCoins: 210, color: '#DC2626' },
]

export function formatSize(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`
}

export function formatThaiDate(iso: string) {
  const d = new Date(iso)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
}
