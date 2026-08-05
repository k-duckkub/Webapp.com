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
  /** two-tone swatch used to build the item's placeholder art */
  art: [string, string]
}

export const KIND_META: Record<ItemKind, { label: string; icon: string; color: string }> = {
  skin:  { label: 'สกินแฮมสเตอร์', icon: '🐹', color: '#F97316' },
  pet:   { label: 'เพื่อนซี้',      icon: '🐾', color: '#DC2626' },
  theme: { label: 'ธีมหน้าเว็บ',    icon: '🎨', color: '#7C3AED' },
  emoji: { label: 'อิโมจิ',         icon: '😊', color: '#0891B2' },
  frame: { label: 'กรอบโปรไฟล์',    icon: '🖼', color: '#059669' },
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
    icon: '🐹',
    color: '#F97316',
  },
  {
    id: 'decorate',
    step: '02',
    title: 'ตกแต่งพื้นที่ของคุณ',
    body: 'ธีมเปลี่ยนสีทั้งเว็บ กรอบโปรไฟล์และอิโมจิทำให้คอมเมนต์ของคุณไม่เหมือนใคร',
    icon: '🎨',
    color: '#7C3AED',
  },
  {
    id: 'earn',
    step: '03',
    title: 'สะสม HamCoin',
    body: 'เรียนจบบทเรียน ส่งงาน หรือช่วยตอบคำถามในฟอรัม แล้วเอาเหรียญมาแลกของที่นี่',
    icon: '🪙',
    color: '#FACC15',
  },
]
