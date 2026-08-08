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

/* Kinds are data now, so this is a string rather than a closed union. */
export type ItemKind = string

export interface PlatformItem {
  id: number
  kind: ItemKind
  name: string
  blurb: string
  coins: number
  /** 0 = no discount */
  sale: number
  rarity: string
  owned: boolean
  /** two-tone field the generated cover is built from */
  art: [string, string]
  /** What you pick before ordering. One entry means there is nothing to pick. */
  sizes: string[]
  /** How many are on the shelf. 0 means it cannot be ordered. */
  stock: number
  /** Working days from order to doorstep. */
  shipsIn: number
  /** Path to real cover art. Drop a file in /public and set it here to
   *  override the generated cover — nothing else needs to change. */
  image?: string
}

export interface KindMeta {
  label: string
  icon: IconName
  motif: Motif
  color: string
}

/* Built from the content file, so a category can be renamed, recoloured or
   given a different drawing without touching code. The fallback matters: an
   item pointing at a kind someone deleted must render plainly rather than
   crash the whole grid on an undefined lookup. */
export const KIND_META: Record<string, KindMeta> = Object.fromEntries(
  CONTENT.kinds.map(k => [k.id, { label: k.label, icon: k.icon as IconName, motif: k.motif as Motif, color: k.color }]),
)

export const KIND_ORDER: ItemKind[] = CONTENT.kinds.map(k => k.id)

export const FALLBACK_KIND: KindMeta = { label: '—', icon: 'all', motif: 'blocks', color: '#6e6e73' }

export function kindMeta(kind: string): KindMeta {
  return KIND_META[kind] ?? FALLBACK_KIND
}

export const RARITY_META: Record<string, { label: string; color: string }> = Object.fromEntries(
  CONTENT.rarities.map(r => [r.id, { label: r.label, color: r.color }]),
)

export function rarityMeta(rarity: string) {
  return RARITY_META[rarity] ?? { label: '—', color: '#6e6e73' }
}

export const PLATFORM_ITEMS: PlatformItem[] = CONTENT.items as unknown as PlatformItem[]

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
