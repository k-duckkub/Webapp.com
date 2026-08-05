import { useState } from 'react'
import { StarRating } from './StarRating'
import { STORE_PRODUCTS, UNITY_FILTERS, getCategoryColor } from './data'

export function UnityTab() {
  const [uCategory, setUCategory] = useState('ALL')
  const [uSort, setUSort] = useState('recommended')
  const [uPage, setUPage] = useState(1)
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>({})
  const PER_PAGE = 8

  const toggleFilter = (key: string) => setCheckedFilters(prev => ({ ...prev, [key]: !prev[key] }))

  const filtered = STORE_PRODUCTS.filter(
    p => uCategory === 'ALL' || p.category.toUpperCase() === uCategory
  )
  const sorted = [...filtered].sort((a, b) => {
    if (uSort === 'low') return a.coins - b.coins
    if (uSort === 'high') return b.coins - a.coins
    if (uSort === 'rating') return b.rating - a.rating
    if (uSort === 'az') return a.title.localeCompare(b.title)
    return 0
  })
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const paginated = sorted.slice((uPage - 1) * PER_PAGE, uPage * PER_PAGE)

  return (
    <div style={{ backgroundColor: '#f5f4f2', minHeight: '100vh' }}>
      {/* Unity-style top bar */}
      <div style={{ backgroundColor: '#222', borderBottom: '1px solid #333' }} className="py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-black text-white text-sm">Unity Asset Store</span>
            <div className="flex gap-4">
              {['3D', '2D', 'Audio', 'Tools', 'VFX', 'Templates', 'SDKs', 'Sale'].map(l => (
                <a key={l} href="#" className="text-xs font-medium" style={{ color: '#aaa' }}>{l}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: '#888' }}>🛒 0</span>
            <button className="text-xs font-bold px-3 py-1.5 rounded text-white" style={{ backgroundColor: '#222' }}>Sign In</button>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }} className="py-2 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          {['⭐ 13,000+ top-rated assets', '👥 700,000+ forum members', '🔒 ตรวจสอบทุก asset', '🆓 Free assets ทุกเดือน'].map(t => (
            <span key={t} className="text-xs" style={{ color: '#888' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#111', height: 200 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0a3a 0%, #0a1a3a 50%, #1a3a0a 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F97316' }}>HAMSTORE · UNITY ASSETS</p>
          <h1 className="font-black text-white text-3xl">เลือก Asset Unity ของคุณ</h1>
          <p className="text-sm" style={{ color: '#aaa' }}>{STORE_PRODUCTS.length} assets · พร้อมใช้งานทันที</p>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5' }} className="py-3 px-6">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto">
          {[
            { id: 'ALL',          icon: '🔥', label: 'ทั้งหมด' },
            { id: 'CHARACTER',    icon: '🧑', label: 'Characters' },
            { id: 'ENVIRONMENTS', icon: '🌲', label: 'Environments' },
            { id: 'UI',           icon: '🖼', label: 'GUI' },
            { id: 'VFX',          icon: '✨', label: 'VFX' },
            { id: 'SFX',          icon: '🎵', label: 'Audio' },
            { id: 'TOOLS',        icon: '🔧', label: 'Tools' },
            { id: 'TEMPLATE',     icon: '📦', label: 'Templates' },
          ].map(c => {
            const active = uCategory === c.id
            return (
              <button
                key={c.id}
                onClick={() => { setUCategory(c.id); setUPage(1) }}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: active ? '#222' : '#f0ede8',
                  color: active ? '#fff' : '#555',
                  border: `1px solid ${active ? '#222' : '#e0ddd8'}`,
                }}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <p className="text-sm font-black" style={{ color: '#111' }}>ตัวกรอง</p>
            </div>
            {Object.entries(UNITY_FILTERS).map(([group, options]) => (
              <div key={group} className="px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                  {group === 'category' ? 'หมวดหมู่' : group === 'renderPipeline' ? 'Render Pipeline' : group === 'priceRange' ? 'ช่วงราคา' : 'คะแนน'}
                </p>
                {options.map(opt => (
                  <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checkedFilters[opt]}
                      onChange={() => toggleFilter(opt)}
                      className="rounded"
                      style={{ accentColor: '#F97316' }}
                    />
                    <span className="text-xs" style={{ color: '#444' }}>{opt}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold" style={{ color: '#555' }}>
              {filtered.length} results for <strong style={{ color: '#111' }}>{uCategory === 'ALL' ? 'ทั้งหมด' : uCategory}</strong>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#888' }}>เรียงโดย:</span>
              <select
                value={uSort}
                onChange={e => { setUSort(e.target.value); setUPage(1) }}
                className="text-xs px-3 py-1.5 rounded outline-none"
                style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' }}
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Rating สูงสุด</option>
                <option value="low">Coin ต่ำ → สูง</option>
                <option value="high">Coin สูง → ต่ำ</option>
                <option value="az">ชื่อ A–Z</option>
              </select>
            </div>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paginated.map(p => {
              const color = getCategoryColor(p.category)
              const discounted = p.sale > 0
              const original = Math.round(p.coins / (1 - p.sale / 100))
              return (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                  style={{ border: '1px solid #e5e5e5' }}>
                  {/* Thumbnail */}
                  <div className="relative h-32 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${color}22 0%, #f5f4f2 100%)` }}>
                    <span className="text-5xl font-black select-none group-hover:scale-105 transition-transform duration-300"
                      style={{ color, opacity: 0.35 }}>
                      {p.category.slice(0, 2).toUpperCase()}
                    </span>
                    {discounted && (
                      <span className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#EF4444', color: '#fff' }}>
                        -{p.sale}%
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs mb-0.5" style={{ color: '#888' }}>{p.publisher}</p>
                    <p className="text-sm font-bold leading-snug line-clamp-2 mb-1" style={{ color: '#111' }}>{p.title}</p>
                    <StarRating rating={p.rating} reviews={p.reviews} />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-black" style={{ color: '#111' }}>🪙 {p.coins}</span>
                      {discounted && (
                        <span className="text-xs line-through" style={{ color: '#bbb' }}>🪙 {original}</span>
                      )}
                    </div>
                    <button className="w-full mt-2 text-xs font-bold py-1.5 rounded transition-colors text-white"
                      style={{ backgroundColor: '#222' }}>
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 mt-8">
            <button onClick={() => setUPage(p => Math.max(1, p - 1))} disabled={uPage === 1}
              className="px-4 py-2 text-xs rounded border transition-colors"
              style={{ backgroundColor: '#fff', color: uPage === 1 ? '#ccc' : '#333', borderColor: '#ddd', cursor: uPage === 1 ? 'not-allowed' : 'pointer' }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setUPage(n)}
                className="w-8 h-8 text-xs font-bold rounded border transition-colors"
                style={{ backgroundColor: n === uPage ? '#222' : '#fff', color: n === uPage ? '#fff' : '#333', borderColor: n === uPage ? '#222' : '#ddd' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setUPage(p => Math.min(totalPages, p + 1))} disabled={uPage === totalPages}
              className="px-4 py-2 text-xs rounded border transition-colors"
              style={{ backgroundColor: '#fff', color: uPage === totalPages ? '#ccc' : '#333', borderColor: '#ddd', cursor: uPage === totalPages ? 'not-allowed' : 'pointer' }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
