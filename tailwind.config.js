/** @type {import('tailwindcss').Config} */
export default {
  content: ['./registration.html', './store.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-page': '#EFEBE6',
        'accent':  '#E0A152',
        'accent-soft': '#F5E9D8',
        'text-head': '#1A1A1A',
        'text-body': '#6B6259',
        'text-muted': '#9A8F84',
        'border-input': '#ECE7E0',
      },
      borderRadius: {
        card:  '28px',
        input: '14px',
        pill:  '999px',
      },
      fontFamily: {
        sans: ['Sarabun', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 32px 80px rgba(60,35,5,.15), 0 4px 16px rgba(0,0,0,.06)',
        input: '0 0 0 3px rgba(224,161,82,.18)',
      },
    },
  },
  plugins: [],
}
