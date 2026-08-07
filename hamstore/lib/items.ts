import type { IconName } from '@/components/Icon'
import type { Motif } from '@/components/Artwork'
import { CONTENT } from '@/lib/content'

/**
 * Page 1 data — things you buy *on the HamsterHub platform itself*.
 * Deliberately NOT Unity assets: those live in the library (page 2).
 *
 * The catalogue itself now lives in `content/site.json` so it can be edited in
 * the studio without touching code. What stays here is the shape it has to
 * hold, and the design metadata — motif, icon and hue per category — which is
 * a drawing decision rather than something to type into a text field.
 */

export type ItemKind = 'skin' | 'pet' | 'theme' | 'emoji' | 'frame'

export interface PlatformItem {
  id: number
  kind: ItemKind
  name: string
  blurb: string
  coins: number
  /** 0 = no discount */
  sale: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  owned: boolean
  /** two-tone field the generated cover is built from */
  art: [string, string]
  /** Path to real cover art. Drop a file in /public and set it here to
   *  override the generated cover — nothing else needs to change. */
  image?: string
}

export const KIND_META: Record<
  ItemKind,
  { label: string; icon: IconName; motif: Motif; color: string }
> = {
  skin:  { label: 'สกินแฮมสเตอร์', icon: 'skin',    motif: 'figure',   color: '#F97316' },
  pet:   { label: 'เพื่อนซี้',      icon: 'pet',     motif: 'tracks',   color: '#DC2626' },
  theme: { label: 'ธีมหน้าเว็บ',    icon: 'theme',   motif: 'swatches', color: '#7C3AED' },
  emoji: { label: 'สติกเกอร์',     icon: 'sticker', motif: 'sheet',    color: '#0891B2' },
  frame: { label: 'กรอบโปรไฟล์',    icon: 'frame',   motif: 'nested',   color: '#059669' },
}

export const RARITY_META: Record<PlatformItem['rarity'], { label: string; color: string }> = {
  common:    { label: 'ธรรมดา',   color: '#7a7060' },
  rare:      { label: 'หายาก',    color: '#2563EB' },
  epic:      { label: 'เอพิค',    color: '#7C3AED' },
  legendary: { label: 'ตำนาน',    color: '#F59E0B' },
}

export const PLATFORM_ITEMS: PlatformItem[] = CONTENT.items as PlatformItem[]

/**
 * The three "chapters" the GSAP pathway scroll walks the visitor through.
 * Note stop 03: HamCoin is *earned* through learning — it is never sold for
 * money, so there is deliberately no coin-purchase flow anywhere in HamStore.
 */
export interface PathwayStop {
  id: string
  step: string
  title: string
  body: string
  icon: IconName
  color: string
}

export const PATHWAY_STOPS: PathwayStop[] = CONTENT.pathway as PathwayStop[]

/**
 * The editor's picks. Each carries the reason it was chosen — a recommendation
 * without a stated reason is just a bigger card.
 */
export interface Recommendation {
  id: number
  reason: string
  note: string
}

export const RECOMMENDED: Recommendation[] = CONTENT.recommended

/**
 * What a buyer needs before they commit.
 *
 * The catalogue above is enough to render a card; it is not enough to decide
 * with. Someone choosing a thing to actually use wants to know who made it,
 * how many people already run it, exactly what lands in their account, where
 * it shows up, and whether it is still being maintained. Kept beside the
 * catalogue rather than inside it so a card stays cheap to render.
 */
export interface ItemDetail {
  maker: string
  /** How many accounts already have it — the only honest social proof here. */
  owners: number
  /** Exactly what arrives. Counts, not adjectives. */
  includes: string[]
  /** Where it actually appears, so nobody buys it for the wrong surface. */
  showsUp: string[]
  version: string
  updatedAt: string
}

export const ITEM_DETAILS: Record<number, ItemDetail> = CONTENT.itemDetails
