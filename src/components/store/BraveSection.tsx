export function BraveSection() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#0d1117', minHeight: 300 }}>
      <div className="absolute inset-0 flex">
        <div className="w-3/5" style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a2040 0%, #0d1117 70%)' }} />
        <div className="flex-1" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a0f00 100%)' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-5 gap-8 items-center">
        {/* Left: art */}
        <div className="col-span-3 h-56 rounded flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7C3AED22 0%, #0d1117 100%)', border: '1px solid #2a2520' }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <span className="text-8xl font-black select-none" style={{ color: '#7C3AED', opacity: 0.3 }}>VFX</span>
        </div>
        {/* Right: text */}
        <div className="col-span-2 flex flex-col gap-4">
          <h2 className="font-black text-white leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            สร้างเกมของ<br />คุณวันนี้เลย
          </h2>
          <p className="text-sm" style={{ color: '#a09880' }}>
            Pre-order HamsterHub Pro และรับ asset พิเศษ 3 ชิ้น พร้อม skin ตัวละคร และ SFX bundle ฟรี
          </p>
          <button className="self-start text-xs font-black px-5 py-2.5 rounded text-white flex items-center gap-2"
            style={{ backgroundColor: '#F97316' }}>
            PRE-ORDER NOW ›
          </button>
        </div>
      </div>
    </div>
  )
}
