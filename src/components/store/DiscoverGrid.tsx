import { StarRating } from './StarRating'
import { STORE_PRODUCTS, getCategoryColor } from './data'

export function DiscoverGrid() {
  const featured = STORE_PRODUCTS.slice(0, 4)
  return (
    <div style={{ backgroundColor: '#141414' }} className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white font-black text-2xl text-center tracking-wide uppercase mb-8">
          Asset ยอดนิยม
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(p => {
            const color = getCategoryColor(p.category)
            return (
              <div key={p.id} className="group cursor-pointer rounded overflow-hidden" style={{ backgroundColor: '#1e1c19' }}>
                <div className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(145deg, ${color}33 0%, #0d0d0d 100%)` }}>
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                    backgroundSize: '8px 8px',
                  }} />
                  <span className="text-7xl font-black select-none group-hover:scale-110 transition-transform duration-300"
                    style={{ color, opacity: 0.5 }}>
                    {p.category.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-sm"
                    style={{ backgroundColor: color, color: '#fff' }}>
                    {p.category.toUpperCase()}
                  </span>
                  {p.sale > 0 && (
                    <span className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-sm"
                      style={{ backgroundColor: '#EF4444', color: '#fff' }}>
                      -{p.sale}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white font-bold text-sm leading-snug line-clamp-2 mb-1">{p.title}</p>
                  <p className="text-xs mb-1" style={{ color: '#7a7060' }}>{p.publisher}</p>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating rating={p.rating} reviews={p.reviews} />
                    <span className="text-xs font-black" style={{ color: '#F97316' }}>🪙 {p.coins}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tags.map(t => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: '#2a2520', color: '#7a7060' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
