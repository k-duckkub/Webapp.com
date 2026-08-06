/**
 * Generated cover art.
 *
 * Real product photography is what a store like this would ship, but until
 * those files exist every card was a lone emoji on a wash of colour, which
 * reads as a placeholder rather than a product. This draws a cover per item
 * instead: a two-tone field, a few large shapes, a pattern, and the title set
 * over it — the shape of asset-store key art, generated rather than borrowed.
 *
 * Everything is derived from the item's id, so a given item always gets the
 * same cover. That determinism matters: a random layout would differ between
 * the server render and the client and trip a hydration mismatch.
 *
 * The type is HTML on top of the SVG rather than <text> inside it. The field
 * has a fixed viewBox and is cropped to whatever aspect the card is, so text
 * inside it loses its edges on a square card — and SVG text gets none of the
 * wrapping, clamping or Thai shaping the webfont gives us in HTML.
 */

/* Small deterministic PRNG (mulberry32) — same seed, same sequence, anywhere. */
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

export type ArtworkProps = {
  /** Stable per item — drives the whole composition. */
  seed: number
  title: string
  /** Small label in the corner, e.g. the category. */
  label?: string
  /** Two-tone field the cover is built from. */
  from: string
  to: string
  /** A real image, when one exists, wins over the generated cover. */
  src?: string
  /** Larger covers get bigger type. */
  size?: 'sm' | 'lg'
}

export function Artwork({ seed, title, label, from, to, src, size = 'sm' }: ArtworkProps) {
  const rand = rng(seed)
  const angle = 90 + rand() * 120
  const gid = `art-${seed}`

  const blobs = Array.from({ length: 3 }, () => ({
    cx: 40 + rand() * 320,
    cy: 30 + rand() * 200,
    r: 60 + rand() * 110,
    o: 0.16 + rand() * 0.2,
  }))
  const dots = Array.from({ length: 14 }, () => ({
    x: rand() * 400,
    y: rand() * 300,
    r: 1.5 + rand() * 3,
  }))

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
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id={`${gid}-bg`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>

          <rect width="400" height="300" fill={`url(#${gid}-bg)`} />

          {blobs.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#fff" opacity={b.o} />
          ))}
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity="0.32" />
          ))}

          {/* Diagonal hatch, the way key art often carries a texture. */}
          <path
            d="M-80 300 L140 0 M-20 300 L200 0 M40 300 L260 0 M100 300 L320 0 M160 300 L380 0 M220 300 L440 0 M280 300 L500 0"
            stroke="#fff"
            strokeOpacity="0.1"
            strokeWidth="18"
          />
        </svg>
      )}

      {/* Darkens the lower half so the title always clears the field. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.18)_45%,transparent_72%)]" />

      {label && (
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-label text-white backdrop-blur-sm">
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
