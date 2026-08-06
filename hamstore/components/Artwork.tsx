/**
 * Cover art.
 *
 * The first pass drew the same thing on every card — a gradient with soft
 * blobs, dots and a diagonal hatch — which is the look of filler, not of a
 * product someone designed. This draws a composition that belongs to the
 * thing it's selling instead: swatches for a theme, a sticker sheet for a
 * sticker pack, nested rules for a frame, terrain for an environment pack.
 *
 * Layout varies within a motif but never between renders: everything comes
 * from a seeded PRNG keyed on the item id. Random would differ between the
 * server render and the client and trip a hydration mismatch.
 */

export type Motif =
  | 'swatches'
  | 'sheet'
  | 'nested'
  | 'figure'
  | 'tracks'
  | 'terrain'
  | 'burst'
  | 'waveform'
  | 'blocks'

/* mulberry32 — same seed, same sequence, anywhere. */
function rng(seed: number) {
  let a = seed + 0x6d2b79f5
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 400
const H = 300

function draw(motif: Motif, rand: () => number, ink: string) {
  const p = (o: number) => ({ fill: ink, opacity: o })

  switch (motif) {
    /* A row of uneven colour bars, the way a palette is sampled. */
    case 'swatches': {
      let x = 26
      return Array.from({ length: 6 }, (_, i) => {
        const w = 26 + rand() * 34
        const h = 120 + rand() * 120
        const el = <rect key={i} x={x} y={(H - h) / 2} width={w} height={h} rx={8} {...p(0.14 + (i % 3) * 0.1)} />
        x += w + 12
        return el
      })
    }

    /* A sticker sheet: a loose grid of discs, a few sitting proud. */
    case 'sheet':
      return Array.from({ length: 15 }, (_, i) => {
        const col = i % 5
        const row = Math.floor(i / 5)
        return (
          <circle
            key={i}
            cx={58 + col * 72 + (rand() - 0.5) * 12}
            cy={78 + row * 74 + (rand() - 0.5) * 12}
            r={20 + rand() * 12}
            {...p(0.1 + rand() * 0.28)}
          />
        )
      })

    /* Concentric rules — a frame around a frame. */
    case 'nested':
      return Array.from({ length: 5 }, (_, i) => {
        const inset = 22 + i * 26
        return (
          <rect
            key={i}
            x={inset}
            y={inset * 0.75}
            width={W - inset * 2}
            height={H - inset * 1.5}
            rx={10}
            fill="none"
            stroke={ink}
            strokeWidth={i === 1 ? 10 : 4}
            opacity={0.14 + i * 0.07}
          />
        )
      })

    /* A blocked-in figure: head, shoulders, a stance. */
    case 'figure':
      return (
        <>
          <circle cx={W / 2} cy={96} r={44} {...p(0.3)} />
          <path d={`M${W / 2 - 74} ${H} q0-92 74-92 t74 92 Z`} {...p(0.22)} />
          <rect x={W / 2 - 16} y={150} width={32} height={90} rx={16} {...p(0.16)} />
        </>
      )

    /* A trail of prints crossing the field. */
    case 'tracks':
      return Array.from({ length: 5 }, (_, i) => {
        const cx = 52 + i * 76
        const cy = 210 - i * 30 + (rand() - 0.5) * 26
        return (
          <g key={i} opacity={0.16 + rand() * 0.2}>
            <ellipse cx={cx} cy={cy} rx={22} ry={18} fill={ink} />
            {[-1, 0, 1].map(k => (
              <circle key={k} cx={cx + k * 17} cy={cy - 26 + Math.abs(k) * 6} r={7.5} fill={ink} />
            ))}
          </g>
        )
      })

    /* Layered ridges receding into the distance. */
    case 'terrain':
      return Array.from({ length: 3 }, (_, i) => {
        const base = H - i * 46
        const peak = base - 78 - rand() * 54
        const mid = 90 + i * 110 + rand() * 40
        return (
          <path
            key={i}
            d={`M-20 ${base} L${mid} ${peak} L${mid + 120} ${base - 20} L${W + 20} ${peak + 40} L${W + 20} ${H + 20} L-20 ${H + 20} Z`}
            {...p(0.14 + i * 0.1)}
          />
        )
      })

    /* Rays out of one point. */
    case 'burst':
      return (
        <>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + rand() * 0.12
            const r1 = 46
            const r2 = 108 + rand() * 76
            return (
              <line
                key={i}
                x1={W / 2 + Math.cos(a) * r1}
                y1={H / 2 + Math.sin(a) * r1}
                x2={W / 2 + Math.cos(a) * r2}
                y2={H / 2 + Math.sin(a) * r2}
                stroke={ink}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={0.16 + rand() * 0.2}
              />
            )
          })}
          <circle cx={W / 2} cy={H / 2} r={30} {...p(0.32)} />
        </>
      )

    /* Level meter. */
    case 'waveform':
      return Array.from({ length: 17 }, (_, i) => {
        const h = 26 + rand() * 176
        return (
          <rect key={i} x={22 + i * 22} y={(H - h) / 2} width={11} height={h} rx={5.5} {...p(0.16 + rand() * 0.24)} />
        )
      })

    /* Stacked slabs, read as a kit of parts. */
    case 'blocks':
    default:
      return Array.from({ length: 6 }, (_, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        return (
          <rect
            key={i}
            x={44 + col * 108 + (rand() - 0.5) * 10}
            y={72 + row * 96}
            width={84}
            height={68}
            rx={12}
            {...p(0.13 + rand() * 0.24)}
          />
        )
      })
  }
}

export type ArtworkProps = {
  /** Stable per item — drives the whole composition. */
  seed: number
  title: string
  motif: Motif
  /** Two-tone field the composition sits on. */
  from: string
  to: string
  /** Small label in the corner. */
  label?: string
  /** A real image, when one exists, wins over the generated cover. */
  src?: string
  size?: 'sm' | 'lg'
}

export function Artwork({ seed, title, motif, from, to, label, src, size = 'sm' }: ArtworkProps) {
  const rand = rng(seed)
  const gid = `art-${seed}`

  return (
    <div className="relative h-full w-full overflow-hidden">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill={`url(#${gid}-bg)`} />
          {draw(motif, rand, '#ffffff')}
        </svg>
      )}

      {/* Darkens the lower half so the title always clears the field. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.2)_46%,transparent_74%)]" />

      {label && (
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-label text-white backdrop-blur-sm">
          {label}
        </span>
      )}

      <p
        className={`absolute inset-x-3 bottom-3 line-clamp-2 font-bold leading-tight tracking-display text-white ${
          size === 'lg' ? 'text-[clamp(1.1rem,2.2vw,1.75rem)]' : 'text-[clamp(0.95rem,1.5vw,1.25rem)]'
        }`}
      >
        {title}
      </p>
    </div>
  )
}
