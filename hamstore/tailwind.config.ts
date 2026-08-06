import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* HamsterHub's orange stays the accent — Apple's structure, our brand. */
        brand: {
          DEFAULT: '#F97316',
          hover: '#EA6C00',
          soft: '#FFF1E6',
        },
        /* Apple's two grounds: paper white, and the off-white it alternates with. */
        paper: '#ffffff',
        mist: '#f5f5f7',
        /* Near-black rather than pure black — pure #000 on white is too harsh. */
        graphite: '#1d1d1f',
        slate: {
          DEFAULT: '#6e6e73',
          soft: '#86868b',
        },
        hairline: '#d2d2d7',
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
        card: '18px',
        panel: '28px',
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
