import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'

function BearSVG() {
  return (
    <svg viewBox="0 0 240 330" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="m-bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#E2CFA0" />
          <stop offset="100%" stopColor="#D4BF90" />
        </radialGradient>
        <linearGradient id="m-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECA020" />
          <stop offset="50%" stopColor="#D08810" />
          <stop offset="100%" stopColor="#B86C08" />
        </linearGradient>
        <linearGradient id="m-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A8450" />
          <stop offset="100%" stopColor="#6A5428" />
        </linearGradient>
        <linearGradient id="m-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303030" />
          <stop offset="100%" stopColor="#181818" />
        </linearGradient>
        <radialGradient id="m-hs" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,.16)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="240" height="330" fill="url(#m-bg)" />
      <ellipse cx="20"  cy="288" rx="100" ry="72" fill="#C8B478" opacity=".4" />
      <ellipse cx="200" cy="295" rx="90"  ry="65" fill="#BEAA68" opacity=".36" />
      <ellipse cx="120" cy="268" rx="110" ry="70" fill="#D0BC84" opacity=".32" />
      <ellipse cx="120" cy="315" rx="88" ry="22" fill="url(#m-rock)" />
      <path d="M42 315 Q80 290 120 285 Q160 290 198 315 Q175 324 120 327 Q65 324 42 315Z" fill="#7C6230" />
      <circle cx="82"  cy="148" r="26" fill="url(#m-fur)" />
      <circle cx="82"  cy="149" r="14" fill="#8C4808" opacity=".7" />
      <circle cx="158" cy="148" r="26" fill="url(#m-fur)" />
      <circle cx="158" cy="149" r="14" fill="#8C4808" opacity=".7" />
      <ellipse cx="120" cy="258" rx="54" ry="60" fill="url(#m-hood)" />
      <path d="M88 205 Q120 220 152 205 L162 228 Q120 242 78 228Z" fill="#1E1E1E" />
      <path d="M100 205 Q120 214 140 205 L148 218 Q120 228 92 218Z" fill="#262626" />
      <rect x="99" y="256" width="42" height="26" rx="8" fill="#151515" />
      <text x="120" y="274" textAnchor="middle" fontSize="12" fontWeight="900"
        fill="#D49020" fontFamily="monospace" letterSpacing="-0.5">[/]</text>
      <path d="M72 295 Q120 300 168 295 Q165 308 120 312 Q75 308 72 295Z" fill="#141414" />
      <circle cx="120" cy="188" r="60" fill="url(#m-fur)" />
      <ellipse cx="120" cy="230" rx="45" ry="12" fill="url(#m-hs)" />
      <ellipse cx="165" cy="195" rx="20" ry="48" fill="rgba(0,0,0,.08)" />
      <ellipse cx="108" cy="165" rx="22" ry="14" fill="rgba(255,255,255,.12)" />
      <ellipse cx="120" cy="208" rx="28" ry="21" fill="#C07518" opacity=".55" />
      <circle cx="98"  cy="184" r="14" fill="white" />
      <circle cx="142" cy="184" r="14" fill="white" />
      <circle cx="100" cy="186" r="9"  fill="#160A00" />
      <circle cx="144" cy="186" r="9"  fill="#160A00" />
      <circle cx="103" cy="182" r="3.5" fill="white" />
      <circle cx="147" cy="182" r="3.5" fill="white" />
      <circle cx="97"  cy="189" r="1.5" fill="white" opacity=".5" />
      <circle cx="141" cy="189" r="1.5" fill="white" opacity=".5" />
      <ellipse cx="120" cy="205" rx="10" ry="7" fill="#160A00" />
      <ellipse cx="117" cy="202" rx="3" ry="2.2" fill="white" opacity=".4" />
      <line x1="120" y1="212" x2="120" y2="216" stroke="#160A00" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 218 Q120 228 132 218" stroke="#160A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="88"  cy="205" rx="10" ry="6" fill="#E86020" opacity=".18" />
      <ellipse cx="152" cy="205" rx="10" ry="6" fill="#E86020" opacity=".18" />
      <path d="M70 240 Q52 256 56 278 Q62 285 72 278 Q69 262 84 250Z" fill="url(#m-fur)" />
      <path d="M170 240 Q186 254 184 276 Q178 283 169 276 Q173 261 158 250Z" fill="url(#m-fur)" />
      <g transform="rotate(32 155 240)">
        <rect x="144" y="130" width="22" height="20" rx="5" fill="#F49898" />
        <rect x="146" y="132" width="18" height="5" rx="2" fill="rgba(255,255,255,.3)" />
        <rect x="144" y="148" width="22" height="6"  fill="#D0D0D0" />
        <rect x="144" y="152" width="22" height="4"  fill="#B8B8B8" />
        <rect x="144" y="154" width="22" height="148" rx="3" fill="#F8D040" />
        <rect x="160" y="154" width="6"  height="148" fill="rgba(0,0,0,.07)" />
        <rect x="144" y="154" width="22" height="16"  rx="2" fill="#EDBE28" />
        <path d="M144 300 L166 300 L155 328Z" fill="#D8A870" />
        <path d="M149 318 L161 318 L155 328Z" fill="#3C3C3C" />
      </g>
    </svg>
  )
}

export function Mascot() {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const prev = imgUrl
    const url = URL.createObjectURL(file)
    setImgUrl(url)
    if (prev) URL.revokeObjectURL(prev)
    // reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      className="absolute bottom-0 left-6 w-[42%] z-[3] cursor-pointer group select-none"
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

      {/* Content: uploaded image or default bear */}
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="mascot"
          className="w-full h-full object-contain object-bottom"
          draggable={false}
        />
      ) : (
        <BearSVG />
      )}

      {/* Hover overlay — camera icon */}
      <div className="absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      rounded-2xl" style={{ background: 'rgba(0,0,0,.28)' }}>
        <div className="flex flex-col items-center gap-1.5">
          <Camera size={28} color="white" strokeWidth={1.8} />
          <span className="text-white text-[11px] font-semibold drop-shadow">เปลี่ยนรูป</span>
        </div>
      </div>
    </div>
  )
}
