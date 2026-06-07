/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: { DEFAULT: '#4d41df', light: '#675df9', soft: '#e3dfff' },
        secondary: { DEFAULT: '#0057c2', light: '#2c70e2' },
        surface: { DEFAULT: '#fcf8ff', low: '#f6f2ff', container: '#f0ecf9', high: '#eae6f3' },
        'on-surface': { DEFAULT: '#1b1b24', variant: '#464555' },
        outline: { DEFAULT: '#777587', variant: '#c7c4d8' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
