import type { IconName } from '@/components/Icon'
import type { Motif } from '@/components/Artwork'

/**
 * Page 1 data — things you buy *on the HamsterHub platform itself*.
 * Deliberately NOT Unity assets: those live in the library (page 2).
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

export const PLATFORM_ITEMS: PlatformItem[] = [
  { id: 1,  kind: 'skin',  name: 'แฮมนักบินอวกาศ',   blurb: 'ชุดนักบินอวกาศพร้อมหมวกกระจก ลอยได้ตอนไอเดิล',      coins: 320, sale: 0,  rarity: 'legendary', owned: false, art: ['#7C3AED', '#2563EB'] },
  { id: 2,  kind: 'skin',  name: 'แฮมพ่อครัว',        blurb: 'หมวกเชฟกับผ้ากันเปื้อน แถมเอฟเฟกต์ควันตอนพิมพ์โค้ด', coins: 180, sale: 20, rarity: 'epic',      owned: true,  art: ['#DC2626', '#F97316'] },
  { id: 3,  kind: 'skin',  name: 'แฮมนินจา',          blurb: 'ชุดดำล้วน เดินผ่านหน้าเว็บแบบไร้เสียง',              coins: 240, sale: 0,  rarity: 'epic',      owned: false, art: ['#1a1814', '#7C3AED'] },
  { id: 4,  kind: 'skin',  name: 'แฮมบัณฑิต',         blurb: 'ชุดครุยรับปริญญา ปลดล็อกเมื่อเรียนจบคอร์สแรก',       coins: 0,   sale: 0,  rarity: 'common',    owned: true,  art: ['#1E1E2E', '#FBBF24'] },

  { id: 5,  kind: 'pet',   name: 'เจ้าเหมียวจิ๋ว',     blurb: 'แมวตัวเล็กเดินตามเคอร์เซอร์ทั่วหน้าเว็บ',            coins: 260, sale: 0,  rarity: 'epic',      owned: false, art: ['#F59E0B', '#DC2626'] },
  { id: 6,  kind: 'pet',   name: 'สไลม์เรืองแสง',      blurb: 'สไลม์เด้งดึ๋ง เปลี่ยนสีตามธีมที่ใช้อยู่',            coins: 150, sale: 0,  rarity: 'rare',      owned: false, art: ['#059669', '#0891B2'] },
  { id: 7,  kind: 'pet',   name: 'มังกรกระดาษ',        blurb: 'มังกรออริกามิบินวนรอบการ์ดโปรไฟล์',                  coins: 420, sale: 15, rarity: 'legendary', owned: false, art: ['#DB2777', '#7C3AED'] },

  { id: 8,  kind: 'theme', name: 'ธีมกลางคืน',        blurb: 'โทนดำอมส้ม ถนอมสายตาตอนโค้ดดึก',                    coins: 120, sale: 0,  rarity: 'common',    owned: true,  art: ['#0f0e0d', '#F97316'] },
  { id: 9,  kind: 'theme', name: 'ธีมไซเบอร์พังก์',    blurb: 'นีออนม่วง-ฟ้า พร้อมเส้นสแกนไลน์แบบจอ CRT',           coins: 280, sale: 0,  rarity: 'epic',      owned: false, art: ['#7C3AED', '#0891B2'] },
  { id: 10, kind: 'theme', name: 'ธีมทุ่งหญ้า',        blurb: 'เขียวสดใส เหมาะกับการเรียนตอนเช้า',                  coins: 120, sale: 30, rarity: 'common',    owned: false, art: ['#059669', '#FACC15'] },
  { id: 11, kind: 'theme', name: 'ธีมพิกเซล 8-bit',    blurb: 'ฟอนต์พิกเซลกับขอบแบบเกมเก่า ครบทั้งหน้าเว็บ',        coins: 200, sale: 0,  rarity: 'rare',      owned: false, art: ['#2563EB', '#DB2777'] },

  { id: 12, kind: 'emoji', name: 'ชุดอิโมจิแฮมจอมป่วน', blurb: 'อิโมจิแฮมสเตอร์ 24 แบบ ใช้ได้ในคอมเมนต์และแชท',     coins: 90,  sale: 0,  rarity: 'common',    owned: false, art: ['#F97316', '#FACC15'] },
  { id: 13, kind: 'emoji', name: 'ชุดอิโมจิสายโค้ด',    blurb: 'อิโมจิบั๊ก คอมไพล์ผ่าน เดดไลน์ และอื่นๆ อีก 18 แบบ', coins: 90,  sale: 0,  rarity: 'common',    owned: true,  art: ['#0891B2', '#059669'] },
  { id: 14, kind: 'emoji', name: 'ชุดอิโมจิเคลื่อนไหว', blurb: 'อิโมจิขยับได้ 12 แบบ สำหรับสมาชิก Pro',              coins: 260, sale: 0,  rarity: 'epic',      owned: false, art: ['#DB2777', '#F59E0B'] },

  { id: 15, kind: 'frame', name: 'กรอบทองคำ',          blurb: 'กรอบโปรไฟล์ทองพร้อมประกายวิ่งรอบขอบ',                coins: 350, sale: 0,  rarity: 'legendary', owned: false, art: ['#F59E0B', '#FACC15'] },
  { id: 16, kind: 'frame', name: 'กรอบเปลวไฟ',         blurb: 'เปลวไฟไหวๆ รอบรูปโปรไฟล์',                          coins: 220, sale: 10, rarity: 'epic',      owned: false, art: ['#DC2626', '#F97316'] },
  { id: 17, kind: 'frame', name: 'กรอบใบไม้',          blurb: 'กรอบใบไม้เรียบๆ ใครก็ใช้ได้',                        coins: 60,  sale: 0,  rarity: 'common',    owned: true,  art: ['#059669', '#84CC16'] },
  { id: 18, kind: 'frame', name: 'กรอบกาแล็กซี',       blurb: 'ดาวหมุนช้าๆ รอบรูป พร้อมฝุ่นดาวจางๆ',                coins: 300, sale: 0,  rarity: 'epic',      owned: false, art: ['#2563EB', '#7C3AED'] },
]

/**
 * The three "chapters" the GSAP pathway scroll walks the visitor through.
 * Note stop 03: HamCoin is *earned* through learning — it is never sold for
 * money, so there is deliberately no coin-purchase flow anywhere in HamStore.
 */
export const PATHWAY_STOPS = [
  {
    id: 'dress',
    step: '01',
    title: 'แต่งตัวแฮมของคุณ',
    body: 'สกินและเพื่อนซี้เปลี่ยนหน้าตาแฮมสเตอร์ประจำตัวคุณ ทุกคนที่เข้ามาดูโปรไฟล์จะเห็นทันที',
    icon: 'skin' as IconName,
    color: '#F97316',
  },
  {
    id: 'decorate',
    step: '02',
    title: 'ตกแต่งพื้นที่ของคุณ',
    body: 'ธีมเปลี่ยนสีทั้งเว็บ กรอบโปรไฟล์และอิโมจิทำให้คอมเมนต์ของคุณไม่เหมือนใคร',
    icon: 'theme' as IconName,
    color: '#7C3AED',
  },
  {
    id: 'earn',
    step: '03',
    title: 'สะสม HamCoin',
    body: 'เรียนจบบทเรียน ส่งงาน หรือช่วยตอบคำถามในฟอรัม แล้วเอาเหรียญมาแลกของที่นี่',
    icon: 'coin' as IconName,
    color: '#FACC15',
  },
]

/**
 * The editor's picks. Each carries the reason it was chosen — a recommendation
 * without a stated reason is just a bigger card.
 */
export const RECOMMENDED: { id: number; reason: string; note: string }[] = [
  { id: 1,  reason: 'ขายดีที่สุดเดือนนี้', note: 'คนเลือกมากที่สุดในบรรดาสกินทั้งหมด และเป็นชิ้นเดียวที่ลอยได้ตอนไอเดิล' },
  { id: 9,  reason: 'คู่กับสกินได้ทุกตัว',  note: 'โทนนีออนเข้ากับสกินเกือบทุกแบบ เลยเป็นธีมที่คนใส่คู่กันบ่อยที่สุด' },
  { id: 17, reason: 'เริ่มต้นแค่ 60',       note: 'ถูกที่สุดในหมวดกรอบ เหมาะกับคนที่เพิ่งเก็บเหรียญได้ก้อนแรก' },
  { id: 7,  reason: 'ของหายาก',            note: 'ระดับตำนาน มีเอฟเฟกต์บินวนรอบการ์ดโปรไฟล์ที่ไม่มีในชิ้นอื่น' },
]

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

export const ITEM_DETAILS: Record<number, ItemDetail> = {
  1:  { maker: 'สตูดิโอแฮมสเตอร์', owners: 4820, version: '1.3', updatedAt: '2026-07-18', includes: ['ท่ายืน 6 ท่า', 'หมวกกระจกแยกชิ้น ถอดได้', 'เอฟเฟกต์ลอยตอนไอเดิล'], showsUp: ['โปรไฟล์', 'คอมเมนต์', 'กระดานอันดับ'] },
  2:  { maker: 'ครัวแฮมสเตอร์',    owners: 7310, version: '2.0', updatedAt: '2026-06-02', includes: ['ท่ายืน 4 ท่า', 'หมวกเชฟ + ผ้ากันเปื้อน', 'ควันตอนพิมพ์โค้ด'], showsUp: ['โปรไฟล์', 'คอมเมนต์'] },
  3:  { maker: 'สตูดิโอแฮมสเตอร์', owners: 3190, version: '1.1', updatedAt: '2026-05-11', includes: ['ท่ายืน 5 ท่า', 'เอฟเฟกต์เดินไร้เสียง'], showsUp: ['โปรไฟล์', 'คอมเมนต์'] },
  4:  { maker: 'HamsterHub',      owners: 12040, version: '1.0', updatedAt: '2026-01-09', includes: ['ท่ายืน 3 ท่า', 'ชุดครุย + หมวก'], showsUp: ['โปรไฟล์'] },
  5:  { maker: 'บ้านสัตว์เลี้ยง',  owners: 2870, version: '1.4', updatedAt: '2026-07-02', includes: ['อนิเมชันเดิน 8 เฟรม', 'ตามเคอร์เซอร์ทุกหน้า'], showsUp: ['ทุกหน้าในเว็บ'] },
  6:  { maker: 'บ้านสัตว์เลี้ยง',  owners: 5240, version: '1.2', updatedAt: '2026-04-27', includes: ['อนิเมชันเด้ง 6 เฟรม', 'เปลี่ยนสีตามธีมอัตโนมัติ'], showsUp: ['ทุกหน้าในเว็บ'] },
  7:  { maker: 'Origami Lab',     owners: 940,  version: '1.0', updatedAt: '2026-07-25', includes: ['อนิเมชันบิน 12 เฟรม', 'เงาตกกระทบบนการ์ด'], showsUp: ['การ์ดโปรไฟล์'] },
  8:  { maker: 'HamsterHub',      owners: 18600, version: '3.1', updatedAt: '2026-06-14', includes: ['โทนสีครบทั้งเว็บ', 'ปรับความสว่างได้ 3 ระดับ'], showsUp: ['ทั้งเว็บ'] },
  9:  { maker: 'Neon Works',      owners: 6120, version: '2.2', updatedAt: '2026-07-09', includes: ['โทนสีครบทั้งเว็บ', 'เส้นสแกนไลน์เปิด/ปิดได้', 'ฟอนต์หัวข้อเฉพาะธีม'], showsUp: ['ทั้งเว็บ'] },
  10: { maker: 'HamsterHub',      owners: 8730, version: '1.5', updatedAt: '2026-03-20', includes: ['โทนสีครบทั้งเว็บ'], showsUp: ['ทั้งเว็บ'] },
  11: { maker: 'Pixel Press',     owners: 4410, version: '1.8', updatedAt: '2026-05-30', includes: ['โทนสีครบทั้งเว็บ', 'ฟอนต์พิกเซล', 'ขอบแบบเกมเก่า'], showsUp: ['ทั้งเว็บ'] },
  12: { maker: 'สตูดิโอแฮมสเตอร์', owners: 9980, version: '2.0', updatedAt: '2026-06-28', includes: ['สติกเกอร์ 24 แบบ', 'ไฟล์ความละเอียด 2x'], showsUp: ['คอมเมนต์', 'ฟอรัม', 'แชท'] },
  13: { maker: 'Dev Sticker Co.', owners: 11250, version: '2.3', updatedAt: '2026-07-21', includes: ['สติกเกอร์ 18 แบบ', 'ไฟล์ความละเอียด 2x'], showsUp: ['คอมเมนต์', 'ฟอรัม', 'แชท'] },
  14: { maker: 'Dev Sticker Co.', owners: 2130, version: '1.1', updatedAt: '2026-07-30', includes: ['สติกเกอร์ขยับได้ 12 แบบ', 'ไฟล์ 2x + เวอร์ชันนิ่ง'], showsUp: ['คอมเมนต์', 'ฟอรัม', 'แชท'] },
  15: { maker: 'Frame Atelier',   owners: 1580, version: '1.0', updatedAt: '2026-07-12', includes: ['กรอบ + ประกายวิ่งรอบขอบ', 'ปรับความเร็วประกายได้'], showsUp: ['รูปโปรไฟล์'] },
  16: { maker: 'Frame Atelier',   owners: 3360, version: '1.2', updatedAt: '2026-05-05', includes: ['กรอบ + เปลวไฟ 24 เฟรม'], showsUp: ['รูปโปรไฟล์'] },
  17: { maker: 'HamsterHub',      owners: 15900, version: '1.0', updatedAt: '2026-02-14', includes: ['กรอบนิ่ง 1 แบบ'], showsUp: ['รูปโปรไฟล์'] },
  18: { maker: 'Frame Atelier',   owners: 2740, version: '1.1', updatedAt: '2026-06-19', includes: ['กรอบ + ดาวหมุน', 'ฝุ่นดาวเปิด/ปิดได้'], showsUp: ['รูปโปรไฟล์'] },
}
