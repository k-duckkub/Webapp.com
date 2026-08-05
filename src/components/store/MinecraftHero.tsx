export function MinecraftHero() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#0d1117', minHeight: 440 }}>
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1020 100%)' }} />
        <div className="w-2/5" style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)' }} />
      </div>

      {/* Decorative corner borders like Minecraft UI */}
      <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: '#F97316' }} />
      <div className="absolute top-4 right-8 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: '#F97316', opacity: 0.4 }} />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: '#F97316' }} />

      {/* Right panel placeholder art */}
      <div className="absolute right-0 top-0 w-2/5 h-full flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-3">
          {/* Blocky character placeholders */}
          {[
            { size: 120, color: '#7C3AED', off: '-16px' },
            { size: 90,  color: '#DC2626', off: '16px'  },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-sm shadow-xl"
              style={{
                width: c.size, height: c.size * 1.3,
                background: `linear-gradient(145deg, ${c.color}bb, ${c.color}44)`,
                border: `2px solid ${c.color}66`,
                transform: `translateX(${c.off})`,
                position: 'absolute',
                top: i === 0 ? '10%' : '45%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Left content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col justify-between" style={{ minHeight: 440 }}>
        {/* Top art area placeholder */}
        <div className="w-3/5 h-52 rounded-sm overflow-hidden flex items-center justify-center relative"
          style={{ background: 'radial-gradient(ellipse at 40% 60%, #7C3AED33 0%, transparent 70%), radial-gradient(ellipse at 70% 30%, #F9731622 0%, transparent 60%), #0d1117' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <span className="text-6xl font-black select-none" style={{ color: '#F97316', opacity: 0.15, letterSpacing: '-4px' }}>HAMSTORE</span>
        </div>

        {/* Bottom overlay card */}
        <div className="mt-4 max-w-sm p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid #2a2520' }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#F97316' }}>HamStore · ของที่ซื้อได้</p>
          <h1 className="font-black text-white text-2xl leading-tight mb-2">
            เลือก Asset<br />ที่พร้อมใช้งาน
          </h1>
          <p className="text-xs mb-3" style={{ color: '#a09880' }}>
            รวม 179 assets คุณภาพสูง — ใช้ HamCoin เพื่อปลดล็อก และนำไปใช้ใน project ของคุณทันที
          </p>
          <button className="text-xs font-black px-5 py-2 rounded text-white flex items-center gap-2" style={{ backgroundColor: '#F97316' }}>
            ดู ASSET ทั้งหมด <span>›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
