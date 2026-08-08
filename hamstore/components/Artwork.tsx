'use client'

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

function draw(motif: Motif, rand: () => number, ink: string, seed: number) {
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

    /* A blocked-in figure: head, shoulders, a stance.
       The first version took no randomness at all, so every skin came out the
       same silhouette in a different hue and four cards in a row read as one
       item. Stance, head, headgear and what the figure carries all vary now —
       still off one seed, so a given skin always draws the same way. */
    case 'figure': {
      const cx = W / 2 + (rand() - 0.5) * 64
      const headR = 34 + rand() * 15
      const headY = 84 + rand() * 20
      const spread = 60 + rand() * 32
      /* Stepped off the id rather than the PRNG: random picks clustered,
         and three neighbouring skins came out wearing the same ears. */
      const headgear = seed % 3
      const carries = seed % 2 === 0

      return (
        <>
          <path d={`M${cx - spread},${H} q0,-96 ${spread},-96 t${spread},96 Z`} {...p(0.22)} />
          <circle cx={cx} cy={headY} r={headR} {...p(0.3)} />

          {headgear === 0 && (
            <rect
              x={cx - headR - 15}
              y={headY - headR - 6}
              width={(headR + 15) * 2}
              height={12}
              rx={6}
              {...p(0.34)}
            />
          )}
          {headgear === 1 && (
            <>
              <circle cx={cx - headR * 0.8} cy={headY - headR * 0.8} r={headR * 0.4} {...p(0.28)} />
              <circle cx={cx + headR * 0.8} cy={headY - headR * 0.8} r={headR * 0.4} {...p(0.28)} />
            </>
          )}
          {headgear === 2 && (
            <rect x={cx - headR} y={headY - 8} width={headR * 2} height={16} rx={8} {...p(0.38)} />
          )}

          {carries ? (
            <rect x={cx - spread - 20} y={H - 128} width={17} height={118} rx={8.5} {...p(0.2)} />
          ) : (
            <path
              d={`M${cx + spread * 0.55},${H - 154} q${spread * 0.9},44 ${spread * 0.35},154`}
              fill="none"
              stroke={ink}
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.17}
            />
          )}
        </>
      )
    }

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

    /* Layered ridges receding into the distance. Ridge count and where the
       peaks fall move with the seed, so two environment packs beside each
       other aren't the same skyline in two colours. */
    case 'terrain': {
      const layers = 2 + (seed % 3)
      return Array.from({ length: layers }, (_, i) => {
        const base = H - i * (36 + rand() * 20)
        const peak = base - 64 - rand() * 76
        const mid = 60 + rand() * (W - 200)
        const shoulder = 70 + rand() * 110
        return (
          <path
            key={i}
            d={`M-20 ${base} L${mid} ${peak} L${mid + shoulder} ${base - 20} L${W + 20} ${peak + 30 + rand() * 40} L${W + 20} ${H + 20} L-20 ${H + 20} Z`}
            {...p(0.14 + i * 0.1)}
          />
        )
      })
    }

    /* Rays out of one point. Ray count, core and origin all move with the
       seed — a fixed twelve rays from dead centre made two VFX packs on the
       same shelf read as the same package. */
    case 'burst': {
      const rays = 9 + (seed % 5)
      const ox = W / 2 + (rand() - 0.5) * 90
      const oy = H / 2 + (rand() - 0.5) * 50
      const core = 22 + rand() * 16
      const spin = rand() * Math.PI

      return (
        <>
          {Array.from({ length: rays }, (_, i) => {
            const a = (i / rays) * Math.PI * 2 + spin + rand() * 0.14
            const r1 = core + 14
            const r2 = 96 + rand() * 92
            return (
              <line
                key={i}
                x1={ox + Math.cos(a) * r1}
                y1={oy + Math.sin(a) * r1}
                x2={ox + Math.cos(a) * r2}
                y2={oy + Math.sin(a) * r2}
                stroke={ink}
                strokeWidth={5 + rand() * 4}
                strokeLinecap="round"
                opacity={0.16 + rand() * 0.2}
              />
            )
          })}
          <circle cx={ox} cy={oy} r={core} {...p(0.32)} />
        </>
      )
    }

    /* Level meter. */
    case 'waveform':
      return Array.from({ length: 17 }, (_, i) => {
        const h = 26 + rand() * 176
        return (
          <rect key={i} x={22 + i * 22} y={(H - h) / 2} width={11} height={h} rx={5.5} {...p(0.16 + rand() * 0.24)} />
        )
      })

    /* Stacked slabs, read as a kit of parts. Column count and slab proportions
       come off the seed, so two kits never lay out the same grid. */
    case 'blocks':
    default: {
      const cols = 2 + (seed % 3)
      const gap = 16
      const w = (W - 76 - gap * (cols - 1)) / cols
      const h = 58 + rand() * 30

      return Array.from({ length: cols * 2 }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        /* Every other slab runs tall, so the grid doesn't read as a table. */
        const tall = (i + seed) % 3 === 0
        return (
          <rect
            key={i}
            x={38 + col * (w + gap) + (rand() - 0.5) * 8}
            y={64 + row * (h + 22)}
            width={w}
            height={tall ? h + 24 : h}
            rx={12}
            {...p(0.12 + rand() * 0.26)}
          />
        )
      })
    }
  }
}

export type ArtworkProps = {
  /** Stable per item — drives the whole composition. */
  seed: number
  /** Omit where the name is already set beside the art — see ItemSheet. */
  title?: string
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
      {/* The drawn cover is always underneath. A photograph lays over it, and
          if that photograph fails — a pasted URL that moved, a host that is
          down — it takes itself out of the way and the drawn one shows
          through. An empty grey box is the worst of the three outcomes. */}
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={e => {
            e.currentTarget.style.display = 'none'
          }}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      )}
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
          {draw(motif, rand, '#ffffff', seed)}
      </svg>

      {/* A scrim exists to keep type legible over art. With a title it darkens
          the lower half; with only the category chip it darkens the top a
          little. Over a real photograph it does neither — it just greys the
          product — and the chip carries its own background anyway. */}
      {(title || !src) && (
        <div
          className={
            title
              ? 'absolute inset-0 z-20 bg-[linear-gradient(to_top,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.2)_46%,transparent_74%)]'
              : 'absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22)_0%,transparent_38%)]'
          }
        />
      )}

      {label && (
        <span className="absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-label text-white backdrop-blur-sm">
          {label}
        </span>
      )}

      {title && (
        <p
          className={`absolute inset-x-3 bottom-3 z-20 line-clamp-2 font-bold leading-tight tracking-display text-white ${
            size === 'lg' ? 'text-[clamp(1.1rem,2.2vw,1.75rem)]' : 'text-[clamp(0.95rem,1.5vw,1.25rem)]'
          }`}
        >
          {title}
        </p>
      )}
    </div>
  )
}
