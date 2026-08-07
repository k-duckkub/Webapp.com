/**
 * The icon set.
 *
 * Everything here was an emoji before. Emoji are a giveaway that nobody drew
 * the interface: they render differently on every platform, carry a colour
 * palette you don't control, sit on a baseline instead of a grid, and can't
 * take the page's stroke weight. These are drawn on a 24-unit grid with one
 * stroke width so they read as one family and inherit `currentColor`.
 */

export type IconName =
  | 'hamster'
  | 'coin'
  | 'search'
  | 'receipt'
  | 'check'
  | 'chevronRight'
  | 'arrowDown'
  | 'close'
  | 'cart'
  | 'download'
  | 'refresh'
  /* item kinds */
  | 'skin'
  | 'pet'
  | 'theme'
  | 'sticker'
  | 'frame'
  /* library categories */
  | 'all'
  | 'character'
  | 'environment'
  | 'gui'
  | 'vfx'
  | 'audio'
  | 'tools'
  | 'template'

/** Paths are stroked unless the entry opts into a fill. */
const PATHS: Record<IconName, { d: string; fill?: boolean }[]> = {
  hamster: [
    { d: 'M5.6 7.4a2.6 2.6 0 1 1 3.1-3.3M18.4 7.4a2.6 2.6 0 1 0-3.1-3.3' },
    { d: 'M12 20.5c-4.4 0-7.5-2.9-7.5-6.8S7.6 5.6 12 5.6s7.5 4.2 7.5 8.1-3.1 6.8-7.5 6.8Z' },
    { d: 'M9.4 12.4h.01M14.6 12.4h.01' },
    { d: 'M12 15.2v1.1M10.4 17.2c1 .7 2.2.7 3.2 0' },
  ],
  coin: [
    { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
    { d: 'M12 7.3v9.4M14.4 9.5c-.6-.7-1.5-1-2.4-1-1.4 0-2.4.8-2.4 1.9 0 2.6 4.9 1.3 4.9 3.9 0 1.1-1 1.9-2.5 1.9-1 0-1.9-.4-2.4-1.1' },
  ],
  search: [
    { d: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z' },
    { d: 'm20 20-4.1-4.1' },
  ],
  receipt: [
    { d: 'M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4v-17Z' },
    { d: 'M9.5 8.5h5M9.5 12.5h5' },
  ],
  check: [{ d: 'm4.5 12.8 4.8 4.7L19.5 6.9' }],
  chevronRight: [{ d: 'm9.5 5.5 7 6.5-7 6.5' }],
  arrowDown: [{ d: 'M12 4.5v15M6 13.5l6 6 6-6' }],
  close: [{ d: 'm6 6 12 12M18 6 6 18' }],
  cart: [
    { d: 'M3 4.5h2.4l2.2 10.4h9.6l2.3-7.6H6.2' },
    { d: 'M9.5 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z' },
    { d: 'M16.8 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z' },
  ],
  download: [
    { d: 'M12 3.5v11M7.5 10.5 12 15l4.5-4.5' },
    { d: 'M4.5 17v2.5h15V17' },
  ],
  refresh: [
    { d: 'M20 12a8 8 0 1 1-2.6-5.9' },
    { d: 'M20 3.5V9h-5.4' },
  ],

  skin: [
    { d: 'M8.5 3.5 12 5.6l3.5-2.1 4.5 2.6-2.2 4-1.8-.9v8.3H7v-8.3l-1.8.9-2.2-4 4.5-2.6Z' },
  ],
  pet: [
    { d: 'M12 20.5c-2.7 0-4.8-1.5-4.8-3.6 0-1.9 2-3.1 4.8-3.1s4.8 1.2 4.8 3.1c0 2.1-2.1 3.6-4.8 3.6Z' },
    { d: 'M7 11.4c-1 0-1.9-1-1.9-2.3S6 6.8 7 6.8s1.9 1 1.9 2.3S8 11.4 7 11.4ZM17 11.4c-1 0-1.9-1-1.9-2.3S16 6.8 17 6.8s1.9 1 1.9 2.3-.9 2.3-1.9 2.3ZM11.9 9.2c-1 0-1.8-1-1.8-2.3s.8-2.4 1.8-2.4 1.9 1.1 1.9 2.4-.8 2.3-1.9 2.3Z' },
  ],
  theme: [
    { d: 'M12 3.6a8.4 8.4 0 0 0 0 16.8c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7h2A5 5 0 0 0 20.4 12c0-4.6-3.8-8.4-8.4-8.4Z' },
    { d: 'M7.6 12.5h.01M9.8 8.4h.01M14.2 8.4h.01' },
  ],
  sticker: [
    { d: 'M20.4 12a8.4 8.4 0 1 0-8.4 8.4c1.3 0 5.3-3.6 6.9-5.3 1.1-1.2 1.5-2 1.5-3.1Z' },
    { d: 'M12.3 20.3c0-3.3 1.4-5 4.6-5' },
    { d: 'M9.2 10h.01M14.8 10h.01' },
  ],
  frame: [
    { d: 'M4 4h16v16H4z' },
    { d: 'M8 8h8v8H8z' },
  ],

  all: [{ d: 'M4.5 6.5h15M4.5 12h15M4.5 17.5h15' }],
  character: [
    { d: 'M12 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z' },
    { d: 'M5 20.5c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6' },
  ],
  environment: [
    { d: 'm12 3.5 5.5 9.5h-11L12 3.5Z' },
    { d: 'm8.7 13 3.3 5.7h-11L4.3 13h4.4Z' },
    { d: 'M12 18.7h11L19.7 13h-4.4' },
  ],
  gui: [
    { d: 'M3.5 5h17v14h-17z' },
    { d: 'M3.5 9.2h17M7.4 5v4.2' },
  ],
  vfx: [
    { d: 'm12 3.5 1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9 1.9-5Z' },
    { d: 'M18.5 16.5 19.3 19l2.5.8-2.5.8-.8 2.4' },
  ],
  audio: [
    { d: 'M4 14.5v-5h3.5L12 5.5v13l-4.5-4H4Z' },
    { d: 'M15.5 9.4a3.7 3.7 0 0 1 0 5.2M18.2 6.7a7.5 7.5 0 0 1 0 10.6' },
  ],
  tools: [
    { d: 'M14.8 3.6a4.9 4.9 0 0 0-4.2 7.4L3.9 17.7l2.4 2.4 6.7-6.7a4.9 4.9 0 0 0 6.2-6.6l-2.9 2.9-2.4-2.4 2.9-2.9a4.8 4.8 0 0 0-2-.8Z' },
  ],
  template: [
    { d: 'm12 3.5 8 4.3v8.4l-8 4.3-8-4.3V7.8l8-4.3Z' },
    { d: 'M4 7.8 12 12l8-4.2M12 12v8.5' },
  ],
}

export function Icon({
  name,
  className = '',
  strokeWidth = 1.7,
  style,
}: {
  name: IconName
  className?: string
  strokeWidth?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      style={style}
    >
      {PATHS[name].map((p, i) => (
        <path key={i} d={p.d} fill={p.fill ? 'currentColor' : 'none'} />
      ))}
    </svg>
  )
}
