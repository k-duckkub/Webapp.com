import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from './Badge'
import { Hero } from './Hero'
import { FeatureList } from './FeatureList'
import { HeroShowcase } from './HeroShowcase'
import { TrustCard } from './TrustCard'

// ── Types ──────────────────────────────────────────────────────────────────
type FaceState = 'normal' | 'popped' | 'happy' | 'shy'

interface Step {
  speech: string
  placeholder: string
  inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode']
  inputType: string
  icon: string
  field: string
  optional: boolean
}

const STEPS: Step[] = [
  { speech: 'ยินดีที่ได้รู้จักครับ!\nขอทราบ ชื่อจริง ของคุณหน่อยนะครับ 🐾',
    placeholder: 'ตัวอย่าง: สมชาย', inputMode: 'text', inputType: 'text',
    icon: '👤', field: 'firstName', optional: false },
  { speech: 'เยี่ยมมากเลยครับ!\nแล้วขอ ชื่อเล่น ด้วยนะครับ 😊',
    placeholder: 'ตัวอย่าง: ชาย', inputMode: 'text', inputType: 'text',
    icon: '😊', field: 'nickname', optional: false },
  { speech: 'น่ารักมากเลย!\nคุณ อายุ เท่าไหร่ครับ? 🎂',
    placeholder: 'ตัวอย่าง: 25', inputMode: 'numeric', inputType: 'text',
    icon: '🎂', field: 'age', optional: false },
  { speech: 'เก่งมากครับ!\nขอ เบอร์โทรศัพท์ ด้วยนะครับ 📱',
    placeholder: 'ตัวอย่าง: 081-234-5678', inputMode: 'tel', inputType: 'tel',
    icon: '📱', field: 'phone', optional: false },
  { speech: 'เกือบเสร็จแล้วครับ!\nมี โค้ดพิเศษ ไหมครับ? 🎟️',
    placeholder: 'ตัวอย่าง: HAMSTER2024', inputMode: 'text', inputType: 'text',
    icon: '🎟️', field: 'code', optional: true },
]

const HEARTS = ['❤️', '💕', '💖', '💗', '💝', '💓', '🩷', '🌸']
const TOTAL = STEPS.length
const SHY_THRESHOLD = 50

// ── Hamster SVG ─────────────────────────────────────────────────────────────
function HamsterSVG({ face }: { face: FaceState }) {
  const blushOpacity = face === 'popped' ? 0.4 : face === 'happy' ? 0.3 : face === 'shy' ? 0.8 : 0

  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
      <ellipse cx="50" cy="113" rx="24" ry="4.5" fill="rgba(0,0,0,.1)" />
      <ellipse cx="50" cy="90" rx="28" ry="23" fill="#F7C17A" />
      <ellipse cx="50" cy="93" rx="18" ry="14" fill="#FDEBD0" />
      <ellipse cx="24" cy="99" rx="11" ry="8" fill="#F0B060" />
      <ellipse cx="76" cy="99" rx="11" ry="8" fill="#F0B060" />
      <line x1="19" y1="101" x2="21" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="103" x2="24" y2="108" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="29" y1="101" x2="27" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="71" y1="101" x2="73" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="76" y1="103" x2="76" y2="108" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="81" y1="101" x2="79" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="15" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="15" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      <ellipse cx="85" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="85" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      <ellipse cx="50" cy="55" rx="36" ry="33" fill="#F7C17A" />
      <ellipse cx="12" cy="66" rx="14" ry="11" fill="#F4D4A0" />
      <ellipse cx="88" cy="66" rx="14" ry="11" fill="#F4D4A0" />
      <ellipse cx="50" cy="42" rx="22" ry="14" fill="#FDEBD0" opacity=".5" />

      {face === 'normal' && <>
        <circle cx="36" cy="50" r="9" fill="white" /><circle cx="64" cy="50" r="9" fill="white" />
        <circle cx="37" cy="51" r="6.2" fill="#1E1E2E" /><circle cx="65" cy="51" r="6.2" fill="#1E1E2E" />
        <circle cx="39.5" cy="48" r="2.5" fill="white" /><circle cx="67.5" cy="48" r="2.5" fill="white" />
        <circle cx="36" cy="54" r="1.2" fill="rgba(255,255,255,.45)" /><circle cx="64" cy="54" r="1.2" fill="rgba(255,255,255,.45)" />
      </>}
      {face === 'popped' && <>
        <circle cx="36" cy="50" r="10" fill="white" /><circle cx="64" cy="50" r="10" fill="white" />
        <circle cx="37" cy="50" r="7" fill="#1E1E2E" /><circle cx="65" cy="50" r="7" fill="#1E1E2E" />
        <circle cx="40" cy="45" r="3.5" fill="white" /><circle cx="68" cy="45" r="3.5" fill="white" />
        <circle cx="35" cy="53" r="1.8" fill="rgba(255,255,255,.6)" /><circle cx="63" cy="53" r="1.8" fill="rgba(255,255,255,.6)" />
      </>}
      {face === 'happy' && <>
        <path d="M27 51 Q36 41 45 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M55 51 Q64 41 73 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
      </>}
      {face === 'shy' && <>
        <path d="M28 47 Q36 53 44 47" fill="none" stroke="#1E1E2E" strokeWidth="3" strokeLinecap="round" />
        <path d="M56 47 Q64 53 72 47" fill="none" stroke="#1E1E2E" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="44" cy="55" rx="2" ry="3" fill="#93C5FD" opacity=".8" />
        <ellipse cx="72" cy="55" rx="2" ry="3" fill="#93C5FD" opacity=".8" />
      </>}

      <circle cx="15" cy="69" r="11" fill="#FB7185" opacity={blushOpacity} />
      <circle cx="85" cy="69" r="11" fill="#FB7185" opacity={blushOpacity} />
      <ellipse cx="50" cy="61" rx="5.5" ry="3.5" fill="#D06070" />
      <ellipse cx="48.5" cy="59.5" rx="2" ry="1.2" fill="rgba(255,255,255,.55)" />

      {face === 'normal' && <path d="M42 68 Q50 75 58 68" fill="none" stroke="#B05060" strokeWidth="2.8" strokeLinecap="round" />}
      {face === 'popped' && <>
        <path d="M35 65 Q43 61 50 61 Q57 61 65 65" fill="#B05060" />
        <path d="M35 65 Q38 85 50 88 Q62 85 65 65 Z" fill="#3D0010" />
        <path d="M35 65 Q43 69 50 69 Q57 69 65 65" fill="#E08090" />
        <ellipse cx="50" cy="82" rx="10" ry="7" fill="#FF8FAB" />
        <ellipse cx="47" cy="80" rx="3.5" ry="2.2" fill="rgba(255,255,255,.35)" />
        <rect x="41" y="63" width="7.5" height="6" rx="2" fill="white" />
        <rect x="51.5" y="63" width="7.5" height="6" rx="2" fill="white" />
        <line x1="50" y1="63" x2="50" y2="69" stroke="rgba(0,0,0,.1)" strokeWidth="1" />
      </>}
      {face === 'happy' && <>
        <path d="M40 66 Q50 77 60 66" fill="none" stroke="#B05060" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M43 68 Q50 74 57 68 L57 72 Q50 77 43 72Z" fill="white" />
        <line x1="50" y1="68" x2="50" y2="72" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
      </>}
      {face === 'shy' && <path d="M43 69 Q47 73 50 70 Q53 67 57 71" fill="none" stroke="#B05060" strokeWidth="2.5" strokeLinecap="round" />}

      <rect x="24" y="21" width="52" height="7.5" rx="3.5" fill="#1E1E2E" />
      <polygon points="50,7 77,22 50,22 23,22" fill="#1E1E2E" />
      <line x1="77" y1="22" x2="77" y2="32" stroke="#FBBF24" strokeWidth="2.5" />
      <circle cx="77" cy="34" r="3.5" fill="#FBBF24" />
      <line x1="74" y1="36" x2="71" y2="43" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <line x1="77" y1="37" x2="77" y2="44" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="36" x2="83" y2="43" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="7" r="2.8" fill="#FBBF24" />
    </svg>
  )
}

// ── Left Panel (unchanged visual, bear is static) ───────────────────────────
function LeftPanel() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-l-card max-lg:rounded-b-none max-lg:rounded-tl-card max-lg:rounded-tr-card"
      style={{ background: 'linear-gradient(160deg, #F3EBDD 0%, #EAE0D0 100%)' }}
    >
      <div className="flex-shrink-0 px-12 pt-12 pb-5">
        <Badge />
        <Hero />
        <FeatureList />
      </div>
      <div className="relative flex-1 min-h-[360px] overflow-hidden">
        {/* Static bear mascot */}
        <BearMascot />
        <HeroShowcase />
      </div>
      <TrustCard />
    </div>
  )
}

function BearMascot() {
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
      className="absolute bottom-0 left-6 w-[42%] z-[3] cursor-pointer group select-none"
      onClick={() => inputRef.current?.click()}
      title="คลิกเพื่อเปลี่ยนรูป"
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {imgUrl
        ? <img src={imgUrl} alt="mascot" className="w-full h-full object-contain object-bottom" draggable={false} />
        : <BearSVG />
      }
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 rounded-2xl"
           style={{ background: 'rgba(0,0,0,.28)' }}>
        <div className="flex flex-col items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
               fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="text-white text-[11px] font-semibold drop-shadow">เปลี่ยนรูป</span>
        </div>
      </div>
    </div>
  )
}

// ── Right Game Panel ─────────────────────────────────────────────────────────
interface GamePanelProps {
  tapScore: number
  curStep: number
  face: FaceState
  isHamPop: boolean
  ripples: number[]
  bubbleText: string
  bubbleAnim: 'in' | 'out' | null
  inputVal: string
  shaking: boolean
  onInputChange: (v: string) => void
  onInputKeyDown: (e: React.KeyboardEvent) => void
  onNext: () => void
  onSkip: () => void
  onPointerDown: (e: React.PointerEvent) => void
  hamWrapRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
}

function GameRightPanel({
  tapScore, curStep, face, isHamPop, ripples,
  bubbleText, bubbleAnim, inputVal, shaking,
  onInputChange, onInputKeyDown, onNext, onSkip, onPointerDown,
  hamWrapRef, inputRef,
}: GamePanelProps) {
  const step = STEPS[curStep]
  const speechLines = bubbleText.split('\n')

  return (
    <div className="bg-white flex flex-col rounded-r-card max-lg:rounded-t-none max-lg:rounded-b-card overflow-hidden">

      {/* HUD */}
      <div className="flex justify-between items-center px-8 pt-8 pb-3 flex-shrink-0">
        <HudBox label="TAP SCORE" value={tapScore} />
        <HudBox label="STEP" value={`${curStep + 1}`} suffix={`/5`} />
      </div>

      {/* Tappable hamster */}
      <div className="flex items-center justify-center flex-shrink-0 py-2">
        <div
          ref={hamWrapRef}
          onPointerDown={onPointerDown}
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <div style={{
            width: 130,
            height: 130,
            filter: isHamPop
              ? 'drop-shadow(0 4px 14px rgba(244,114,182,.7)) brightness(1.08)'
              : 'drop-shadow(0 8px 18px rgba(99,102,241,.22))',
            transform: isHamPop ? 'scale(1.12) translateY(-3px)' : undefined,
            animation: isHamPop ? 'none' : 'floatie 3s ease-in-out infinite',
            transition: 'transform .06s ease-out, filter .06s ease-out',
          }}>
            <HamsterSVG face={face} />
          </div>
          {ripples.map(id => (
            <div key={id} style={{
              position: 'absolute',
              borderRadius: '50%',
              width: 130, height: 130,
              top: '50%', left: '50%', margin: '-65px',
              background: 'rgba(99,102,241,.15)',
              transform: 'scale(0)',
              pointerEvents: 'none',
              animation: 'ripAnim .6s ease-out forwards',
            }} />
          ))}
        </div>
      </div>

      {/* Form area */}
      <div className="flex flex-col items-center gap-4 px-8 pb-8 flex-1 justify-end">

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              width: i === curStep ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background: i < curStep ? '#A5B4FC' : i === curStep ? '#6366F1' : '#E5E7EB',
              transition: 'all .3s',
            }} />
          ))}
        </div>

        {/* Speech bubble */}
        <div className="w-full" style={{
          background: '#F9F8FF',
          borderRadius: 20,
          padding: '14px 18px',
          position: 'relative',
          boxShadow: '0 3px 14px rgba(99,102,241,.09)',
          animation: bubbleAnim === 'out' ? 'swapOut .18s ease forwards'
            : bubbleAnim === 'in' ? 'swapIn .25s ease forwards'
            : undefined,
        }}>
          <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '10px solid #F9F8FF',
          }} />
          <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#6366F1', marginBottom: 3, letterSpacing: '.03em' }}>
            แฮมสเตอร์พูดว่า...
          </div>
          <p style={{ fontSize: '.9rem', fontWeight: 600, lineHeight: 1.6, color: '#1F2937', margin: 0 }}>
            {speechLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </p>
        </div>

        {/* Input */}
        <div className="w-full" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'white',
          border: `2px solid ${shaking ? '#F87171' : '#E5E7EB'}`,
          borderRadius: 16, padding: '13px 16px',
          boxShadow: shaking ? '0 0 0 3px rgba(248,113,113,.15)' : '0 1px 6px rgba(0,0,0,.05)',
          transition: 'border-color .2s, box-shadow .2s',
          animation: shaking ? 'shake .35s ease' : undefined,
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{step.icon}</span>
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            inputMode={step.inputMode}
            type={step.inputType}
            placeholder={step.placeholder}
            autoComplete="off"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '.95rem', fontFamily: 'inherit',
              color: '#1F2937', background: 'transparent',
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onNext}
            style={{
              width: 60, height: 60, border: 'none', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              fontSize: '1.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,.38)',
              transition: 'transform .12s, box-shadow .12s',
            }}
            onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(.92)' }}
            onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            🐾
          </button>
          {step.optional && (
            <button onClick={onSkip} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '.82rem', color: '#9CA3AF', fontFamily: 'inherit', textDecoration: 'underline', padding: '3px 8px',
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
function HudBox({ label, value, suffix }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div style={{
      background: '#F5F3FF', borderRadius: 16, padding: '8px 18px',
      textAlign: 'center', minWidth: 90,
      boxShadow: '0 2px 10px rgba(99,102,241,.08)',
    }}>
      <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#8B5CF6', letterSpacing: '.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366F1', lineHeight: 1.1 }}>
        {value}{suffix && <span style={{ fontSize: '.9rem', fontWeight: 600, color: '#9CA3AF' }}>{suffix}</span>}
      </div>
    </div>
  )
}

// ── Success overlay ──────────────────────────────────────────────────────────
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
            <ellipse cx="24" cy="99" rx="11" ry="8" fill="#F0B060" />
            <ellipse cx="76" cy="99" rx="11" ry="8" fill="#F0B060" />
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
          background: 'linear-gradient(135deg,#EEF2FF,#E0F2FE)',
          borderRadius: 18, padding: '14px 20px', margin: '14px 0',
        }}>
          <div style={{ fontSize: '.75rem', color: '#6B7280' }}>Tap Bonus Points</div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#6366F1' }}>{score}</div>
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

// ── Bear SVG (same as Mascot.tsx) ───────────────────────────────────────────
function BearSVG() {
  return (
    <svg viewBox="0 0 240 330" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="cb-bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#E2CFA0" /><stop offset="100%" stopColor="#D4BF90" />
        </radialGradient>
        <linearGradient id="cb-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECA020" /><stop offset="50%" stopColor="#D08810" /><stop offset="100%" stopColor="#B86C08" />
        </linearGradient>
        <linearGradient id="cb-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A8450" /><stop offset="100%" stopColor="#6A5428" />
        </linearGradient>
        <linearGradient id="cb-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303030" /><stop offset="100%" stopColor="#181818" />
        </linearGradient>
        <radialGradient id="cb-hs" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,.16)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="240" height="330" fill="url(#cb-bg)" />
      <ellipse cx="20" cy="288" rx="100" ry="72" fill="#C8B478" opacity=".4" />
      <ellipse cx="200" cy="295" rx="90" ry="65" fill="#BEAA68" opacity=".36" />
      <ellipse cx="120" cy="268" rx="110" ry="70" fill="#D0BC84" opacity=".32" />
      <ellipse cx="120" cy="315" rx="88" ry="22" fill="url(#cb-rock)" />
      <path d="M42 315 Q80 290 120 285 Q160 290 198 315 Q175 324 120 327 Q65 324 42 315Z" fill="#7C6230" />
      <circle cx="82" cy="148" r="26" fill="url(#cb-fur)" />
      <circle cx="82" cy="149" r="14" fill="#8C4808" opacity=".7" />
      <circle cx="158" cy="148" r="26" fill="url(#cb-fur)" />
      <circle cx="158" cy="149" r="14" fill="#8C4808" opacity=".7" />
      <ellipse cx="120" cy="258" rx="54" ry="60" fill="url(#cb-hood)" />
      <path d="M88 205 Q120 220 152 205 L162 228 Q120 242 78 228Z" fill="#1E1E1E" />
      <path d="M100 205 Q120 214 140 205 L148 218 Q120 228 92 218Z" fill="#262626" />
      <rect x="99" y="256" width="42" height="26" rx="8" fill="#151515" />
      <text x="120" y="274" textAnchor="middle" fontSize="12" fontWeight="900" fill="#D49020" fontFamily="monospace" letterSpacing="-0.5">[/]</text>
      <path d="M72 295 Q120 300 168 295 Q165 308 120 312 Q75 308 72 295Z" fill="#141414" />
      <circle cx="120" cy="188" r="60" fill="url(#cb-fur)" />
      <ellipse cx="120" cy="230" rx="45" ry="12" fill="url(#cb-hs)" />
      <ellipse cx="165" cy="195" rx="20" ry="48" fill="rgba(0,0,0,.08)" />
      <ellipse cx="108" cy="165" rx="22" ry="14" fill="rgba(255,255,255,.12)" />
      <ellipse cx="120" cy="208" rx="28" ry="21" fill="#C07518" opacity=".55" />
      <circle cx="98" cy="184" r="14" fill="white" /><circle cx="142" cy="184" r="14" fill="white" />
      <circle cx="100" cy="186" r="9" fill="#160A00" /><circle cx="144" cy="186" r="9" fill="#160A00" />
      <circle cx="103" cy="182" r="3.5" fill="white" /><circle cx="147" cy="182" r="3.5" fill="white" />
      <circle cx="97" cy="189" r="1.5" fill="white" opacity=".5" /><circle cx="141" cy="189" r="1.5" fill="white" opacity=".5" />
      <ellipse cx="120" cy="205" rx="10" ry="7" fill="#160A00" />
      <ellipse cx="117" cy="202" rx="3" ry="2.2" fill="white" opacity=".4" />
      <line x1="120" y1="212" x2="120" y2="216" stroke="#160A00" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 218 Q120 228 132 218" stroke="#160A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="205" rx="10" ry="6" fill="#E86020" opacity=".18" />
      <ellipse cx="152" cy="205" rx="10" ry="6" fill="#E86020" opacity=".18" />
      <path d="M70 240 Q52 256 56 278 Q62 285 72 278 Q69 262 84 250Z" fill="url(#cb-fur)" />
      <path d="M170 240 Q186 254 184 276 Q178 283 169 276 Q173 261 158 250Z" fill="url(#cb-fur)" />
      <g transform="rotate(32 155 240)">
        <rect x="144" y="130" width="22" height="20" rx="5" fill="#F49898" />
        <rect x="146" y="132" width="18" height="5" rx="2" fill="rgba(255,255,255,.3)" />
        <rect x="144" y="148" width="22" height="6" fill="#D0D0D0" />
        <rect x="144" y="152" width="22" height="4" fill="#B8B8B8" />
        <rect x="144" y="154" width="22" height="148" rx="3" fill="#F8D040" />
        <rect x="160" y="154" width="6" height="148" fill="rgba(0,0,0,.07)" />
        <rect x="144" y="154" width="22" height="16" rx="2" fill="#EDBE28" />
        <path d="M144 300 L166 300 L155 328Z" fill="#D8A870" />
        <path d="M149 318 L161 318 L155 328Z" fill="#3C3C3C" />
      </g>
    </svg>
  )
}

// ── Main Combined Page ───────────────────────────────────────────────────────
export function CombinedRegistrationPage() {
  const [tapScore, setTapScore] = useState(0)
  const [curStep, setCurStep] = useState(0)
  const [face, setFace] = useState<FaceState>('normal')
  const [isHamPop, setIsHamPop] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [bubbleText, setBubbleText] = useState(STEPS[0].speech)
  const [bubbleAnim, setBubbleAnim] = useState<'in' | 'out' | null>(null)
  const [shaking, setShaking] = useState(false)
  const [isShyMode, setIsShyMode] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finalScore, setFinalScore] = useState(0)

  const tapScoreRef = useRef(0)
  const isPoppedRef = useRef(false)
  const isShyRef = useRef(false)
  const shyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const hamWrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const heartsLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { tapScoreRef.current = tapScore }, [tapScore])
  useEffect(() => { isShyRef.current = isShyMode }, [isShyMode])

  const playPopSound = useCallback(() => {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
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
    const wrap = hamWrapRef.current; const layer = heartsLayerRef.current
    if (!wrap || !layer) return
    const rect = wrap.getBoundingClientRect()
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
    const count = Math.random() < 0.4 ? 1 : 2
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement('span')
        h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)]
        const dx = (Math.random() - 0.5) * 80, dy = -(55 + Math.random() * 55)
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
      setTimeout(() => { setBubbleText(STEPS[step].speech); setBubbleAnim('in'); setTimeout(() => setBubbleAnim(null), 280) }, 190)
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
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-10 max-sm:p-4"
         style={{ fontFamily: "'Sarabun','Noto Sans Thai',sans-serif" }}>

      {/* hearts overlay */}
      <div ref={heartsLayerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 600 }} />

      <div className="w-full max-w-[1160px] shadow-card rounded-card overflow-hidden grid grid-cols-[62fr_38fr] max-lg:grid-cols-1">
        <LeftPanel />
        <GameRightPanel
          tapScore={tapScore}
          curStep={curStep}
          face={face}
          isHamPop={isHamPop}
          ripples={ripples}
          bubbleText={bubbleText}
          bubbleAnim={bubbleAnim}
          inputVal={inputVal}
          shaking={shaking}
          onInputChange={setInputVal}
          onInputKeyDown={e => e.key === 'Enter' && onNext()}
          onNext={onNext}
          onSkip={onSkip}
          onPointerDown={handlePointerDown}
          hamWrapRef={hamWrapRef}
          inputRef={inputRef}
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
        @keyframes floatie { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-6px) rotate(2deg)} }
        @keyframes ripAnim  { to{transform:scale(2.2);opacity:0} }
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
