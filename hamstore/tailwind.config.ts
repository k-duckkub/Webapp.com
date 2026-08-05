import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* HamsterHub brand */
        brand: {
          DEFAULT: '#F97316',
          hover: '#EA6C00',
          soft: '#FFB27A',
        },
        /* Dark "Minecraft-ish" editorial surfaces (page 1) */
        ink: {
          950: '#0b0a09',
          900: '#0f0e0d',
          850: '#141414',
          800: '#1a1814',
          750: '#1e1c19',
          700: '#242220',
          600: '#2a2520',
          500: '#3a3530',
        },
        muted: {
          DEFAULT: '#a09880',
          dim: '#7a7060',
          bright: '#b0a898',
        },
        coin: '#FACC15',
      },
      fontFamily: {
        sans: ['var(--font-thai)', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
