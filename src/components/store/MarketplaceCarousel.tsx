import { useRef } from 'react'
import { StarRating } from './StarRating'
import { STORE_PRODUCTS, getCategoryColor } from './data'

export function MarketplaceCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += dir * 260
  }
  return (
    <div style={{ backgroundColor: '#0f0e0d' }} className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-black text-white text-2xl uppercase tracking-wide">Marketplace Add-Ons</h2>
            <p className="text-sm mt-1" style={{ color: '#7a7060' }}>
              ตอนนี้มี asset เพิ่มเติมให้เลือกมากขึ้น — ค้นหา add-on ฟรีและพรีเมียมได้เลย
            </p>
          </div>
          <button className="text-xs font-bold px-4 py-2 rounded" style={{ backgroundColor: '#F97316', color: '#fff' }}>
            ดู MARKETPLACE ›
          </button>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-3"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
          >
            {STORE_PRODUCTS.map(p => {
              const color = getCategoryColor(p.category)
              return (
                <div key={p.id} className="flex-shrink-0 w-52 rounded-lg overflow-hidden cursor-pointer group"
                  style={{ backgroundColor: '#1e1c19', border: '1px solid #2a2520' }}>
                  <div className="relative h-28 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${color}33 0%, #0d0d0d 100%)` }}>
                    <span className="text-4xl font-black select-none group-hover:scale-110 transition-transform duration-300"
                      style={{ color, opacity: 0.5 }}>
                      {p.category.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="absolute top-1.5 left-1.5 text-xs font-bold px-1.5 py-0.5 rounded-sm"
                      style={{ backgroundColor: color, color: '#fff', fontSize: 9 }}>
                      add-on
                    </span>
                    {p.sale > 0 && (
                      <span className="absolute top-1.5 right-1.5 text-xs font-black px-1.5 py-0.5 rounded-sm"
                        style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: 9 }}>
                        -{p.sale}%
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-white leading-snug line-clamp-2 mb-0.5">{p.title}</p>
                    <p style={{ fontSize: 10, color: '#7a7060' }}>by {p.publisher}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <StarRating rating={p.rating} reviews={p.reviews} />
                      <span className="text-xs font-black flex items-center gap-0.5" style={{ color: '#F97316' }}>
                        🪙{p.coins}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => scroll(-1)} className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#1e1c19', color: '#a09880', border: '1px solid #2a2520' }}>←</button>
            <button onClick={() => scroll(1)} className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#1e1c19', color: '#a09880', border: '1px solid #2a2520' }}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
