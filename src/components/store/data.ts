export interface Product {
  id: number
  category: string
  title: string
  publisher: string
  tags: string[]
  coins: number
  rating: number
  reviews: number
  sale: number
}

export interface NewsItem {
  id: number
  label: string
  title: string
  img: string
}

export const CATEGORY_COLORS: Record<string, string> = {
  UI: '#7C3AED',
  VFX: '#0891B2',
  Tools: '#059669',
  Character: '#DC2626',
  Template: '#D97706',
  Environments: '#2563EB',
  SFX: '#DB2777',
  ALL: '#6B7280',
}

export const UNITY_CATEGORIES = ['ALL', 'CHARACTER', 'ENVIRONMENTS', 'SFX', 'TEMPLATE', 'TOOLS', 'UI', 'VFX']

export const STORE_PRODUCTS: Product[] = [
  { id: 1,  category: 'UI',           title: 'GUI Pro - Minimal Game Light',      publisher: 'Michsky',         tags: ['2D', 'Minimalist'],   coins: 100, rating: 4.8, reviews: 312,  sale: 0   },
  { id: 2,  category: 'VFX',          title: 'HTrace: SSGI URP',                  publisher: 'Heterosis',       tags: ['URP'],                coins: 130, rating: 4.6, reviews: 89,   sale: 0   },
  { id: 3,  category: 'Tools',        title: 'UniPay - IAP Billing',              publisher: 'Hamster Lab',      tags: ['Mobile'],             coins: 140, rating: 4.5, reviews: 54,   sale: 0   },
  { id: 4,  category: 'Character',    title: 'Character Boom',                    publisher: 'Boom Studio',      tags: ['2D', 'Stylized'],     coins: 160, rating: 4.9, reviews: 201,  sale: 20  },
  { id: 5,  category: 'Template',     title: 'MFPS 2.0 Multiplayer FPS',         publisher: 'LOVATTO Studio',   tags: ['3D', 'URP'],          coins: 230, rating: 4.7, reviews: 445,  sale: 0   },
  { id: 6,  category: 'Template',     title: 'City Car Driving Simulator',        publisher: 'RoadPro',          tags: ['3D'],                 coins: 250, rating: 4.4, reviews: 167,  sale: 15  },
  { id: 7,  category: 'Template',     title: 'Horror Multiplayer Game Template',  publisher: 'DarkByte',         tags: ['3D'],                 coins: 295, rating: 4.3, reviews: 88,   sale: 0   },
  { id: 8,  category: 'UI',           title: 'Fantasy RPG UI Kit',                publisher: 'PixelForge',       tags: ['2D', 'Fantasy'],      coins: 90,  rating: 4.7, reviews: 278,  sale: 0   },
  { id: 9,  category: 'Environments', title: 'Low Poly Fantasy Forest',           publisher: 'Synty Studios',    tags: ['3D', 'Low Poly'],     coins: 180, rating: 4.8, reviews: 532,  sale: 30  },
  { id: 10, category: 'Character',    title: 'Pixel Hero Pack Vol.1',             publisher: 'PixelToon',        tags: ['2D', 'Pixel Art'],    coins: 75,  rating: 4.6, reviews: 190,  sale: 0   },
  { id: 11, category: 'SFX',          title: 'Ultimate Game SFX Bundle',          publisher: 'SoundBridge',      tags: ['Audio'],              coins: 120, rating: 4.9, reviews: 621,  sale: 0   },
  { id: 12, category: 'Tools',        title: 'ProCamera 2D',                      publisher: 'CINEMACHINE+',     tags: ['2D', 'Camera'],       coins: 200, rating: 4.8, reviews: 398,  sale: 10  },
  { id: 13, category: 'VFX',          title: 'Cartoon FX Remaster',               publisher: 'Jean Moreno',      tags: ['2D', 'Cartoon'],      coins: 110, rating: 4.7, reviews: 1042, sale: 0   },
  { id: 14, category: 'Template',     title: 'Platformer Game Starter Kit',       publisher: 'More Mountains',   tags: ['2D', 'URP'],          coins: 175, rating: 4.6, reviews: 264,  sale: 0   },
  { id: 15, category: 'Environments', title: 'Cyberpunk City Pack',               publisher: 'NightCity Works',  tags: ['3D', 'HDRP'],         coins: 320, rating: 4.5, reviews: 143,  sale: 25  },
  { id: 16, category: 'UI',           title: 'Mobile Game UI Bundle',             publisher: 'GameUI Studio',    tags: ['2D', 'Mobile'],       coins: 85,  rating: 4.4, reviews: 87,   sale: 0   },
  { id: 17, category: 'Character',    title: 'Dungeon Warrior Pack',              publisher: 'Itch Soft',        tags: ['3D', 'Stylized'],     coins: 210, rating: 4.7, reviews: 156,  sale: 0   },
  { id: 18, category: 'Template',     title: 'Endless Runner Mobile Kit',         publisher: 'Hamster Lab',      tags: ['2D', 'Mobile'],       coins: 145, rating: 4.5, reviews: 219,  sale: 0   },
  { id: 19, category: 'VFX',          title: 'Magic Spells FX Vol.2',             publisher: 'Hovl Studio',      tags: ['URP', 'Fantasy'],     coins: 95,  rating: 4.8, reviews: 347,  sale: 0   },
  { id: 20, category: 'Environments', title: 'Modular Dungeon Kit',               publisher: 'SyntyStudios',     tags: ['3D', 'Low Poly'],     coins: 195, rating: 4.9, reviews: 489,  sale: 20  },
]

export const NEWS_ITEMS: NewsItem[] = [
  { id: 1, label: 'ข่าวสาร', title: 'HamsterHub เปิดตัว HamStore ระบบใหม่', img: '#7C3AED' },
  { id: 2, label: 'อัปเดต',  title: 'Asset ใหม่ 50+ ชิ้นพร้อมให้ดาวน์โหลด', img: '#0891B2' },
  { id: 3, label: 'บทความ',  title: 'วิธีใช้ HamCoin เพื่อปลดล็อก asset ฟรี', img: '#059669' },
  { id: 4, label: 'กิจกรรม', title: 'แข่งขัน Game Jam ประจำเดือน สิงหาคม 2567', img: '#DC2626' },
]

export function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? '#6B7280'
}

export const UNITY_FILTERS: Record<string, string[]> = {
  category: ['2D', '3D', 'Audio', 'VFX', 'Tools', 'Templates'],
  renderPipeline: ['URP', 'HDRP', 'Built-in'],
  priceRange: ['ฟรี', 'ต่ำกว่า 100 coins', '100–200 coins', 'มากกว่า 200 coins'],
  rating: ['4★ ขึ้นไป', '3★ ขึ้นไป'],
}
