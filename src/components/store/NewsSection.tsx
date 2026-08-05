import { NEWS_ITEMS } from './data'

export function NewsSection() {
  return (
    <div style={{ backgroundColor: '#141414', borderTop: '1px solid #222' }} className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-white text-2xl uppercase tracking-wide">ข่าวสารล่าสุด</h2>
          <a href="#" className="text-xs font-bold" style={{ color: '#F97316' }}>ดูทั้งหมด ›</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {NEWS_ITEMS.map(item => (
            <div key={item.id} className="rounded-lg overflow-hidden cursor-pointer group" style={{ backgroundColor: '#1e1c19' }}>
              <div className="h-32 flex items-center justify-center" style={{ backgroundColor: item.img + '22', backgroundImage: `radial-gradient(ellipse at 50% 50%, ${item.img}44 0%, transparent 70%)` }}>
                <span className="text-4xl font-black select-none" style={{ color: item.img, opacity: 0.4 }}>📰</span>
              </div>
              <div className="p-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-sm" style={{ backgroundColor: item.img + '33', color: item.img }}>{item.label}</span>
                <p className="text-xs font-semibold text-white leading-snug mt-2 group-hover:underline">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
