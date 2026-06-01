import { useCallback, useEffect, useRef, useState } from 'react'

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
  { speech: 'เยี่ยมมากเลยครับ!\nแล้วขอ ชื่อเล่น ของคุณด้วยนะครับ 😊',
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

// ── Hamster SVG ────────────────────────────────────────────────────────────
function HamsterSVG({ face }: { face: FaceState }) {
  const show = (state: FaceState) => face === state
  const blushOpacity = face === 'popped' ? 0.4 : face === 'happy' ? 0.3 : face === 'shy' ? 0.8 : 0

  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* shadow */}
      <ellipse cx="50" cy="113" rx="24" ry="4.5" fill="rgba(0,0,0,.1)" />
      {/* body */}
      <ellipse cx="50" cy="90" rx="28" ry="23" fill="#F7C17A" />
      <ellipse cx="50" cy="93" rx="18" ry="14" fill="#FDEBD0" />
      {/* paws */}
      <ellipse cx="24" cy="99" rx="11" ry="8" fill="#F0B060" />
      <ellipse cx="76" cy="99" rx="11" ry="8" fill="#F0B060" />
      <line x1="19" y1="101" x2="21" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="103" x2="24" y2="108" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="29" y1="101" x2="27" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="71" y1="101" x2="73" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="76" y1="103" x2="76" y2="108" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="81" y1="101" x2="79" y2="106" stroke="#D9944A" strokeWidth="1.8" strokeLinecap="round" />
      {/* ears */}
      <ellipse cx="15" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="15" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      <ellipse cx="85" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="85" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      {/* head */}
      <ellipse cx="50" cy="55" rx="36" ry="33" fill="#F7C17A" />
      {/* chubby cheek pouches */}
      <ellipse cx="12" cy="66" rx="14" ry="11" fill="#F4D4A0" />
      <ellipse cx="88" cy="66" rx="14" ry="11" fill="#F4D4A0" />
      {/* forehead lighter */}
      <ellipse cx="50" cy="42" rx="22" ry="14" fill="#FDEBD0" opacity=".5" />

      {/* EYES normal */}
      {show('normal') && (
        <g>
          <circle cx="36" cy="50" r="9" fill="white" />
          <circle cx="64" cy="50" r="9" fill="white" />
          <circle cx="37" cy="51" r="6.2" fill="#1E1E2E" />
          <circle cx="65" cy="51" r="6.2" fill="#1E1E2E" />
          <circle cx="39.5" cy="48" r="2.5" fill="white" />
          <circle cx="67.5" cy="48" r="2.5" fill="white" />
          <circle cx="36" cy="54" r="1.2" fill="rgba(255,255,255,.45)" />
          <circle cx="64" cy="54" r="1.2" fill="rgba(255,255,255,.45)" />
        </g>
      )}
      {/* EYES popped */}
      {show('popped') && (
        <g>
          <circle cx="36" cy="50" r="10" fill="white" />
          <circle cx="64" cy="50" r="10" fill="white" />
          <circle cx="37" cy="50" r="7" fill="#1E1E2E" />
          <circle cx="65" cy="50" r="7" fill="#1E1E2E" />
          <circle cx="40" cy="45" r="3.5" fill="white" />
          <circle cx="68" cy="45" r="3.5" fill="white" />
          <circle cx="35" cy="53" r="1.8" fill="rgba(255,255,255,.6)" />
          <circle cx="63" cy="53" r="1.8" fill="rgba(255,255,255,.6)" />
        </g>
      )}
      {/* EYES happy */}
      {show('happy') && (
        <g>
          <path d="M27 51 Q36 41 45 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M55 51 Q64 41 73 51" fill="none" stroke="#1E1E2E" strokeWidth="3.8" strokeLinecap="round" />
        </g>
      )}
      {/* EYES shy */}
      {show('shy') && (
        <g>
          <path d="M28 47 Q36 53 44 47" fill="none" stroke="#1E1E2E" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 47 Q64 53 72 47" fill="none" stroke="#1E1E2E" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="44" cy="55" rx="2" ry="3" fill="#93C5FD" opacity=".8" />
          <ellipse cx="72" cy="55" rx="2" ry="3" fill="#93C5FD" opacity=".8" />
        </g>
      )}

      {/* blush */}
      <circle cx="15" cy="69" r="11" fill="#FB7185" opacity={blushOpacity} />
      <circle cx="85" cy="69" r="11" fill="#FB7185" opacity={blushOpacity} />

      {/* nose */}
      <ellipse cx="50" cy="61" rx="5.5" ry="3.5" fill="#D06070" />
      <ellipse cx="48.5" cy="59.5" rx="2" ry="1.2" fill="rgba(255,255,255,.55)" />

      {/* MOUTH normal */}
      {show('normal') && (
        <path d="M42 68 Q50 75 58 68" fill="none" stroke="#B05060" strokeWidth="2.8" strokeLinecap="round" />
      )}
      {/* MOUTH popped */}
      {show('popped') && (
        <g>
          <path d="M35 65 Q43 61 50 61 Q57 61 65 65" fill="#B05060" />
          <path d="M35 65 Q38 85 50 88 Q62 85 65 65 Z" fill="#3D0010" />
          <path d="M35 65 Q43 69 50 69 Q57 69 65 65" fill="#E08090" />
          <ellipse cx="50" cy="82" rx="10" ry="7" fill="#FF8FAB" />
          <ellipse cx="47" cy="80" rx="3.5" ry="2.2" fill="rgba(255,255,255,.35)" />
          <rect x="41" y="63" width="7.5" height="6" rx="2" fill="white" />
          <rect x="51.5" y="63" width="7.5" height="6" rx="2" fill="white" />
          <line x1="50" y1="63" x2="50" y2="69" stroke="rgba(0,0,0,.1)" strokeWidth="1" />
        </g>
      )}
      {/* MOUTH happy */}
      {show('happy') && (
        <g>
          <path d="M40 66 Q50 77 60 66" fill="none" stroke="#B05060" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M43 68 Q50 74 57 68 L57 72 Q50 77 43 72Z" fill="white" />
          <line x1="50" y1="68" x2="50" y2="72" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
        </g>
      )}
      {/* MOUTH shy */}
      {show('shy') && (
        <path d="M43 69 Q47 73 50 70 Q53 67 57 71" fill="none" stroke="#B05060" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* graduation cap */}
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

// ── Success Hamster (happy face, static) ──────────────────────────────────
function SuccessHamsterSVG() {
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" width="110" height="110">
      <ellipse cx="50" cy="113" rx="23" ry="4" fill="rgba(0,0,0,.08)" />
      <ellipse cx="50" cy="90" rx="28" ry="23" fill="#F7C17A" />
      <ellipse cx="50" cy="93" rx="18" ry="14" fill="#FDEBD0" />
      <ellipse cx="24" cy="99" rx="11" ry="8" fill="#F0B060" />
      <ellipse cx="76" cy="99" rx="11" ry="8" fill="#F0B060" />
      <ellipse cx="15" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="15" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      <ellipse cx="85" cy="35" rx="13" ry="15" fill="#E8A050" />
      <ellipse cx="85" cy="35" rx="8" ry="10" fill="#F5B8C0" />
      <ellipse cx="50" cy="55" rx="36" ry="33" fill="#F7C17A" />
      <ellipse cx="12" cy="66" rx="14" ry="11" fill="#F4D4A0" />
      <ellipse cx="88" cy="66" rx="14" ry="11" fill="#F4D4A0" />
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
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export function GameRegistrationPage() {
  const [tapScore, setTapScore] = useState(0)
  const [curStep, setCurStep] = useState(0)
  const [face, setFace] = useState<FaceState>('normal')
  const [isPopped, setIsPopped] = useState(false)
  const [isShyMode, setIsShyMode] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [bubbleText, setBubbleText] = useState(STEPS[0].speech)
  const [bubbleAnim, setBubbleAnim] = useState<'in' | 'out' | null>(null)
  const [shaking, setShaking] = useState(false)
  const [isHamPop, setIsHamPop] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finalScore, setFinalScore] = useState(0)
  const [ripples, setRipples] = useState<number[]>([])

  const tapScoreRef = useRef(0)
  const shyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const hamWrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const heartsLayerRef = useRef<HTMLDivElement>(null)
  const isPoppedRef = useRef(false)
  const isShyRef = useRef(false)

  // keep refs in sync
  useEffect(() => { tapScoreRef.current = tapScore }, [tapScore])
  useEffect(() => { isShyRef.current = isShyMode }, [isShyMode])
  useEffect(() => { isPoppedRef.current = isPopped }, [isPopped])

  // ── pop sound ──
  const playPopSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(680, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.12)
    } catch { /* ignore */ }
  }, [])

  // ── hearts ──
  const spawnHearts = useCallback(() => {
    const wrap = hamWrapRef.current
    const layer = heartsLayerRef.current
    if (!wrap || !layer) return
    const rect = wrap.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const count = Math.random() < 0.4 ? 1 : 2
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement('span')
        h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)]
        const dx = (Math.random() - 0.5) * 90
        const dy = -(65 + Math.random() * 65)
        h.style.cssText = `
          position:fixed;left:${cx}px;top:${cy}px;
          font-size:${(0.9 + Math.random()).toFixed(2)}rem;line-height:1;
          pointer-events:none;z-index:600;transform:translate(-50%,-50%);
        `
        layer.appendChild(h)
        h.animate([
          { transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx * 0.5}px),calc(-50% + ${dy * 0.45}px)) scale(1.4)`, opacity: 0.9, offset: 0.5 },
          { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.5)`, opacity: 0 },
        ], { duration: 1100, easing: 'ease-out', fill: 'forwards' })
          .addEventListener('finish', () => h.remove())
      }, i * 80)
    }
  }, [])

  // ── triggerShy ──
  const triggerShy = useCallback(() => {
    isShyRef.current = true
    setIsShyMode(true)
    if (!isPoppedRef.current) setFace('shy')
    for (let i = 0; i < 8; i++) setTimeout(spawnHearts, i * 70)
    if (shyTimerRef.current) clearTimeout(shyTimerRef.current)
    shyTimerRef.current = setTimeout(() => {
      isShyRef.current = false
      setIsShyMode(false)
      if (!isPoppedRef.current) setFace('normal')
    }, 3500)
  }, [spawnHearts])

  // ── onTap ──
  const onTap = useCallback(() => {
    setTapScore(prev => {
      const next = prev + 1
      tapScoreRef.current = next
      if (next === SHY_THRESHOLD) setTimeout(triggerShy, 0)
      return next
    })
    spawnHearts()
    playPopSound()
  }, [spawnHearts, playPopSound, triggerShy])

  // ── ripple ──
  const spawnRipple = useCallback(() => {
    const id = Date.now()
    setRipples(r => [...r, id])
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 660)
  }, [])

  // ── pointerdown / pointerup handlers ──
  useEffect(() => {
    const wrap = hamWrapRef.current
    if (!wrap) return

    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      if (!isPoppedRef.current) {
        isPoppedRef.current = true
        setIsPopped(true)
        setFace('popped')
        setIsHamPop(true)
        onTap()
        spawnRipple()
      }
    }
    const onUp = () => {
      if (isPoppedRef.current) {
        isPoppedRef.current = false
        setIsPopped(false)
        setIsHamPop(false)
        setFace(isShyRef.current ? 'shy' : 'normal')
      }
    }

    wrap.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      wrap.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [onTap, spawnRipple])

  // ── load step ──
  const loadStep = useCallback((step: number, animate: boolean) => {
    setCurStep(step)
    setInputVal('')
    if (animate) {
      setBubbleAnim('out')
      setTimeout(() => {
        setBubbleText(STEPS[step].speech)
        setBubbleAnim('in')
        setTimeout(() => setBubbleAnim(null), 280)
      }, 190)
    } else {
      setBubbleText(STEPS[step].speech)
    }
    setTimeout(() => inputRef.current?.focus(), 350)
  }, [])

  // ── advance ──
  const advance = useCallback((val: string | null) => {
    const step = curStep
    setAnswers(prev => ({ ...prev, [STEPS[step].field]: val ?? '' }))
    setFace('happy')
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    tapTimerRef.current = setTimeout(() => {
      setFace(isShyRef.current ? 'shy' : 'normal')
    }, 700)
    if (step < TOTAL - 1) {
      loadStep(step + 1, true)
    } else {
      setTimeout(() => {
        setFinalScore(tapScoreRef.current)
        setShowSuccess(true)
        for (let i = 0; i < 14; i++) setTimeout(spawnHearts, i * 90)
      }, 400)
    }
  }, [curStep, loadStep, spawnHearts])

  const onNext = useCallback(() => {
    const val = inputVal.trim()
    if (!val) {
      setShaking(true)
      setTimeout(() => setShaking(false), 400)
      return
    }
    advance(val)
  }, [inputVal, advance])

  const onSkip = useCallback(() => {
    advance(null)
  }, [advance])

  const step = STEPS[curStep]

  // split speech text on newline for rendering
  const speechLines = bubbleText.split('\n')

  return (
    <div style={{
      background: 'linear-gradient(150deg,#C7D2FE 0%,#BAE6FD 100%)',
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Sarabun','Noto Sans Thai',sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* hearts layer */}
      <div ref={heartsLayerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 600 }} />

      {/* paw BG */}
      <PawBG />

      {/* App card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: 'min(390px, 96vw)',
        height: 'min(740px, 96dvh)',
        background: 'rgba(255,255,255,.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 40,
        boxShadow: '0 32px 64px rgba(99,102,241,.22), 0 0 0 1.5px rgba(255,255,255,.8) inset',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '0 0 28px',
      }}>

        {/* HUD */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px 6px' }}>
          <HudBox label="TAP SCORE" value={tapScore} />
          <HudBox label="STEP" value={`${curStep + 1}`} suffix={`/5`} />
        </div>

        {/* Hamster area */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <div
            ref={hamWrapRef}
            style={{
              position: 'relative',
              width: 220,
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            <div style={{
              width: 210,
              height: 210,
              filter: isHamPop
                ? 'drop-shadow(0 4px 18px rgba(244,114,182,.7)) brightness(1.08)'
                : 'drop-shadow(0 12px 24px rgba(99,102,241,.25))',
              transform: isHamPop ? 'scale(1.1) translateY(-4px)' : undefined,
              animation: isHamPop ? 'none' : 'floatie 3s ease-in-out infinite',
              transition: 'transform .06s ease-out, filter .06s ease-out',
            }}>
              <HamsterSVG face={face} />
            </div>
            {/* ripples */}
            {ripples.map(id => (
              <div key={id} style={{
                position: 'absolute',
                borderRadius: '50%',
                width: 200,
                height: 200,
                top: '50%',
                left: '50%',
                margin: '-100px',
                background: 'rgba(244,114,182,.18)',
                transform: 'scale(0)',
                pointerEvents: 'none',
                animation: 'ripAnim .6s ease-out forwards',
              }} />
            ))}
          </div>
        </div>

        {/* Form area */}
        <div style={{ width: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 7 }}>
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
          <div style={{
            background: 'white',
            borderRadius: 22,
            padding: '14px 20px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 4px 18px rgba(0,0,0,.08)',
            position: 'relative',
            animation: bubbleAnim === 'out' ? 'swapOut .18s ease forwards'
              : bubbleAnim === 'in' ? 'swapIn .25s ease forwards'
              : undefined,
          }}>
            {/* bubble tail */}
            <div style={{
              content: '',
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '11px solid white',
            }} />
            <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#6366F1', marginBottom: 3, letterSpacing: '.03em' }}>
              แฮมสเตอร์พูดว่า...
            </div>
            <p style={{ fontSize: '.97rem', fontWeight: 600, lineHeight: 1.6, color: '#1F2937' }}>
              {speechLines.map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </p>
          </div>

          {/* Input row */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'white',
            border: `2.5px solid ${shaking ? '#F87171' : '#E5E7EB'}`,
            borderRadius: 18,
            padding: '14px 16px',
            transition: 'border-color .2s, box-shadow .2s',
            boxShadow: shaking ? '0 0 0 3px rgba(248,113,113,.18)' : undefined,
            animation: shaking ? 'shake .35s ease' : undefined,
          }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{step.icon}</span>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onNext()}
              inputMode={step.inputMode}
              type={step.inputType}
              placeholder={step.placeholder}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontFamily: 'inherit',
                color: '#1F2937',
                background: 'transparent',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onNext}
              style={{
                width: 64,
                height: 64,
                border: 'none',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                fontSize: '1.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 22px rgba(99,102,241,.42)',
                transition: 'transform .12s, box-shadow .12s',
              }}
              onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(.92)' }}
              onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              🐾
            </button>
            {step.optional && (
              <button
                onClick={onSkip}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '.84rem',
                  color: '#6B7280',
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                  padding: '4px 8px',
                }}
              >
                ไม่มีโค้ด ข้ามได้เลย →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 700,
          background: 'rgba(99,102,241,.15)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn .3s ease',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 32,
            padding: '32px 28px',
            textAlign: 'center',
            maxWidth: 'min(340px, 92vw)',
            boxShadow: '0 28px 56px rgba(0,0,0,.16)',
            animation: 'popIn .4s cubic-bezier(.34,1.56,.64,1)',
          }}>
            <div style={{ width: 110, height: 110, margin: '0 auto', animation: 'wiggle 1.1s ease-in-out infinite' }}>
              <SuccessHamsterSVG />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', margin: '10px 0 5px' }}>
              ลงทะเบียนสำเร็จ! 🎉
            </h2>
            <p style={{ fontSize: '.92rem', color: '#6B7280', lineHeight: 1.6 }}>
              ขอบคุณมากเลยครับ แฮมสเตอร์ดีใจมากเลย~ 💕
            </p>
            <div style={{
              background: 'linear-gradient(135deg,#C7D2FE,#BAE6FD)',
              borderRadius: 18,
              padding: '14px 20px',
              margin: '14px 0',
            }}>
              <div style={{ fontSize: '.78rem', color: '#6B7280' }}>Tap Bonus Points ของคุณ</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#6366F1' }}>{finalScore}</div>
              <div style={{ fontSize: '.78rem', color: '#6B7280' }}>แต้มโบนัสเริ่มต้น</div>
            </div>
            <div style={{ fontSize: '.88rem', color: '#6B7280', lineHeight: 1.65 }}>
              ยินดีต้อนรับ <strong style={{ color: '#1F2937' }}>{answers.firstName || 'เพื่อน'}{answers.nickname ? ` (${answers.nickname})` : ''}</strong>!<br />
              แต้มโบนัสของคุณคือ <strong style={{ color: '#1F2937' }}>{finalScore}</strong> แต้ม 🎊
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes floatie {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes ripAnim { to { transform: scale(2.2); opacity: 0; } }
        @keyframes swapOut { to   { opacity: 0; transform: translateY(-8px); } }
        @keyframes swapIn  { from { opacity: 0; transform: translateY(8px); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn  { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes wiggle { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        @keyframes pawBob { from { transform: rotate(var(--rot)) translateY(0); } to { transform: rotate(var(--rot)) translateY(-14px); } }
      `}</style>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────
function HudBox({ label, value, suffix }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '8px 16px',
      boxShadow: '0 2px 12px rgba(0,0,0,.08)',
      textAlign: 'center',
      minWidth: 80,
    }}>
      <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#6B7280', letterSpacing: '.05em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366F1', lineHeight: 1.1 }}>
        {value}{suffix && <span style={{ fontSize: '1rem', fontWeight: 600, color: '#6B7280' }}>{suffix}</span>}
      </div>
    </div>
  )
}

function PawBG() {
  const paws = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    top: `${((i * 17 + 7) % 100).toFixed(1)}%`,
    left: `${((i * 23 + 11) % 100).toFixed(1)}%`,
    sz: `${(1.2 + (i % 5) * 0.4).toFixed(1)}rem`,
    rot: `${((i * 13 - 35) % 70).toFixed(1)}deg`,
    dur: `${(2.5 + (i % 6) * 0.5).toFixed(1)}s`,
    delay: `${(i * 0.13).toFixed(2)}s`,
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {paws.map(p => (
        <span key={p.id} style={{
          position: 'absolute',
          opacity: 0.06,
          fontSize: p.sz,
          top: p.top,
          left: p.left,
          ['--rot' as string]: p.rot,
          transform: `rotate(${p.rot})`,
          animation: `pawBob ${p.dur} ${p.delay} ease-in-out infinite alternate`,
        }}>
          🐾
        </span>
      ))}
    </div>
  )
}
