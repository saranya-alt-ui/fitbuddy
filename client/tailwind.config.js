/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070707',
        surface: {
          DEFAULT: '#111111',
          50: '#181818',
          100: '#1f1f1f',
          200: '#2a2a2a',
        },
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          light: '#8B5CF6',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          light: '#4ADE80',
          dark: '#15803D',
        },
        accent: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          light: '#22D3EE',
          dark: '#0E7490',
        },
        muted: {
          DEFAULT: '#A1A1AA',
          dark: '#71717A',
          light: '#D4D4D8',
        }
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(124, 58, 237, 0.4)',
        'glow-secondary': '0 0 25px -5px rgba(34, 197, 94, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
