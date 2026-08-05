export function Navbar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <nav style={{ backgroundColor: '#141414', borderBottom: '1px solid #222' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span className="text-white font-black text-lg tracking-tight select-none">🐹 HamsterHub</span>
          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'store', label: 'ของที่ซื้อได้' },
              { id: 'unity', label: 'Unity Assets' },
              { id: 'course', label: 'หลักสูตร' },
              { id: 'showcase', label: 'Project Showcase' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { if (item.id === 'store' || item.id === 'unity') setActiveTab(item.id) }}
                className="px-4 py-1 text-sm font-medium rounded transition-colors relative"
                style={{ color: activeTab === item.id ? '#F97316' : '#b0a898' }}
              >
                {item.label}
                {(item.id === 'store' || item.id === 'unity') && activeTab === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5" style={{ backgroundColor: '#F97316' }} />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-semibold px-3 py-1.5 rounded" style={{ color: '#b0a898', backgroundColor: '#242220' }}>เข้าสู่ระบบ</button>
          <button className="text-xs font-bold px-3 py-1.5 rounded text-white" style={{ backgroundColor: '#F97316' }}>เริ่มต้นเลย →</button>
        </div>
      </div>
    </nav>
  )
}
