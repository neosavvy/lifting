/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00ff00',
          dark: '#0a0a0a',
          light: '#1a1a1a',
        }
      },
      fontFamily: {
        retro: ['VT323', 'monospace'],
        cyber: ['Share Tech Mono', 'monospace'],
      }
    },
  },
  darkMode: 'class',
  plugins: [],
} 