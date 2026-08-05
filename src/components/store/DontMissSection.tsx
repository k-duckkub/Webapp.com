import { StarRating } from './StarRating'
import { STORE_PRODUCTS, getCategoryColor } from './data'

export function DontMissSection() {
  const featured = STORE_PRODUCTS[10]
  return (
    <div className="relative overflow-hidden py-12 px-6" style={{ backgroundColor: '#1a1200' }}>
      {/* Star particles */}
      {[...Array(16)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            backgroundColor: '#FACC15',
            opacity: 0.3 + (i % 4) * 0.1,
            top: `${10 + (i * 37) % 80}%`,
            left: `${5 + (i * 53) % 90}%`,
          }} />
      ))}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FACC15' }}>
            อย่าพลาด<br />โอกาสนี้!
          </h2>
          <p className="text-sm mb-6" style={{ color: '#c9a854' }}>
            อัปเกรด asset ของคุณด้วย HamStore DLC! เริ่มสำรวจวันนี้ด้วย offer พิเศษจาก marketplace ลงทะเบียนเพื่อรับสิทธิ์ก่อนใคร
          </p>
          <div className="flex gap-3">
            <button className="text-xs font-black px-5 py-2.5 rounded text-white flex items-center gap-1"
              style={{ backgroundColor: '#F97316' }}>
              เข้าสู่ระบบ &amp; รับสิทธิ์ ›
            </button>
            <button className="text-xs font-bold px-5 py-2.5 rounded underline" style={{ color: '#FACC15' }}>
              ดู ASSET ทั้งหมด ›
            </button>
          </div>
        </div>
        {/* Featured free card */}
        <div className="flex justify-center">
          <div className="rounded-lg overflow-hidden w-56" style={{ backgroundColor: '#1e1c19', border: '1px solid #3a3020' }}>
            <div className="h-32 flex items-center justify-center relative"
              style={{ background: `linear-gradient(145deg, ${getCategoryColor(featured.category)}33, #1a1200)` }}>
              <span className="text-5xl font-black" style={{ color: getCategoryColor(featured.category), opacity: 0.5 }}>
                {featured.category.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-white leading-snug mb-1">{featured.title}</p>
              <p className="text-xs mb-2" style={{ color: '#7a7060' }}>by {featured.publisher}</p>
              <div className="flex items-center justify-between">
                <StarRating rating={featured.rating} reviews={featured.reviews} />
                <span className="text-xs font-black px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#059669', color: '#fff' }}>
                  ฟรี
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
