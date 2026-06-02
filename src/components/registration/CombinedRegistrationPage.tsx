import { useCallback, useEffect, useRef, useState } from 'react'
import { Settings, User, ChevronRight } from 'lucide-react'
import { TrustCard } from './TrustCard'

// ── Types ───────────────────────────────────────────────────────────────────
type FaceState = 'normal' | 'popped' | 'happy' | 'shy'

interface Step {
  speech: string
  placeholder: string
  inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode']
  inputType: string
  icon: React.ReactNode
  field: string
  optional: boolean
}

const STEPS: Step[] = [
  { speech: 'ยินดีที่ได้รู้จักครับ!\nขอทราบ ชื่อจริง ของคุณหน่อยนะครับ 🐾',
    placeholder: 'ตัวอย่าง: สมชาย', inputMode: 'text', inputType: 'text',
    icon: <User size={16} color="#6366F1" />, field: 'firstName', optional: false },
  { speech: 'เยี่ยมมากเลยครับ!\nแล้วขอ ชื่อเล่น ด้วยนะครับ 😊',
    placeholder: 'ตัวอย่าง: ชาย', inputMode: 'text', inputType: 'text',
    icon: <User size={16} color="#6366F1" />, field: 'nickname', optional: false },
  { speech: 'น่ารักมากเลย!\nคุณ อายุ เท่าไหร่ครับ? 🎂',
    placeholder: 'ตัวอย่าง: 25', inputMode: 'numeric', inputType: 'text',
    icon: <User size={16} color="#6366F1" />, field: 'age', optional: false },
  { speech: 'เก่งมากครับ!\nขอ เบอร์โทรศัพท์ ด้วยนะครับ 📱',
    placeholder: 'ตัวอย่าง: 081-234-5678', inputMode: 'tel', inputType: 'tel',
    icon: <User size={16} color="#6366F1" />, field: 'phone', optional: false },
  { speech: 'เกือบเสร็จแล้วครับ!\nมี โค้ดพิเศษ ไหมครับ? 🎟️',
    placeholder: 'ตัวอย่าง: HAMSTER2024', inputMode: 'text', inputType: 'text',
    icon: <User size={16} color="#6366F1" />, field: 'code', optional: true },
]

const HEARTS = ['❤️', '💕', '💖', '💗', '💝', '💓', '🩷', '🌸']
const TOTAL = STEPS.length
const SHY_THRESHOLD = 50

// ── Hamster SVG — pixel-art reference: big eyes, chubby cheeks, hoodie, pencil ─
function HamsterSVG({ face }: { face: FaceState }) {
  const bl = face === 'popped' ? 0.78 : face === 'happy' ? 0.38 : face === 'shy' ? 0.9 : 0
  return (
    <svg viewBox="0 0 240 260" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
      <defs>
        {/* orange-gold fur */}
        <radialGradient id="hg" cx="38%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#FCD070"/><stop offset="55%" stopColor="#F59028"/><stop offset="100%" stopColor="#D07010"/>
        </radialGradient>
        {/* cream face patch */}
        <radialGradient id="fg" cx="50%" cy="36%" r="60%">
          <stop offset="0%" stopColor="#FFFAF2"/><stop offset="100%" stopColor="#F8E2C4"/>
        </radialGradient>
        {/* dark eye */}
        <radialGradient id="eg" cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#1A1A2E"/><stop offset="100%" stopColor="#060610"/>
        </radialGradient>
        {/* base glow */}
        <radialGradient id="bg" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity=".58"/><stop offset="100%" stopColor="#38BDF8" stopOpacity="0"/>
        </radialGradient>
        {/* pencil yellow */}
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C8A000"/><stop offset="22%" stopColor="#FFE135"/>
          <stop offset="78%" stopColor="#FFE135"/><stop offset="100%" stopColor="#B09000"/>
        </linearGradient>
      </defs>

      {/* ── BASE GLOW ── */}
      <ellipse cx="116" cy="252" rx="86" ry="13" fill="url(#bg)"/>
      <ellipse cx="116" cy="249" rx="62" ry="8.5" fill="rgba(56,189,248,.3)"/>

      {/* ── HOODIE BODY ── */}
      <path d="M50 154 C30 170 26 214 24 257 L208 257 C206 214 202 170 182 154
               C165 141 144 133 116 132 C88 133 67 141 50 154Z" fill="#111827"/>
      {/* collar curve */}
      <path d="M80 154 Q116 140 152 154 Q141 134 116 131 Q91 134 80 154Z" fill="#1F2937"/>
      {/* center zip */}
      <line x1="116" y1="154" x2="116" y2="257" stroke="#1F2937" strokeWidth="2.5"/>
      {/* kangaroo front pocket */}
      <path d="M70 192 Q116 205 162 192 Q167 210 116 215 Q65 210 70 192Z" fill="#1F2937"/>
      {/* hoodie drawstring */}
      <path d="M100 150 Q116 158 132 150" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="100" cy="150" r="3" fill="#374151"/><circle cx="132" cy="150" r="3" fill="#374151"/>

      {/* ── LAPTOP SCREEN LID (behind head — rendered before head) ── */}
      <path d="M26 185 L42 137 L198 137 L214 185Z" fill="#13131D"/>
      <path d="M32 183 L46 141 L190 141 L204 183Z" fill="#0D1117"/>
      {/* traffic-light top bar */}
      <rect x="32" y="141" width="172" height="6" rx="2" fill="#191928" opacity=".55"/>
      <circle cx="40" cy="144" r="2.2" fill="#FF5F57"/>
      <circle cx="47" cy="144" r="2.2" fill="#FEBC2E"/>
      <circle cx="54" cy="144" r="2.2" fill="#28C840"/>
      {/* code lines (left) */}
      <rect x="52" y="150" width="32" height="2.5" rx="1.2" fill="#3B82F6" opacity=".9"/>
      <rect x="52" y="156" width="22" height="2.5" rx="1.2" fill="#F97316" opacity=".8"/>
      <rect x="52" y="162" width="28" height="2.5" rx="1.2" fill="#34D399" opacity=".7"/>
      <rect x="52" y="168" width="18" height="2.5" rx="1.2" fill="#A78BFA" opacity=".6"/>
      <rect x="52" y="174" width="24" height="2.5" rx="1.2" fill="#3B82F6" opacity=".5"/>
      {/* AI text center */}
      <text x="150" y="164" textAnchor="middle" dominantBaseline="middle"
        fill="#60A5FA" fontSize="28" fontWeight="900"
        fontFamily="system-ui,-apple-system,sans-serif" letterSpacing="3">AI</text>
      <ellipse cx="150" cy="170" rx="33" ry="8" fill="rgba(96,165,250,.18)"/>
      {/* </> orange */}
      <text x="150" y="180" textAnchor="middle"
        fill="#F97316" fontSize="10" fontWeight="900" fontFamily="monospace">{'</>'}</text>

      {/* ── KEYBOARD ── */}
      <rect x="16" y="183" width="210" height="34" rx="11" fill="#13131D"/>
      <rect x="22" y="187" width="198" height="26" rx="6.5" fill="#1E1E32"/>
      {[28,44,60,76,92,108,124,140,156,172,188,204].map((x,i) => (
        <rect key={`k1-${i}`} x={x} y={189} width={14} height={9} rx="3" fill="#0E0E1E"/>
      ))}
      {[32,48,64,80,96,112,128,144,160,176,192].map((x,i) => (
        <rect key={`k2-${i}`} x={x} y={201} width={14} height={6} rx="2.5" fill="#0E0E1E"/>
      ))}
      <rect x="16" y="181" width="210" height="4" rx="2" fill="#28283C"/>

      {/* ── EARS (on top of head) ── */}
      <circle cx="62" cy="16" r="30" fill="url(#hg)"/>
      <circle cx="62" cy="16" r="20" fill="#F5A8B8"/>
      <circle cx="62" cy="16" r="11" fill="#E07090" opacity=".65"/>
      <circle cx="170" cy="16" r="30" fill="url(#hg)"/>
      <circle cx="170" cy="16" r="20" fill="#F5A8B8"/>
      <circle cx="170" cy="16" r="11" fill="#E07090" opacity=".65"/>

      {/* ── HEAD ── */}
      <circle cx="116" cy="83" r="78" fill="url(#hg)"/>
      {/* top shine */}
      <ellipse cx="88" cy="33" rx="32" ry="16" fill="white" opacity=".14" transform="rotate(-14 88 33)"/>

      {/* ── CHUBBY HAMSTER POUCHES ── */}
      <ellipse cx="18" cy="102" rx="42" ry="32" fill="#E88020"/>
      <ellipse cx="214" cy="102" rx="42" ry="32" fill="#E88020"/>
      <ellipse cx="10" cy="95"  rx="18" ry="12" fill="#FBA850" opacity=".34"/>
      <ellipse cx="206" cy="95" rx="18" ry="12" fill="#FBA850" opacity=".34"/>

      {/* ── FACE CREAM PATCH ── */}
      <ellipse cx="116" cy="99" rx="59" ry="51" fill="url(#fg)"/>

      {/* ── LEFT PAW ── */}
      <ellipse cx="60" cy="204" rx="24" ry="15" fill="#E88020"/>
      <ellipse cx="60" cy="201" rx="16" ry="10" fill="#FEF2DA"/>
      <circle cx="51" cy="199" r="4.2" fill="#F0A060"/>
      <circle cx="60" cy="197" r="4.2" fill="#F0A060"/>
      <circle cx="69" cy="199" r="4.2" fill="#F0A060"/>

      {/* ── PENCIL ── */}
      <g transform="translate(168,178) rotate(20)">
        <rect x="-7.5" y="15" width="15" height="18" rx="4" fill="#FFB3C6"/>
        <rect x="-8" y="2"  width="16" height="15" rx="3" fill="#ADADBE"/>
        <rect x="-7.5" y="4.5" width="15" height="5.5" rx="1.5" fill="#CFCFDC" opacity=".65"/>
        <rect x="-7.5" y="-150" width="15" height="154" fill="url(#pg)"/>
        <rect x="-7.5" y="-150" width="5.5" height="154" fill="#9A7800" opacity=".33"/>
        <rect x="4"   y="-150" width="3.5" height="154" fill="#FFFDE7" opacity=".44"/>
        <polygon points="-7.5,-150 7.5,-150 0,-177" fill="#D4935A"/>
        <polygon points="-7.5,-150 0,-150 0,-177" fill="#9C5020" opacity=".38"/>
        <polygon points="-3.5,-173 3.5,-173 0,-183" fill="#2D2D2D"/>
        <polygon points="-1.5,-173 0,-173 0,-183" fill="#555" opacity=".35"/>
      </g>

      {/* ── RIGHT PAW (grips pencil) ── */}
      <ellipse cx="158" cy="204" rx="24" ry="15" fill="#E88020"/>
      <ellipse cx="158" cy="201" rx="16" ry="10" fill="#FEF2DA"/>
      <circle cx="149" cy="199" r="4.2" fill="#F0A060"/>
      <circle cx="158" cy="197" r="4.2" fill="#F0A060"/>
      <circle cx="167" cy="199" r="4.2" fill="#F0A060"/>

      {/* ── GLASSES ── */}
      <circle cx="82"  cy="86" r="29" fill="rgba(0,0,0,.07)"/>
      <circle cx="150" cy="86" r="29" fill="rgba(0,0,0,.07)"/>
      <circle cx="82"  cy="84" r="29" fill="rgba(215,230,255,.08)" stroke="#0F0F18" strokeWidth="5.5"/>
      <circle cx="150" cy="84" r="29" fill="rgba(215,230,255,.08)" stroke="#0F0F18" strokeWidth="5.5"/>
      <path d="M111 84 C113 79 115 79 117 84" fill="none" stroke="#0F0F18" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M53  84 C44 77 40 67 36 57" fill="none" stroke="#0F0F18" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M179 84 C188 77 192 67 196 57" fill="none" stroke="#0F0F18" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M65 69 Q75 62 85 66" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M133 69 Q143 62 153 66" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── EYES — state dependent ── */}
      {face === 'normal' && <>
        {/* BIG anime eyes */}
        <circle cx="82"  cy="84" r="24.5" fill="white"/>
        <circle cx="84"  cy="86" r="16.5" fill="url(#eg)"/>
        <circle cx="91"  cy="77" r="10"   fill="white"/>
        <circle cx="77"  cy="93" r="4.5"  fill="rgba(255,255,255,.48)"/>
        <circle cx="150" cy="84" r="24.5" fill="white"/>
        <circle cx="152" cy="86" r="16.5" fill="url(#eg)"/>
        <circle cx="159" cy="77" r="10"   fill="white"/>
        <circle cx="145" cy="93" r="4.5"  fill="rgba(255,255,255,.48)"/>
      </>}

      {face === 'popped' && <>
        {/* cute sparkling eyes — tap reaction */}
        <circle cx="82"  cy="84" r="27"  fill="white"/>
        <circle cx="84"  cy="86" r="19"  fill="url(#eg)"/>
        <circle cx="92"  cy="75" r="12"  fill="white"/>
        <circle cx="77"  cy="94" r="5.5" fill="rgba(255,255,255,.5)"/>
        {/* ✦ gold sparkle L */}
        <polygon points="110,50 112.5,54 116.5,54 113.5,56.5 114.5,60.5 110,58 105.5,60.5 106.5,56.5 103.5,54 107.5,54" fill="#FBBF24"/>
        <circle cx="150" cy="84" r="27"  fill="white"/>
        <circle cx="152" cy="86" r="19"  fill="url(#eg)"/>
        <circle cx="160" cy="75" r="12"  fill="white"/>
        <circle cx="145" cy="94" r="5.5" fill="rgba(255,255,255,.5)"/>
        {/* ✦ gold sparkle R */}
        <polygon points="178,47 180.5,51 184.5,51 181.5,53.5 182.5,57.5 178,55 173.5,57.5 174.5,53.5 171.5,51 175.5,51" fill="#FBBF24"/>
        {/* tiny purple sparkle top-center */}
        <polygon points="116,40 117.5,43 120.5,43 118,45.5 119,48.5 116,46.5 113,48.5 114,45.5 111.5,43 114.5,43" fill="#A5B4FC"/>
      </>}

      {face === 'happy' && <>
        {/* ^_^ arcs */}
        <path d="M56 86 Q82 61 108 86" fill="url(#eg)"/>
        <path d="M60 81 Q82 64 104 81" fill="none" stroke="rgba(255,255,255,.27)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M124 86 Q150 61 176 86" fill="url(#eg)"/>
        <path d="M128 81 Q150 64 172 81" fill="none" stroke="rgba(255,255,255,.27)" strokeWidth="3" strokeLinecap="round"/>
      </>}

      {face === 'shy' && <>
        <path d="M57 80 Q82 97 107 80" fill="none" stroke="#060610" strokeWidth="6.5" strokeLinecap="round"/>
        <path d="M125 80 Q150 97 175 80" fill="none" stroke="#060610" strokeWidth="6.5" strokeLinecap="round"/>
        <ellipse cx="107" cy="97" rx="5" ry="7" fill="#93C5FD" opacity=".9"/>
        <ellipse cx="150" cy="97" rx="5" ry="7" fill="#93C5FD" opacity=".9"/>
      </>}

      {/* ── NOSE ── */}
      <ellipse cx="116" cy="113" rx="12" ry="8.5" fill="#C05070"/>
      <ellipse cx="112" cy="110.5" rx="5" ry="3" fill="rgba(255,255,255,.62)"/>

      {/* ── BLUSH ── */}
      <ellipse cx="20"  cy="116" rx="20" ry="14" fill="#FF6B8A" opacity={bl}/>
      <ellipse cx="212" cy="116" rx="20" ry="14" fill="#FF6B8A" opacity={bl}/>

      {/* ── MOUTH ── */}
      {face === 'normal' && <>
        {/* excited "O" open mouth — matches reference */}
        <ellipse cx="116" cy="128" rx="14" ry="12" fill="#2C000E"/>
        <ellipse cx="116" cy="128" rx="10" ry="8.5" fill="#4A001E"/>
        <ellipse cx="113" cy="126" rx="4.5" ry="3"  fill="#FF8FAB" opacity=".38"/>
      </>}
      {face === 'popped' && (
        <path d="M101 124 Q116 132 131 124" fill="none" stroke="#A03050" strokeWidth="3.5" strokeLinecap="round"/>
      )}
      {face === 'happy' && <>
        <path d="M93 122 Q116 143 139 122" fill="none" stroke="#A03050" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M97 125 Q116 141 135 125 L135 133 Q116 148 97 133Z" fill="white"/>
        <line x1="116" y1="125" x2="116" y2="133" stroke="rgba(0,0,0,.07)" strokeWidth="2"/>
      </>}
      {face === 'shy' && (
        <path d="M100 126 Q109 133 116 129 Q123 125 132 131"
          fill="none" stroke="#A03050" strokeWidth="3" strokeLinecap="round"/>
      )}
    </svg>
  )
}


// ── Success Overlay ──────────────────────────────────────────────────────────
function SuccessOverlay({ score, firstName, nickname }: { score: number; firstName: string; nickname: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 700,
      background: 'rgba(99,102,241,.14)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn .3s ease',
    }}>
      <div style={{
        background: 'white', borderRadius: 32, padding: '32px 28px', textAlign: 'center',
        maxWidth: 'min(340px, 92vw)', boxShadow: '0 28px 56px rgba(0,0,0,.14)',
        animation: 'popIn .4s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <div style={{ width: 100, height: 100, margin: '0 auto', animation: 'wiggle 1.1s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <ellipse cx="50" cy="113" rx="23" ry="4" fill="rgba(0,0,0,.08)" />
            <ellipse cx="50" cy="90" rx="28" ry="23" fill="#F7C17A" />
            <ellipse cx="50" cy="93" rx="18" ry="14" fill="#FDEBD0" />
            <ellipse cx="24" cy="99" rx="11" ry="8" fill="#F0B060" /><ellipse cx="76" cy="99" rx="11" ry="8" fill="#F0B060" />
            <ellipse cx="15" cy="35" rx="13" ry="15" fill="#E8A050" /><ellipse cx="15" cy="35" rx="8" ry="10" fill="#F5B8C0" />
            <ellipse cx="85" cy="35" rx="13" ry="15" fill="#E8A050" /><ellipse cx="85" cy="35" rx="8" ry="10" fill="#F5B8C0" />
            <ellipse cx="50" cy="55" rx="36" ry="33" fill="#F7C17A" />
            <ellipse cx="12" cy="66" rx="14" ry="11" fill="#F4D4A0" /><ellipse cx="88" cy="66" rx="14" ry="11" fill="#F4D4A0" />
            <ellipse cx="50" cy="42" rx="22" ry="14" fill="#FDEBD0" opacity=".5" />
            <path d="M27 51 Q36 41 45 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M55 51 Q64 41 73 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
            <circle cx="15" cy="69" r="11" fill="#FB7185" opacity=".5" />
            <circle cx="85" cy="69" r="11" fill="#FB7185" opacity=".5" />
            <ellipse cx="50" cy="61" rx="5.5" ry="3.5" fill="#D06070" />
            <path d="M40 66 Q50 77 60 66" fill="none" stroke="#B05060" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M43 68 Q50 74 57 68 L57 72 Q50 77 43 72Z" fill="white" />
            <rect x="24" y="21" width="52" height="7.5" rx="3.5" fill="#1E1E2E" />
            <polygon points="50,7 77,22 50,22 23,22" fill="#1E1E2E" />
            <line x1="77" y1="22" x2="77" y2="32" stroke="#FBBF24" strokeWidth="2.5" />
            <circle cx="77" cy="34" r="3.5" fill="#FBBF24" />
            <line x1="74" y1="36" x2="71" y2="43" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="77" y1="37" x2="77" y2="44" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="36" x2="83" y2="43" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="7" r="2.8" fill="#FBBF24" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1F2937', margin: '10px 0 5px' }}>ลงทะเบียนสำเร็จ! 🎉</h2>
        <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>ขอบคุณมากเลยครับ แฮมสเตอร์ดีใจมาก~ 💕</p>
        <div style={{
          background: 'linear-gradient(135deg,#EEF2FF,#DBEAFE)',
          borderRadius: 18, padding: '14px 20px', margin: '14px 0',
        }}>
          <div style={{ fontSize: '.75rem', color: '#6B7280' }}>Tap Bonus Points</div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#3B82F6' }}>{score}</div>
          <div style={{ fontSize: '.75rem', color: '#6B7280' }}>แต้มโบนัสเริ่มต้น</div>
        </div>
        <div style={{ fontSize: '.86rem', color: '#6B7280', lineHeight: 1.65 }}>
          ยินดีต้อนรับ <strong style={{ color: '#1F2937' }}>{firstName || 'เพื่อน'}{nickname ? ` (${nickname})` : ''}</strong>!<br />
          แต้มโบนัสของคุณคือ <strong style={{ color: '#1F2937' }}>{score}</strong> แต้ม 🎊
        </div>
      </div>
    </div>
  )
}

// ── Left Panel ───────────────────────────────────────────────────────────────
function NewLeftPanel() {
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
    <div style={{
      background: '#E8EEFF',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      borderRadius: '32px 0 0 32px',
      minHeight: 720,
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: 192, height: 192, top: -32, left: -48, background: 'white', borderRadius: '50%', opacity: .25, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 144, height: 144, bottom: 80, right: -24, background: '#C7D2FE', borderRadius: '50%', opacity: .4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 96, height: 96, top: '40%', left: '8%', background: 'white', borderRadius: '50%', opacity: .2, pointerEvents: 'none' }} />

      {/* Gear icon */}
      <div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 2,
        width: 36, height: 36, background: 'white', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(99,102,241,.12)',
      }}>
        <Settings size={16} color="#6B7280" />
      </div>

      {/* Sparkles */}
      <span style={{ position: 'absolute', top: '12%', left: '72%', fontSize: '1.1rem', color: '#FBBF24', pointerEvents: 'none', zIndex: 2 }}>✦</span>
      <span style={{ position: 'absolute', top: '28%', right: '8%', fontSize: '.85rem', color: '#FBBF24', opacity: .7, pointerEvents: 'none', zIndex: 2 }}>✦</span>
      <span style={{ position: 'absolute', top: '65%', left: '78%', fontSize: '.7rem', color: '#A5B4FC', opacity: .8, pointerEvents: 'none', zIndex: 2 }}>✦</span>
      <span style={{ position: 'absolute', top: '75%', left: '12%', fontSize: '1rem', color: '#FBBF24', opacity: .6, pointerEvents: 'none', zIndex: 2 }}>✦</span>

      {/* Main content: image card + play button, flex-1 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '64px 28px 28px' }}>

        {/* Upload card */}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: '82%', aspectRatio: '1 / 1',
            background: 'white', borderRadius: 24,
            boxShadow: '0 8px 32px rgba(99,102,241,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden',
            position: 'relative',
          }}
        >
          {imgUrl ? (
            <img src={imgUrl} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 22 }} draggable={false} />
          ) : (
            <span style={{ fontSize: 40, fontWeight: 700, color: '#1F2937', userSelect: 'none', fontFamily: 'Sarabun, sans-serif' }}>
              ใส่รูปได้
            </span>
          )}
        </div>

        {/* Play button — right side, vertically centered on card */}
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            position: 'absolute', right: 8,
            width: 52, height: 52, borderRadius: '50%',
            background: 'white', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,.12)',
            zIndex: 3,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1F2937">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </button>
      </div>

      {/* Trust bar */}
      <TrustCard />
    </div>
  )
}

// ── Right Panel ──────────────────────────────────────────────────────────────
interface RightPanelProps {
  tapScore: number
  curStep: number
  face: FaceState
  isHamPop: boolean
  ripples: number[]
  bubbleText: string
  bubbleAnim: 'in' | 'out' | null
  inputVal: string
  shaking: boolean
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  onInputChange: (v: string) => void
  onInputKeyDown: (e: React.KeyboardEvent) => void
  onNext: () => void
  onSkip: () => void
  onPointerDown: (e: React.PointerEvent) => void
  hamWrapRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  hamImgUrl: string | null
  hamInputRef: React.RefObject<HTMLInputElement>
  onHamsterFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function NewRightPanel({
  tapScore, curStep, face, isHamPop, ripples,
  bubbleText, bubbleAnim, inputVal, shaking, isFocused,
  onFocus, onBlur, onInputChange, onInputKeyDown, onNext, onSkip,
  onPointerDown, hamWrapRef, inputRef,
  hamImgUrl, hamInputRef, onHamsterFileChange,
}: RightPanelProps) {
  const step = STEPS[curStep]
  const speechLines = bubbleText.split('\n')

  return (
    <div style={{
      background: '#D6E4FF',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      borderRadius: '0 32px 32px 0',
      minHeight: 720,
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: 208, height: 208, top: -32, right: -40, background: '#BFDBFE', borderRadius: '50%', opacity: .5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 128, height: 128, bottom: 160, left: -20, background: '#C7D2FE', borderRadius: '50%', opacity: .4, pointerEvents: 'none' }} />

      {/* Floating "b" */}
      <span style={{
        position: 'absolute', top: 20, left: 24, zIndex: 2,
        fontSize: 72, fontWeight: 900, color: '#1F2937', lineHeight: 1,
        fontFamily: 'system-ui, sans-serif', pointerEvents: 'none',
      }}>b</span>

      {/* Floating "p" */}
      <span style={{
        position: 'absolute', top: '22%', left: 16, zIndex: 2,
        fontSize: 72, fontWeight: 900, color: '#F97316', lineHeight: 1,
        fontFamily: 'system-ui, sans-serif', pointerEvents: 'none',
      }}>p</span>

      {/* AI badge */}
      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 2,
        background: '#3B5BF5', borderRadius: 10, padding: '4px 12px',
        display: 'flex', alignItems: 'center',
      }}>
        <span style={{ fontSize: '.85rem', fontWeight: 900, color: 'white', letterSpacing: '.02em', fontFamily: 'system-ui, sans-serif' }}>AI</span>
      </div>

      {/* Sparkles */}
      <span style={{ position: 'absolute', top: '5%', right: '20%', fontSize: '1rem', color: '#FBBF24', zIndex: 2, pointerEvents: 'none' }}>✦</span>
      <span style={{ position: 'absolute', top: '15%', right: '35%', fontSize: '.7rem', color: '#A5B4FC', zIndex: 2, pointerEvents: 'none' }}>✦</span>
      <span style={{ position: 'absolute', top: '38%', left: '8%', fontSize: '.85rem', color: '#FBBF24', zIndex: 2, pointerEvents: 'none' }}>✦</span>
      <span style={{ position: 'absolute', top: '45%', right: '12%', fontSize: '.7rem', color: '#FBBF24', zIndex: 2, pointerEvents: 'none' }}>✦</span>

      {/* Circuit decoration */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
           style={{ position: 'absolute', top: 12, right: '26%', zIndex: 2, opacity: .4, pointerEvents: 'none' }}>
        <circle cx="4" cy="4" r="2.5" fill="#93C5FD" />
        <circle cx="32" cy="4" r="2.5" fill="#93C5FD" />
        <circle cx="18" cy="18" r="2.5" fill="#60A5FA" />
        <circle cx="4" cy="32" r="1.5" fill="#93C5FD" />
        <line x1="4" y1="4" x2="18" y2="18" stroke="#93C5FD" strokeWidth="1" />
        <line x1="32" y1="4" x2="18" y2="18" stroke="#93C5FD" strokeWidth="1" />
        <line x1="4" y1="32" x2="18" y2="18" stroke="#93C5FD" strokeWidth=".8" strokeDasharray="2,2" />
      </svg>

      {/* Hamster tap area */}
      <input ref={hamInputRef} type="file" accept="image/*" className="hidden" onChange={onHamsterFileChange} />
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 56, paddingBottom: 4, position: 'relative' }}>
        <div
          ref={hamWrapRef}
          onPointerDown={onPointerDown}
          style={{
            position: 'relative', width: 240, height: 260,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            cursor: 'pointer', userSelect: 'none', touchAction: 'none',
          }}
        >
          {/* Glow halo */}
          <div style={{
            position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
            width: 180, height: 50,
            background: 'radial-gradient(ellipse, rgba(56,189,248,.52) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {/* Hamster */}
          <div style={{
            width: 220, height: 220, zIndex: 1,
            filter: isHamPop
              ? 'drop-shadow(0 4px 18px rgba(244,114,182,.65)) brightness(1.08)'
              : 'drop-shadow(0 10px 24px rgba(99,102,241,.22))',
            transform: isHamPop ? 'scale(1.12) translateY(-4px)' : undefined,
            animation: isHamPop ? 'none' : 'floatie 3s ease-in-out infinite',
            transition: 'transform .06s ease-out, filter .06s ease-out',
          }}>
            {hamImgUrl
              ? <img src={hamImgUrl} alt="hamster" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
              : <HamsterSVG face={face} />
            }
          </div>

          {/* Ripples */}
          {ripples.map(id => (
            <div key={id} style={{
              position: 'absolute', borderRadius: '50%',
              width: 200, height: 200, top: '50%', left: '50%', margin: '-100px',
              background: 'rgba(99,102,241,.14)', transform: 'scale(0)',
              pointerEvents: 'none', animation: 'ripAnim .6s ease-out forwards',
            }} />
          ))}
        </div>
      </div>

      {/* HUD row */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', padding: '10px 24px' }}>
        <HudBox label="TAP SCORE" value={tapScore} />
        <HudBox label="STEP" value={curStep + 1} suffix="/5" />
      </div>

      {/* Form card */}
      <div style={{
        background: 'white', margin: '8px 16px 16px',
        borderRadius: 24, padding: '18px 20px 20px',
        display: 'flex', flexDirection: 'column', gap: 13,
        flex: 1,
      }}>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              width: i === curStep ? 28 : 8, height: 8, borderRadius: 999,
              background: i < curStep ? '#93C5FD' : i === curStep ? '#3B82F6' : '#E5E7EB',
              transition: 'all .3s',
            }} />
          ))}
        </div>

        {/* Speech bubble */}
        <div style={{
          background: '#F8FAFF', borderRadius: 16, padding: '12px 16px',
          animation: bubbleAnim === 'out' ? 'swapOut .18s ease forwards'
            : bubbleAnim === 'in' ? 'swapIn .25s ease forwards' : undefined,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: '1rem' }}>🐹</span>
            <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#E0A152', letterSpacing: '.03em' }}>
              แฮมสเตอร์พูดว่า...
            </span>
          </div>
          <p style={{ fontSize: '.9rem', fontWeight: 700, color: '#1F2937', lineHeight: 1.55, margin: 0 }}>
            {speechLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </p>
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#EEF2FF', borderRadius: 14, padding: '0 16px', height: 48,
          boxShadow: isFocused ? '0 0 0 2px #818CF8' : 'none',
          transition: 'box-shadow .15s',
          animation: shaking ? 'shake .35s ease' : undefined,
        }}>
          {step.icon}
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            inputMode={step.inputMode}
            type={step.inputType}
            placeholder={step.placeholder}
            autoComplete="off"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', fontSize: '.93rem',
              color: '#1F2937', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onNext}
            style={{
              width: '100%', height: 52, border: 'none', borderRadius: 999,
              background: 'linear-gradient(90deg, #60A5FA, #93C5FD)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer', transition: 'filter .12s, transform .12s',
              boxShadow: '0 6px 20px rgba(96,165,250,.35)',
            }}
            onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(.97)' }}
            onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            <span style={{ fontSize: '.95rem', fontWeight: 700, color: 'white' }}>ถัดไป</span>
            <ChevronRight size={18} color="white" strokeWidth={2.5} />
          </button>
          {step.optional && (
            <button onClick={onSkip} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '.82rem', color: '#9CA3AF', fontFamily: 'inherit', textDecoration: 'underline', padding: '3px 8px',
              alignSelf: 'center',
            }}>
              ข้ามได้เลย →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── HUD box ──────────────────────────────────────────────────────────────────
function HudBox({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 18, padding: '10px 24px',
      textAlign: 'center', minWidth: 130,
      boxShadow: '0 4px 16px rgba(99,102,241,.10)',
    }}>
      <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#3B82F6', lineHeight: 1.1 }}>
        {value}{suffix && <span style={{ fontSize: '1rem', fontWeight: 600, color: '#9CA3AF' }}>{suffix}</span>}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function CombinedRegistrationPage() {
  const [tapScore, setTapScore] = useState(0)
  const [curStep, setCurStep] = useState(0)
  const [face, setFace] = useState<FaceState>('normal')
  const [isHamPop, setIsHamPop] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bubbleText, setBubbleText] = useState(STEPS[0].speech)
  const [bubbleAnim, setBubbleAnim] = useState<'in' | 'out' | null>(null)
  const [shaking, setShaking] = useState(false)
  const [isShyMode, setIsShyMode] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finalScore, setFinalScore] = useState(0)
  const [hamImgUrl, setHamImgUrl] = useState<string | null>(null)

  const tapScoreRef = useRef(0)
  const isPoppedRef = useRef(false)
  const isShyRef = useRef(false)
  const shyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const hamWrapRef = useRef<HTMLDivElement>(null)
  const hamInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const heartsLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { tapScoreRef.current = tapScore }, [tapScore])
  useEffect(() => { isShyRef.current = isShyMode }, [isShyMode])

  // Hamster image upload
  function handleHamsterFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const prev = hamImgUrl
    setHamImgUrl(URL.createObjectURL(file))
    if (prev) URL.revokeObjectURL(prev)
    e.target.value = ''
  }

  const playPopSound = useCallback(() => {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(680, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12)
    } catch { /* ignore */ }
  }, [])

  const spawnHearts = useCallback(() => {
    const wrap = hamWrapRef.current, layer = heartsLayerRef.current
    if (!wrap || !layer) return
    const rect = wrap.getBoundingClientRect()
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
    const count = Math.random() < 0.4 ? 1 : 2
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement('span')
        h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)]
        const dx = (Math.random() - 0.5) * 80, dy = -(55 + Math.random() * 60)
        h.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${(0.8 + Math.random()).toFixed(2)}rem;line-height:1;pointer-events:none;z-index:600;transform:translate(-50%,-50%);`
        layer.appendChild(h)
        h.animate([
          { transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx * 0.5}px),calc(-50% + ${dy * 0.45}px)) scale(1.4)`, opacity: 0.9, offset: 0.5 },
          { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.5)`, opacity: 0 },
        ], { duration: 1100, easing: 'ease-out', fill: 'forwards' }).addEventListener('finish', () => h.remove())
      }, i * 80)
    }
  }, [])

  const triggerShy = useCallback(() => {
    isShyRef.current = true; setIsShyMode(true)
    if (!isPoppedRef.current) setFace('shy')
    for (let i = 0; i < 8; i++) setTimeout(spawnHearts, i * 70)
    if (shyTimerRef.current) clearTimeout(shyTimerRef.current)
    shyTimerRef.current = setTimeout(() => {
      isShyRef.current = false; setIsShyMode(false)
      if (!isPoppedRef.current) setFace('normal')
    }, 3500)
  }, [spawnHearts])

  const onTap = useCallback(() => {
    setTapScore(prev => {
      const next = prev + 1
      tapScoreRef.current = next
      if (next === SHY_THRESHOLD) setTimeout(triggerShy, 0)
      return next
    })
    spawnHearts(); playPopSound()
  }, [spawnHearts, playPopSound, triggerShy])

  const spawnRipple = useCallback(() => {
    const id = Date.now()
    setRipples(r => [...r, id])
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 660)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (!isPoppedRef.current) {
      isPoppedRef.current = true
      setIsHamPop(true); setFace('popped')
      onTap(); spawnRipple()
    }
  }, [onTap, spawnRipple])

  useEffect(() => {
    const onUp = () => {
      if (isPoppedRef.current) {
        isPoppedRef.current = false
        setIsHamPop(false)
        setFace(isShyRef.current ? 'shy' : 'normal')
      }
    }
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => { window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp) }
  }, [])

  const loadStep = useCallback((step: number, animate: boolean) => {
    setCurStep(step); setInputVal('')
    if (animate) {
      setBubbleAnim('out')
      setTimeout(() => {
        setBubbleText(STEPS[step].speech); setBubbleAnim('in')
        setTimeout(() => setBubbleAnim(null), 280)
      }, 190)
    } else {
      setBubbleText(STEPS[step].speech)
    }
    setTimeout(() => inputRef.current?.focus(), 350)
  }, [])

  const advance = useCallback((val: string | null) => {
    const step = curStep
    setAnswers(prev => ({ ...prev, [STEPS[step].field]: val ?? '' }))
    setFace('happy')
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    tapTimerRef.current = setTimeout(() => setFace(isShyRef.current ? 'shy' : 'normal'), 700)
    if (step < TOTAL - 1) {
      loadStep(step + 1, true)
    } else {
      setTimeout(() => {
        setFinalScore(tapScoreRef.current); setShowSuccess(true)
        for (let i = 0; i < 14; i++) setTimeout(spawnHearts, i * 90)
      }, 400)
    }
  }, [curStep, loadStep, spawnHearts])

  const onNext = useCallback(() => {
    const val = inputVal.trim()
    if (!val) { setShaking(true); setTimeout(() => setShaking(false), 400); return }
    advance(val)
  }, [inputVal, advance])

  const onSkip = useCallback(() => advance(null), [advance])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px',
      background: 'linear-gradient(150deg, #EEF2FF 0%, #DBEAFE 100%)',
      fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
    }}>
      {/* Hearts layer */}
      <div ref={heartsLayerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 600 }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 1200, minHeight: 720,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderRadius: 32,
        boxShadow: '0 32px 80px rgba(99,102,241,.18), 0 0 0 1px rgba(255,255,255,.6) inset',
        overflow: 'hidden',
      }}>
        <NewLeftPanel />
        <NewRightPanel
          tapScore={tapScore}
          curStep={curStep}
          face={face}
          isHamPop={isHamPop}
          ripples={ripples}
          bubbleText={bubbleText}
          bubbleAnim={bubbleAnim}
          inputVal={inputVal}
          shaking={shaking}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInputChange={setInputVal}
          onInputKeyDown={e => e.key === 'Enter' && onNext()}
          onNext={onNext}
          onSkip={onSkip}
          onPointerDown={handlePointerDown}
          hamWrapRef={hamWrapRef}
          inputRef={inputRef}
          hamImgUrl={hamImgUrl}
          hamInputRef={hamInputRef}
          onHamsterFileChange={handleHamsterFile}
        />
      </div>

      {showSuccess && (
        <SuccessOverlay
          score={finalScore}
          firstName={answers.firstName || ''}
          nickname={answers.nickname || ''}
        />
      )}

      <style>{`
        @keyframes floatie { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
        @keyframes ripAnim  { to{transform:scale(2.4);opacity:0} }
        @keyframes swapOut  { to{opacity:0;transform:translateY(-8px)} }
        @keyframes swapIn   { from{opacity:0;transform:translateY(8px)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
        @keyframes popIn    { from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1} }
        @keyframes wiggle   { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
      `}</style>
    </div>
  )
}
