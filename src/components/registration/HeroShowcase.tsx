import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'

function PhoneSVG() {
  return (
    <svg width="56" height="96" viewBox="0 0 56 96" aria-hidden>
      <defs>
        <linearGradient id="sc-ph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="100%" stopColor="#EDE8E0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="54" height="94" rx="14" fill="white" stroke="#E0D8D0" strokeWidth="1.5" />
      <rect x="54" y="26" width="3" height="10" rx="1.5" fill="#D8D0C8" />
      <rect x="-1" y="22" width="3" height="8"  rx="1.5" fill="#D8D0C8" />
      <rect x="-1" y="34" width="3" height="8"  rx="1.5" fill="#D8D0C8" />
      <rect x="6"  y="12" width="44" height="68" rx="4" fill="url(#sc-ph)" />
      <rect x="18" y="4"  width="20" height="6" rx="3" fill="#E0D8D0" />
      <rect x="20" y="87" width="16" height="4" rx="2" fill="#E0D8D0" />
      <rect x="10" y="17" width="36" height="8" rx="4" fill="#DDD4C4" />
      <rect x="10" y="29" width="24" height="4" rx="2" fill="#E8E0D4" />
      <rect x="10" y="37" width="36" height="26" rx="8" fill="#D4C8B0" />
      <rect x="10" y="68" width="36" height="6" rx="3" fill="#DDD4C4" />
      <rect x="10" y="78" width="20" height="3" rx="1.5" fill="#E8E0D4" />
    </svg>
  )
}

export function HeroShowcase() {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const prev = imgUrl
    setImgUrl(URL.createObjectURL(file))
    if (prev) URL.revokeObjectURL(prev)
    e.target.value = ''
  }

  return (
    <div
      className="absolute right-6 top-5 bottom-0 w-[55%] bg-white rounded-t-[22px] overflow-hidden
                 cursor-pointer group z-[2]"
      style={{
        boxShadow: '0 -8px 40px rgba(0,0,0,.11), 5px 0 20px rgba(0,0,0,.06)',
        transform: 'perspective(900px) rotateX(3deg) rotateY(-2deg)',
        transformOrigin: 'bottom center',
      }}
      onClick={() => inputRef.current?.click()}
      title="คลิกเพื่อเปลี่ยนรูป"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {imgUrl ? (
        /* Uploaded image — fills the whole card */
        <img
          src={imgUrl}
          alt="showcase"
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        /* Default 4-cell grid */
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2.5 p-3.5">

          {/* Phone mockup */}
          <div className="rounded-2xl bg-[#F0E8DC] flex items-center justify-center p-3">
            <PhoneSVG />
          </div>

          {/* Typography T */}
          <div className="rounded-2xl bg-[#F9F7F2] border-2 border-dashed border-[#E0D8CC]
                          flex flex-col items-center justify-center gap-1">
            <span className="text-[52px] font-black leading-none text-text-head"
                  style={{ fontFamily: 'Georgia, serif' }}>T</span>
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-9 h-[3px] bg-accent rounded-full" />
              <span className="text-[7px] font-bold text-text-muted tracking-[2px] uppercase"
                    style={{ fontFamily: 'monospace' }}>Type</span>
            </div>
            <div className="flex flex-col gap-1 mt-1.5 w-4/5 opacity-40">
              <div className="h-[3px] bg-text-muted rounded-full w-full" />
              <div className="h-[2px] bg-text-muted rounded-full w-3/4" />
              <div className="h-[2px] bg-text-muted rounded-full w-1/2" />
            </div>
          </div>

          {/* Play button */}
          <div className="rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#D48A10,#C47008)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,.22)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            </div>
          </div>

          {/* Toggle + slider */}
          <div className="rounded-2xl bg-[#F4F2EC] flex flex-col items-center justify-center gap-3 p-3">
            <div className="w-12 h-6 rounded-full flex items-center px-1 justify-end"
                 style={{ background: '#E0A152', boxShadow: '0 2px 8px rgba(224,161,82,.35)' }}>
              <div className="w-[18px] h-[18px] bg-white rounded-full"
                   style={{ boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
            </div>
            <div className="relative w-[60px] h-[6px] rounded-full bg-[#E0DDD8]">
              <div className="absolute left-0 top-0 h-full w-[60%] bg-accent rounded-full" />
              <div className="absolute w-[14px] h-[14px] bg-white rounded-full border-2 border-accent"
                   style={{ left: 'calc(60% - 7px)', top: '-4px', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
            </div>
            <div className="flex justify-between w-[60px]">
              <span className="text-[8px] font-semibold text-text-muted">0</span>
              <span className="text-[8px] font-semibold text-text-muted">100</span>
            </div>
          </div>

        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-t-[22px]
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
           style={{ background: 'rgba(0,0,0,.28)' }}>
        <div className="flex flex-col items-center gap-1.5">
          <Camera size={28} color="white" strokeWidth={1.8} />
          <span className="text-white text-[11px] font-semibold drop-shadow">เปลี่ยนรูป</span>
        </div>
      </div>
    </div>
  )
}
