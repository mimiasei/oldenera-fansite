/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8ba6d',
          400: '#f59533',
          500: '#f17a0b',
          600: '#e25e06',
          700: '#bb4509',
          800: '#96370f',
          900: '#7a2e10',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        skeleton: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        },
      }
    },
  },
  plugins: [],
}