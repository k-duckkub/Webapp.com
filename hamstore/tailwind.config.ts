import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * One accent, used generously — the rest is black, cream and grey.
         *
         * HamsterHub's own pages carry a single orange and nothing else: the
         * logo, the emphasised half of a heading, the badges, the icons, the
         * prices. The store used to carry four category hues on one grid,
         * which is what made it read as a template rather than a brand.
         * Categories are told apart by their names now.
         */
        brand: {
          DEFAULT: '#F26F21',
          hover: '#DC5F14',
          /* Peach — the circle an orange icon sits in. */
          soft: '#FDEEE2',
        },
        /**
         * Warm neutrals. The previous set was Apple's, and Apple's greys are
         * cool: #f5f5f7 carries a blue cast that turns cold the moment it sits
         * beside HamsterHub's amber photography. Every ground here is warm.
         */
        paper: '#ffffff',
        mist: '#F6F2EB',
        /* Near-black rather than pure black, and warm rather than neutral. */
        graphite: '#1A1613',
        slate: {
          DEFAULT: '#7C736B',
          soft: '#9C948C',
        },
        hairline: '#E6DFD5',
        coin: '#B7791F',
        /* Kept for the dark showcase sections. */
        obsidian: '#000000',
      },
      fontFamily: {
        sans: ['var(--font-thai)', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        /* Apple sets big display type tight; small caps labels wide. */
        display: '-0.025em',
        label: '0.06em',
      },
      borderRadius: {
        card: '20px',
        panel: '32px',
      },
      boxShadow: {
        /* A card has to separate itself from a white panel, and a neutral-black
           shadow on cream goes grey and dirty. This one is warm, so the lift
           reads as light rather than as smudge. */
        card: '0 1px 2px rgba(60,42,28,0.05), 0 8px 24px -12px rgba(60,42,28,0.18)',
        lift: '0 2px 4px rgba(60,42,28,0.06), 0 18px 40px -16px rgba(60,42,28,0.28)',
      },
      maxWidth: {
        copy: '46rem',
        shell: '1120px',
      },
    },
  },
  plugins: [],
}

export default config
